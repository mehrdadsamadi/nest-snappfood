import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuFeedbackService } from '../services/feedback.service';

@Controller('menu-feedback')
@ApiTags('Menu-feedback')
export class MenuFeedbackController {
  constructor(private readonly menuFeedbackService: MenuFeedbackService) {}
}
