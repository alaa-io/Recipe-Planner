import React, { useEffect } from "react";
import AuthInputs from "./Inputs";
import ModalWrapper from "../ModalWrapper";
import { useUserStore } from "@/store/zustand/userStore";
import { useAuthModalStore } from "@/store/zustand/authModalStore";

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const { modalState, setModalState } = useAuthModalStore();

  const handleClose = () =>
    setModalState({
      open: false,
      view: "login",
    });
  const { user } = useUserStore();

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  const toggleView = (view: string) => {
    setModalState({
      ...modalState,
      view: view as typeof modalState.view,
    });
  };

  return (
    <ModalWrapper isOpen={modalState.open} onClose={handleClose}>
      <AuthInputs toggleView={toggleView} />
    </ModalWrapper>
  );
};
export default AuthModal;
