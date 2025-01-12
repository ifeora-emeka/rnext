import { useState, useCallback, createContext, useContext } from "react";
import * as React from "react";

type DashboardContextState = {
    activePage: "content" | "schema" | "media" | "settings";
};

type PartialState = Partial<DashboardContextState>;

const DashboardContext = createContext<{
    state: DashboardContextState;
    updateDashboardContextState: (partialState: PartialState) => void;
} | null>(null);

const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboardContext must be used within a DashboardContextProvider");
    }
    return context;
};

export const DashboardContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<DashboardContextState>({ activePage: "content" });

    const updateDashboardContextState = useCallback((partialState: PartialState) => {
        setState((prevState) => ({ ...prevState, ...partialState }));
    }, []);

    return (
        <DashboardContext.Provider value={{ state, updateDashboardContextState }}>
            {children}
        </DashboardContext.Provider>
    );
};

export { useDashboardContext };
