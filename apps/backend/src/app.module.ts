import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MetaAdsModule } from './meta-ads/meta-ads.module';
import { SpotifyModule } from './spotify/spotify.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, CampaignsModule, AnalyticsModule, MetaAdsModule, SpotifyModule, MediaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
