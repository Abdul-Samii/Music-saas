import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { RenderVideoService } from './render-video.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MediaController],
  providers: [MediaService, RenderVideoService],
  exports: [MediaService, RenderVideoService],
})
export class MediaModule {}
