import {useState, useCallback, createContext, useContext} from "react";
import * as React from "react";
import { rNextSchemaDef } from '@idegin/rnext/types';

type SchemaContextState = {
    activeSchema: rNextSchemaDef | null;
};

type PartialState = Partial<SchemaContextState>;

const PageContext = createContext<{
    state: SchemaContextState;
    updatePageContextState: (partialState: PartialState) => void
} | null>(null);

const usePageContext = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error("usePageContext must be used within a PageContextProvider");
    }
    return context;
};

export const PageContextProvider = ({children}: {
    children: React.ReactNode
}) => {
    const [state, setState] = useState<SchemaContextState>({
        activeSchema: null
    });

    const updatePageContextState = useCallback((partialState: PartialState) => {
        setState((prevState) => ({
            ...prevState,
            ...partialState
        }));
    }, []);

    return (
        <PageContext.Provider value={{state, updatePageContextState}}>
            {children}
        </PageContext.Provider>
    );
};

export {usePageContext};