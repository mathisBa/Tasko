import React, {createContext, Dispatch, SetStateAction} from 'react';

interface StateContextType {
    userId: string | null;
    setUserId: Dispatch<SetStateAction<string|null>>;
    foyerId: string | null;
    setFoyerId: Dispatch<SetStateAction<string|null>>;
}
export const StateContext = createContext<StateContextType>({
    userId: null,
    setUserId: () => {},
    foyerId: null,
    setFoyerId: () => {},
});

export default StateContext;