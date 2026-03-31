import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CampaignStatus } from '@prisma/client';

type SafeUser = { id: string; email: string; name: string | null };

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaigns: CampaignsService) {}

  @Get()
  list(@CurrentUser() user: SafeUser) {
    return this.campaigns.findAll(user.id);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.campaigns.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: SafeUser, @Body() dto: CreateCampaignDto) {
    return this.campaigns.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaigns.update(id, user.id, dto);
  }

  @Post(':id/launch')
  @HttpCode(HttpStatus.OK)
  launch(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.campaigns.updateStatus(id, user.id, CampaignStatus.ACTIVE);
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  pause(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.campaigns.updateStatus(id, user.id, CampaignStatus.PAUSED);
  }

  @Post(':id/resume')
  @HttpCode(HttpStatus.OK)
  resume(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.campaigns.updateStatus(id, user.id, CampaignStatus.ACTIVE);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.campaigns.remove(id, user.id);
  }
}
