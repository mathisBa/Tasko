import React, { createContext, Dispatch, SetStateAction } from "react";

interface StateContextType {
  userId: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  userDocId: string | null;
  setUserDocId: Dispatch<SetStateAction<string | null>>;
}

export const StateContext = createContext<StateContextType>({
  userId: null,
  setUserId: () => {},
  userDocId: null,
  setUserDocId: () => {},
});

export default StateContext;
