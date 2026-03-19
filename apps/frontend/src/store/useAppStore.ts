import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  selectedCampaignId: string | null;
  toggleSidebar: () => void;
  setSelectedCampaign: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  selectedCampaignId: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSelectedCampaign: (id) => set({ selectedCampaignId: id }),
}));
