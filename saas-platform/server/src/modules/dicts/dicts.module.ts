import { Module } from '@nestjs/common';
import { DictsController } from './dicts.controller';
import { DictsService } from './dicts.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DictsController],
  providers: [DictsService],
  exports: [DictsService],
})
export class DictsModule {}
