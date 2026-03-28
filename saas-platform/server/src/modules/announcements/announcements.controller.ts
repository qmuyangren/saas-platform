import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('announcements', '公告管理')
@Controller('announcements')
export class AnnouncementsController {
  @Get()
  findAll() {
    return { success: true, code: 'SUCCESS', message: '待实现', data: [] };
  }
}
