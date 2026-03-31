import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

type SafeUser = { id: string; email: string; name: string | null };

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('overview')
  overview(@CurrentUser() user: SafeUser) {
    return this.analytics.overview(user.id);
  }

  @Get('campaigns/:id')
  campaignMetrics(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.analytics.campaignMetrics(id, user.id);
  }
}
