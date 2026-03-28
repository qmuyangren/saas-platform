import { Module, Global, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const PrismaProvider: Provider = {
  provide: 'PrismaService',
  useClass: PrismaService,
};

@Global()
@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class PrismaModule {}
