import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles', '角色管理')
@Controller('roles')
export class RolesController {
  @Get()
  findAll() {
    return { success: true, code: 'SUCCESS', message: '待实现', data: [] };
  }
}
