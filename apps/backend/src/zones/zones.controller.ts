import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

type JwtUser = { id: string; email: string };

@UseGuards(JwtAuthGuard)
@Controller('zones')
export class ZonesController {
  constructor(private zones: ZonesService) {}

  @Get()
  list(@CurrentUser() user: JwtUser) {
    return this.zones.list(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body() body: { name: string; countries: string[] },
  ) {
    return this.zones.create(user.id, body.name, body.countries);
  }

  @Delete(':id')
  delete(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.zones.delete(user.id, id);
  }
}
