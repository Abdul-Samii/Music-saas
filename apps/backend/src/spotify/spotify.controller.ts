import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotify: SpotifyService) {}

  // Search artists by name
  @Get('search')
  search(@Query('q') q: string) {
    return this.spotify.searchArtists(q ?? '');
  }

  // Get artist profile
  @Get('artist/:id')
  getArtist(@Param('id') id: string) {
    return this.spotify.getArtist(id);
  }

  // Get artist top tracks — useful for picking which song to promote
  @Get('artist/:id/top-tracks')
  getTopTracks(@Param('id') id: string, @Query('market') market?: string) {
    return this.spotify.getTopTracks(id, market ?? 'US');
  }

  // Get artist albums & singles
  @Get('artist/:id/albums')
  getAlbums(@Param('id') id: string) {
    return this.spotify.getAlbums(id);
  }

  // Get related artists — useful for audience targeting ideas
  @Get('artist/:id/related')
  getRelatedArtists(@Param('id') id: string) {
    return this.spotify.getRelatedArtists(id);
  }
}
