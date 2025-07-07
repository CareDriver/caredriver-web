"use client";

import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type ContextType = {
  loading: boolean;
  isValid: boolean;
  setLoading: (b: boolean) => void;
  setValid: (b: boolean) => void;
  setLoadingAll: (
    d: boolean,
    formSetter: Dispatch<SetStateAction<FormState>>,
  ) => void;
  setValidAll: (
    d: boolean,
    formSetter: Dispatch<SetStateAction<FormState>>,
  ) => void;
};

const DEFAULT_CONTEXT: ContextType = {
  ...DEFAULT_FORM_STATE,
  setLoading: (e) => {},
  setValid: (e) => {},
  setLoadingAll: (d, formSetter) => {},
  setValidAll: (d, formSetter) => {},
};

export const PageStateContext = createContext<ContextType>(DEFAULT_CONTEXT);

const PageStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  const setLoading = (d: boolean) => {
    setFormState((prev) => ({
      ...prev,
      loading: d,
    }));
  };

  const setLoadingAll = (
    d: boolean,
    formSetter: Dispatch<SetStateAction<FormState>>,
  ) => {
    setFormState((prev) => ({
      ...prev,
      loading: d,
    }));
    formSetter((prev) => ({
      ...prev,
      loading: d,
    }));
  };

  const setValid = (d: boolean) => {
    setFormState((prev) => ({
      ...prev,
      isValid: d,
    }));
  };

  const setValidAll = (
    d: boolean,
    formSetter: Dispatch<SetStateAction<FormState>>,
  ) => {
    setFormState((prev) => ({
      ...prev,
      isValid: d,
    }));
    formSetter((prev) => ({
      ...prev,
      isValid: d,
    }));
  };

  return (
    <PageStateContext.Provider
      value={{
        loading: formState.loading,
        isValid: formState.isValid,
        setLoading,
        setValid,
        setLoadingAll,
        setValidAll,
      }}
    >
      {children}
    </PageStateContext.Provider>
  );
};

export const PageStateProviderContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <PageStateProvider>{children}</PageStateProvider>;
};

export default PageStateProvider;
