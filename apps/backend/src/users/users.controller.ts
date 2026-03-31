import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  metaAdAccountId?: string;

  @IsOptional()
  @IsString()
  spotifyArtistId?: string;
}

type SafeUser = { id: string; email: string; name: string | null };

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: SafeUser) {
    return user;
  }

  @Patch('me')
  async update(@CurrentUser() user: SafeUser, @Body() dto: UpdateProfileDto) {
    const updated = await this.users.updateById(user.id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.metaAdAccountId !== undefined && {
        metaAdAccountId: dto.metaAdAccountId,
      }),
      ...(dto.spotifyArtistId !== undefined && {
        spotifyArtistId: dto.spotifyArtistId,
      }),
    });
    const { passwordHash: _pw, ...safe } = updated; // eslint-disable-line @typescript-eslint/no-unused-vars
    return safe;
  }
}
