import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RecordMetricDto } from './dto/record-metric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

type SafeUser = { id: string; email: string; name: string | null };

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  // Overall dashboard stats
  @Get('overview')
  overview(@CurrentUser() user: SafeUser) {
    return this.analytics.overview(user.id);
  }

  // Top performing campaigns by stream count
  @Get('top-campaigns')
  topCampaigns(@CurrentUser() user: SafeUser, @Query('limit') limit?: string) {
    return this.analytics.topCampaigns(user.id, limit ? Number(limit) : 5);
  }

  // Metrics for a specific campaign (summary + daily breakdown)
  @Get('campaigns/:id')
  campaignMetrics(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.analytics.campaignMetrics(id, user.id);
  }

  // Record a daily metric entry for a campaign
  @Post('campaigns/:id/metrics')
  @HttpCode(HttpStatus.CREATED)
  recordMetric(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
    @Body() dto: RecordMetricDto,
  ) {
    return this.analytics.recordMetric(id, user.id, dto);
  }
}
