import { create, StateCreator } from "zustand";
import { enqueueSnackbar } from "notistack";

export interface SnackItem {
  msg: string;
  severity: "error" | "warning" | "info" | "success";
}

interface SnackState {
  item: SnackItem;
  qSnack: (item: SnackItem) => void;
}

export const useSnackStore = create<SnackState>((set) => ({
  item: { msg: "", severity: "info" },
  qSnack: (item: SnackItem) => {
    set({ item });
    const persist = item.severity === "error" ? true : false;
    enqueueSnackbar(item.msg, {
      variant: item.severity,
      persist: persist,
    });
  },
}));

export const selectSnack = (state: SnackState) => state.item;
