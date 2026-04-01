import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  followers: { total: number };
  genres: string[];
  images: { url: string; width: number; height: number }[];
  popularity: number;
  external_urls: { spotify: string };
}

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  album: {
    name: string;
    images: { url: string }[];
    release_date: string;
  };
  external_urls: { spotify: string };
}

interface SpotifySearchResponse {
  artists: { items: SpotifyArtist[] };
}

interface SpotifyTopTracksResponse {
  tracks: SpotifyTrack[];
}

interface SpotifyAlbumsResponse {
  items: {
    id: string;
    name: string;
    release_date: string;
    total_tracks: number;
    images: { url: string }[];
    album_type: string;
    external_urls: { spotify: string };
  }[];
}

@Injectable()
export class SpotifyService {
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor(private readonly config: ConfigService) {}

  private async getAccessToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException(
        'Spotify credentials not configured',
      );
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const { data } = await axios.post<SpotifyTokenResponse>(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return data.access_token;
  }

  async searchArtists(query: string) {
    const token = await this.getAccessToken();

    const { data } = await axios.get<SpotifySearchResponse>(
      'https://api.spotify.com/v1/search',
      {
        params: { q: query, type: 'artist', limit: 8 },
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return data.artists.items.map((a) => ({
      id: a.id,
      name: a.name,
      followers: a.followers.total,
      genres: a.genres.slice(0, 3),
      image: a.images[0]?.url ?? null,
      popularity: a.popularity,
      spotifyUrl: a.external_urls.spotify,
    }));
  }

  async getArtist(artistId: string) {
    const token = await this.getAccessToken();

    const { data } = await axios.get<SpotifyArtist>(
      `https://api.spotify.com/v1/artists/${artistId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      id: data.id,
      name: data.name,
      followers: data.followers.total,
      genres: data.genres,
      image: data.images[0]?.url ?? null,
      popularity: data.popularity,
      spotifyUrl: data.external_urls.spotify,
    };
  }

  async getTopTracks(artistId: string, market = 'US') {
    const token = await this.getAccessToken();

    const { data } = await axios.get<SpotifyTopTracksResponse>(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        params: { market },
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return data.tracks.map((t) => ({
      id: t.id,
      name: t.name,
      durationMs: t.duration_ms,
      durationFormatted: `${Math.floor(t.duration_ms / 60000)}:${String(
        Math.floor((t.duration_ms % 60000) / 1000),
      ).padStart(2, '0')}`,
      popularity: t.popularity,
      previewUrl: t.preview_url,
      albumName: t.album.name,
      albumImage: t.album.images[0]?.url ?? null,
      releaseDate: t.album.release_date,
      spotifyUrl: t.external_urls.spotify,
    }));
  }

  async getAlbums(artistId: string) {
    const token = await this.getAccessToken();

    const { data } = await axios.get<SpotifyAlbumsResponse>(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        params: { include_groups: 'album,single', limit: 10, market: 'US' },
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return data.items.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.album_type,
      totalTracks: a.total_tracks,
      releaseDate: a.release_date,
      image: a.images[0]?.url ?? null,
      spotifyUrl: a.external_urls.spotify,
    }));
  }

  async getRelatedArtists(artistId: string) {
    const token = await this.getAccessToken();

    const { data } = await axios.get<{ artists: SpotifyArtist[] }>(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return data.artists.slice(0, 6).map((a) => ({
      id: a.id,
      name: a.name,
      followers: a.followers.total,
      genres: a.genres.slice(0, 2),
      image: a.images[0]?.url ?? null,
      popularity: a.popularity,
    }));
  }
}
