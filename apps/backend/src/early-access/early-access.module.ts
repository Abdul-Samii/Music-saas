import { Module } from '@nestjs/common';
import { EarlyAccessController } from './early-access.controller';
import { EarlyAccessService } from './early-access.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EarlyAccessController],
  providers: [EarlyAccessService],
})
export class EarlyAccessModule {}
