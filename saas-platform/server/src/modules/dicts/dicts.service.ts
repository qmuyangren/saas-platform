import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DictsService {
  constructor(private prisma: PrismaService) {}
}
