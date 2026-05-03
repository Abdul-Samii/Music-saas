import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MetaAdsModule } from './meta-ads/meta-ads.module';
import { SpotifyModule } from './spotify/spotify.module';
import { MediaModule } from './media/media.module';
import { EarlyAccessModule } from './early-access/early-access.module';
import { AdminModule } from './admin/admin.module';
import { LandingPagesModule } from './landing-pages/landing-pages.module';
import { ZonesModule } from './zones/zones.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CampaignsModule,
    AnalyticsModule,
    MetaAdsModule,
    SpotifyModule,
    MediaModule,
    EarlyAccessModule,
    AdminModule,
    LandingPagesModule,
    ZonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
