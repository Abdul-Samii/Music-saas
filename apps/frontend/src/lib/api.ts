import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.escalium.io/api",
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if ((session as any)?.accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }
  return config;
});

export default api;

export const campaignsApi = {
  list: () => api.get("/campaigns").then((r) => r.data),
  create: (data: Record<string, unknown>) =>
    api.post("/campaigns", data).then((r) => r.data),
  get: (id: string) => api.get(`/campaigns/${id}`).then((r) => r.data),
  launch: (id: string) =>
    api.post(`/campaigns/${id}/launch`).then((r) => r.data),
  pause: (id: string) =>
    api.post(`/campaigns/${id}/pause`).then((r) => r.data),
  resume: (id: string) =>
    api.post(`/campaigns/${id}/resume`).then((r) => r.data),
  launchOnMeta: (data: Record<string, unknown>) =>
    api.post("/meta-ads/launch-campaign", data).then((r) => r.data),
  syncInsights: (campaignId: string) =>
    api.post("/meta-ads/sync-insights", { campaignId }).then((r) => r.data),
  syncStatuses: () =>
    api.post("/meta-ads/sync-statuses").then((r) => r.data),
  liveCampaigns: () =>
    api.get("/meta-ads/live-campaigns").then((r) => r.data),
  deleteCampaign: (campaignId: string) =>
    api.delete("/meta-ads/campaign", { params: { campaignId } }).then((r) => r.data),
};

export const analyticsApi = {
  overview: () => api.get("/analytics/overview").then((r) => r.data),
  costPerStream: (campaignId: string) =>
    api.get(`/analytics/cost-per-stream/${campaignId}`).then((r) => r.data),
};

export const spotifyApi = {
  artist: (id: string) => api.get(`/spotify/artist/${id}`).then((r) => r.data),
  tracks: (id: string) =>
    api.get(`/spotify/artist/${id}/tracks`).then((r) => r.data),
  search: (q: string) =>
    api.get(`/spotify/search?q=${encodeURIComponent(q)}`).then((r) => r.data),
};

export const creativeApi = {
  uploadAudio: (file: File, onProgress?: (p: number) => void) => {
    const fd = new FormData();
    fd.append("audio", file);
    return api
      .post("/media/upload-audio", fd, {
        onUploadProgress: (e) =>
          onProgress?.(Math.round(((e.loaded ?? 0) * 100) / (e.total ?? 1))),
      })
      .then((r) => r.data);
  },
  videoLibrary: () => api.get("/media/video-library").then((r) => r.data),
  render: (data: Record<string, unknown>) =>
    api.post("/media/render", data).then((r) => r.data),
  jobStatus: (jobId: string) =>
    api.get(`/media/job/${jobId}`).then((r) => r.data),
  myCreatives: () => api.get("/media/my-creatives").then((r) => r.data),
};

export const usersApi = {
  me: () => api.get("/users/me").then((r) => r.data),
  update: (data: Record<string, unknown>) =>
    api.patch("/users/me", data).then((r) => r.data),
  connectMeta: (data: Record<string, unknown>) =>
    api.patch("/users/me/meta", data).then((r) => r.data),
  connectSpotify: (data: Record<string, unknown>) =>
    api.patch("/users/me/spotify", data).then((r) => r.data),
};
