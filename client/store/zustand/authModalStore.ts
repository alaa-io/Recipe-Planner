import { create } from "zustand";

export type ModalView = "login" | "signup" | "resetPassword";

export interface AuthModalState {
  open: boolean;
  view: ModalView;
}

const defaultModalState: AuthModalState = {
  open: false,
  view: "login",
};

interface AuthModalStore {
  modalState: AuthModalState;
  setModalState: (state: AuthModalState) => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  modalState: defaultModalState,
  setModalState: (state: AuthModalState) => set({ modalState: state }),
}));

export const selectAuthModalState = (state: AuthModalStore) => state.modalState;
