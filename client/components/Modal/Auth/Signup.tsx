import { useForm } from "@/hooks/useForm";
import { ModalView, useAuthModalStore } from "@/store/zustand/authModalStore";
import { useSnackStore } from "@/store/zustand/snackbarStore";
import { gql, useMutation } from "@apollo/client";
import { Typography, Box, TextField, Button } from "@mui/material";

const SIGNUP_USER = gql`
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      token
      user {
        name
        email
      }
    }
  }
`;

interface SignUpProps {
  toggleView: (view: ModalView) => void;
}
export default function SignUp({ toggleView }: SignUpProps) {
  const { qSnack } = useSnackStore();
  const { modalState, setModalState } = useAuthModalStore();
  const signUpUserCallback = () => {
    signupUser({ variables: values });
  };

  const { onChange, onSubmit, values } = useForm(signUpUserCallback, {
    name: "",
    email: "",
    password: "",
  });
  const [signupUser, { loading, data, error }] = useMutation(SIGNUP_USER, {
    errorPolicy: "none",
    onError: (error) => {},
    onCompleted: (data) => {
      qSnack({ msg: "You have successfully registered!", severity: "success" });
      setModalState({
        ...modalState,
        open: true,
        view: "login",
      });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: "1rem",
      }}
    >
      <Typography
        sx={{
          fontSize: "2rem",
        }}
      >
        Sign Up
      </Typography>

      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "1rem",
        }}
      >
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          type="text"
          name="name"
          value={values.name}
          onChange={onChange}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="text"
          name="email"
          value={values.email}
          onChange={onChange}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
        />
        <Button fullWidth variant="contained" type="submit">
          Sign Up
        </Button>
      </form>
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <span key={i}>{message}</span>
        ))}
      {error && (
        //@ts-ignore
        <Typography color="red">
          {error &&
            error?.networkError &&
            error?.networkError?.result?.errors[0].message}
        </Typography>
      )}
      <Typography>
        Already have an account?
        <Button
          variant="text"
          color="primary"
          disabled={loading}
          onClick={() => toggleView("login")}
        >
          Login
        </Button>
      </Typography>
    </Box>
  );
}
