import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../user/entity/otp.entity';
import { CheckOtpDto, SendOtpDto } from './dto/otp.dto';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { TokensPayload } from './types/payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,

    private jwtService: JwtService,
  ) {}

  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;

    let user = await this.userRepository.findOneBy({ mobile });

    if (!user) {
      user = this.userRepository.create({
        mobile,
      });

      user = await this.userRepository.save(user);
    }

    await this.createOtp(user);

    return {
      message: `کد برای شماره موبایل ${mobile} ارسال شد.`,
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;

    const user = await this.userRepository.findOne({
      where: { mobile },
      relations: ['otp'],
    });

    const now = new Date();

    if (!user || !user.otp) {
      throw new UnauthorizedException('کاربری با این شماره موبایل یافت نشد.');
    }

    const otp = user?.otp;

    if (otp.expires_in < now) {
      throw new UnauthorizedException('کد منقضی شده است.');
    }

    if (otp.code !== code) {
      throw new UnauthorizedException('کد معتبر نمیباشد.');
    }

    if (!user.mobile_verified) {
      await this.userRepository.update(
        { id: user.id },
        {
          mobile_verified: true,
        },
      );
    }

    const { accessToken, refreshToken } = this.generateJwtTokens({
      id: user.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (user) throw new ConflictException('این ایمیل قبلا ثبت نام شده است.');
  }
  async checkMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile });

    if (user) throw new ConflictException('این موبایل قبلا ثبت نام شده است.');
  }

  async createOtp(user: UserEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();

    let otp = await this.otpRepository.findOneBy({ userId: user.id });

    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('کد قبلی هنوز منقضی نشده است.');
      }

      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in: expiresIn,
        userId: user.id,
      });
    }

    otp = await this.otpRepository.save(otp);

    user.otpId = otp.id;

    await this.userRepository.save(user);
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      if (typeof payload === 'object' && payload?.id) {
        const user = await this.userRepository.findOneBy({
          id: payload.id,
        });

        if (!user) {
          throw new UnauthorizedException('ابندا وارد حساب کاربری خود شوید.');
        }

        return {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          mobile: user.mobile,
        };
      }

      throw new UnauthorizedException('ابندا وارد حساب کاربری خود شوید.');
    } catch (error) {
      throw new UnauthorizedException('ابندا وارد حساب کاربری خود شوید.');
    }
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
}
