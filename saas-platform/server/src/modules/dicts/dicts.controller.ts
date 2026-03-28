import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dicts', '字典管理')
@Controller('dicts')
export class DictsController {
  @Get()
  findAll() {
    return { success: true, code: 'SUCCESS', message: '待实现', data: [] };
  }
}
