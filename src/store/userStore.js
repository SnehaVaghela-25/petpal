import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    immer((set) => ({
      user: null,
      isUser: false,

      login: (userData) =>
        set((state) => {
          state.user = userData;
          state.isUser = true;
        }),

      logout: () =>
        set((state) => {
          state.user = null;
          state.isUser = false;
        }),
    })),
    {
      name: "user-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
