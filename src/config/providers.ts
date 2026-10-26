// src/config/providers.ts

export interface Provider {
  id: string;
  name: string;
  baseUrl?: string;
  enabled: boolean;
  getMovieUrl?: (tmdbId: string | number) => string;
  getTvUrl?: (
    tmdbId: string | number,
    season: number,
    episode: number,
  ) => string;
}

export const providers: Provider[] = [
  {
    id: "vidlink",
    name: "Server 1 (VidLink Pro)",
    baseUrl: "https://vidlink.pro",
    enabled: true,
    getMovieUrl: (id) => `https://vidlink.pro/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "helium",
    name: "Server 2 (Helium Multi-Lang)",
    enabled: true,
    getMovieUrl: (id) =>
      `https://nxsha.space/embed/movie/${id}?lang=hi&sub=en&disable_app_ad=true&server=MhPly-[Multi-Lang]`,
    getTvUrl: (id, s, e) =>
      `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=hi&sub=en&disable_app_ad=true&server=MhPly-[Multi-Lang]`,
  },
  {
    id: "cinezo",
    name: "Server 3 (Cinezo Live)",
    baseUrl: "https://player.cinezo.live/embed",
    enabled: true,
    getMovieUrl: (id) => `https://player.cinezo.live/embed/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://player.cinezo.live/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc_to",
    name: "Server 4 (VidSrc TO VIP)",
    baseUrl: "https://vidsrc.to/embed",
    enabled: true,
    getMovieUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidfast",
    name: "Server 5 (VidFast)",
    baseUrl: "https://vidfast.vc",
    enabled: true,
    getMovieUrl: (id) => `https://vidfast.vc/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidfast.vc/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidbolt",
    name: "Server 6 (VidBolt)",
    baseUrl: "https://vidbolt.pro",
    enabled: true,
    getMovieUrl: (id) => `https://vidbolt.pro/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidbolt.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc_me",
    name: "Server 7 (VidSrc)",
    baseUrl: "https://vsembed.ru/embed",
    enabled: true,
    getMovieUrl: (id) => `https://vsembed.ru/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vsembed.ru/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "multiembed",
    name: "Server 8 (MultiEmbed)",
    enabled: true,
    getMovieUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    getTvUrl: (id, s, e) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    id: "two_embed",
    name: "Server 9 (2Embed)",
    baseUrl: "https://www.2embed.cc",
    enabled: true,
    getMovieUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    getTvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: "vidcore",
    name: "Server 10 (VidCore)",
    baseUrl: "https://vidcore.org/embed",
    enabled: true,
    getMovieUrl: (id) => `https://vidcore.org/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidcore.org/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidbinge",
    name: "Server 11 (VidBinge)",
    baseUrl: "https://vidbinge.dev/embed",
    enabled: true,
    getMovieUrl: (id) => `https://vidbinge.dev/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidbinge.dev/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidnest",
    name: "Server 12 (VidNest)",
    baseUrl: "https://vidnest.fun",
    enabled: true,
    getMovieUrl: (id) => `https://vidnest.fun/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidnest.fun/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidup",
    name: "Server 13 (Vidup)",
    baseUrl: "https://vidup.to",
    enabled: true,
    getMovieUrl: (id) => `https://vidup.to/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidup.to/tv/${id}/${s}/${e}`,
  },
];

export const DEFAULT_PROVIDER_ID = "vidlink";

/**
 * Helper to build the URL based on media type
 * Supports both Movies and TV Shows
 */
export const getEmbedUrl = (
  providerId: string,
  type: "movie" | "tv",
  tmdbId: string | number,
  season: number = 1,
  episode: number = 1,
): string => {
  const selected =
    providers.find((p) => p.id === providerId) ||
    providers.find((p) => p.enabled) ||
    providers[0];
  if (!selected) return "";

  if (type === "movie") {
    if (selected.getMovieUrl) {
      return selected.getMovieUrl(tmdbId);
    }
    return `${selected.baseUrl}/movie/${tmdbId}`;
  }

  // For TV shows, we append season and episode
  if (selected.getTvUrl) {
    return selected.getTvUrl(tmdbId, season, episode);
  }
  return `${selected.baseUrl}/tv/${tmdbId}/${season}/${episode}`;
};
