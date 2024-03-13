import { useState, FormEvent } from "react";

interface FormValues {
  [key: string]: any;
}

type CallbackFunction = () => void;

export const useForm = (
  callback: CallbackFunction,
  initialState: FormValues = {}
): {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent) => void;
  values: FormValues;
} => {
  const [values, setValues] = useState<FormValues>(initialState);

  // update the values in the form
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // submit the form
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    callback();
    // clear the form
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
