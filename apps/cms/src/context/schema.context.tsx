import { useState, useCallback, createContext, useContext } from "react";
import * as React from "react";
import { rNextSchemaDef } from '@idegin/rnext/types';

type SchemaContextState = {
    activeSchema: rNextSchemaDef | null;
    isLoading: boolean;
};

type PartialState = Partial<SchemaContextState>;

const SchemaContext = createContext<{
    state: SchemaContextState;
    updateSchemaContextState: (partialState: PartialState) => void;
} | null>(null);

const useSchemaContext = () => {
    const context = useContext(SchemaContext);
    if (!context) {
        throw new Error("useSchemaContext must be used within a SchemaContextProvider");
    }
    return context;
};

export const SchemaContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<SchemaContextState>({
        activeSchema: null,
        isLoading: false,
    });

    const updateSchemaContextState = useCallback((partialState: PartialState) => {
        setState((prevState) => ({
            ...prevState,
            ...partialState
        }));
    }, []);

    return (
        <SchemaContext.Provider value={{ state, updateSchemaContextState }}>
            {children}
        </SchemaContext.Provider>
    );
};

export { useSchemaContext };