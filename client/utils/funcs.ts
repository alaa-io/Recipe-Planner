import { useErrorsStore } from "@/store/zustand/ErrorsStore";

export const useErrors = () => {
  const { errors, setErrors, clearErrors } = useErrorsStore();
  return { errors, setErrors, clearErrors };
};
