import { useForm } from "@/hooks/useForm";
import { Typography, Box, TextField, Button } from "@mui/material";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { User, useUserStore } from "../../../store/zustand/userStore";
import { useSnackStore } from "@/store/zustand/snackbarStore";
import { ModalView } from "@/store/zustand/authModalStore";

const LOGIN_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        plannedRecipes {
          date
          recipeId
        }
      }
    }
  }
`;

interface LoginProps {
  toggleView: (view: ModalView) => void;
}
export default function Login({ toggleView }: LoginProps) {
  const { qSnack } = useSnackStore();

  const { setUser, refetchUserPlannedRecipes } = useUserStore();

  const loginUserCallback = async () => {
    loginUser({ variables: values });
  };
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    email: "",
    password: "",
  });
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER, {
    errorPolicy: "none",
    onError: (error) => {
      console.log("error", error);
    },
    onCompleted: (data) => {
      data && data.login.user && setUser(data.login.user);
      if (data && data.login.token && data.login.user) {
        const user: User = {
          id: data.login.user.id,
          name: data.login.user.name,
          email: data.login.user.email,
          token: data.login.token,
        };
        qSnack({ msg: "You're logged in!", severity: "success" });

        setUser(user);
        refetchUserPlannedRecipes();
        localStorage.setItem("token", data.login.token);
      }
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
      {/* {snackbar} */}
      <Typography
        sx={{
          fontSize: "2rem",
        }}
      >
        Login
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
          autoComplete="on"
          fullWidth
          label="Email"
          variant="outlined"
          type="text"
          placeholder="Type your email"
          name="email"
          value={values.email}
          onChange={onChange}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          placeholder="Type your password"
          name="password"
          value={values.password}
          onChange={onChange}
        />

        {error &&
          error.graphQLErrors.map(({ message }, i) => (
            <span key={i}>{message}</span>
          ))}
        {error && (
          //@ts-ignore
          <Typography color="red">
            {error && error?.networkError?.result?.errors[0].message}
          </Typography>
        )}

        <Button fullWidth variant="contained" disabled={loading} type="submit">
          {" "}
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
      <Typography>
        Do not have an account?
        <Button
          onClick={() => toggleView("signup")}
          variant="text"
          type="submit"
        >
          Sign Up
        </Button>
      </Typography>
    </Box>
  );
}
