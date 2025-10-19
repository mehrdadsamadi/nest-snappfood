import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import {
  SupplementaryInformationDto,
  SupplierSignupDto,
} from './dto/supplier.dto';
import { CategoryService } from '../category/category.service';
import { SupplierOtpEntity } from './entities/otp.entity';
import { randomInt } from 'crypto';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { TokensPayload } from '../auth/types/payload';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SupplierStatus } from './enum/status.enum';
import { DocumentType } from './type';
import { S3Service } from '../s3/s3.service';

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,

    @InjectRepository(SupplierOtpEntity)
    private supplierOtpRepository: Repository<SupplierOtpEntity>,

    @Inject(REQUEST) private req: Request,

    private categoryService: CategoryService,

    private jwtService: JwtService,

    private s3Service: S3Service,
  ) {}

  async signup(signupDto: SupplierSignupDto) {
    const {
      categoryId,
      manager_family,
      manager_name,
      store_name,
      phone,
      invite_code,
      city,
    } = signupDto;

    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (supplier) throw new ConflictException('supplier already exists');

    const category = await this.categoryService.findOneById(categoryId);

    let agent: SupplierEntity | null = null;

    if (invite_code) {
      agent = await this.supplierRepository.findOneBy({ invite_code });
    }

    const phoneNumber = parseInt(phone);

    const account = this.supplierRepository.create({
      categoryId: category?.id,
      manager_family,
      manager_name,
      store_name,
      phone,
      city,
      agentId: agent?.id,
      invite_code: phoneNumber.toString(32).toUpperCase(),
    });

    await this.supplierRepository.save(account);

    await this.createOtp(account);

    return {
      message: 'supplier created successfully',
    };
  }

  async saveSupplementaryInformation(infoDto: SupplementaryInformationDto) {
    const { id } = this.req.user!;

    const { national_code, email } = infoDto;

    let supplier = await this.supplierRepository.findOneBy({ national_code });
    if (supplier && supplier.id !== id)
      throw new ConflictException('national_code already used');

    supplier = await this.supplierRepository.findOneBy({ email });
    if (supplier && supplier.id !== id)
      throw new ConflictException('email already used');

    await this.supplierRepository.update(
      { id },
      {
        national_code,
        email,
        status: SupplierStatus.SUPPLEMENTARY_INFORMATION,
      },
    );

    return {
      message: 'supplier updated successfully',
    };
  }

  async uploadDocuments(files: DocumentType) {
    const { id } = this.req.user!;
    const { acceptedDoc, image } = files;

    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) throw new ConflictException('supplier not found');

    const imageResult = await this.s3Service.uploadFile(
      image[0],
      'supplierImages',
    );
    const docsResult = await this.s3Service.uploadFile(
      acceptedDoc[0],
      'supplierAcceptedDocs',
    );

    if (imageResult) supplier.image = imageResult.Location;
    if (docsResult) supplier.document = docsResult.Location;
    supplier.status = SupplierStatus.UPLOADED_DOCUMENTS;

    await this.supplierRepository.save(supplier);

    return {
      message: 'supplier updated successfully',
    };
  }

  async createOtp(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();

    let otp = await this.supplierOtpRepository.findOneBy({
      supplierId: supplier.id,
    });

    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('کد قبلی هنوز منقضی نشده است.');
      }

      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.supplierOtpRepository.create({
        code,
        expires_in: expiresIn,
        supplierId: supplier.id,
      });
    }

    otp = await this.supplierOtpRepository.save(otp);

    supplier.otpId = otp.id;

    await this.supplierRepository.save(supplier);
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;

    const supplier = await this.supplierRepository.findOne({
      where: { phone: mobile },
      relations: ['otp'],
    });

    const now = new Date();

    if (!supplier || !supplier.otp) {
      throw new UnauthorizedException('کاربری با این شماره موبایل یافت نشد.');
    }

    const otp = supplier?.otp;

    if (otp.expires_in < now) {
      throw new UnauthorizedException('کد منقضی شده است.');
    }

    if (otp.code !== code) {
      throw new UnauthorizedException('کد معتبر نمیباشد.');
    }

    if (!supplier.mobile_verified) {
      await this.supplierRepository.update(
        { id: supplier.id },
        {
          mobile_verified: true,
        },
      );
    }

    const { accessToken, refreshToken } = this.generateJwtTokens({
      id: supplier.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  generateJwtTokens(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '30d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1y',
    });

    return { accessToken, refreshToken };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      if (typeof payload === 'object' && payload?.id) {
        const user = await this.supplierRepository.findOneBy({
          id: payload.id,
        });

        if (!user) {
          throw new UnauthorizedException('ابندا وارد حساب کاربری خود شوید.');
        }

        return user;
      }

      throw new UnauthorizedException('ابندا وارد حساب کاربری خود شوید.');
    } catch (error) {
      throw new UnauthorizedException('ابندا وارد حساب کاربری خود شوید.');
    }
  }
}
