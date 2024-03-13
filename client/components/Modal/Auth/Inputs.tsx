import React from "react";
import Login from "./Login";
import SignUp from "./Signup";

import { Stack } from "@mui/material";
import { ModalView, useAuthModalStore } from "@/store/zustand/authModalStore";

type AuthInputsProps = {
  toggleView: (view: ModalView) => void;
};

const AuthInputs: React.FC<AuthInputsProps> = ({ toggleView }) => {
  const { modalState } = useAuthModalStore();

  return (
    <Stack direction="column" alignItems="center" width="100%" mt={4}>
      {modalState.view === "login" ?
        <Login toggleView={toggleView} />
      : <SignUp toggleView={toggleView} />}
    </Stack>
  );
};
export default AuthInputs;
