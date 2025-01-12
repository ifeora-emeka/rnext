import {useState, useCallback, createContext, useContext} from "react";
import * as React from "react";

type PageContextState = {
    activePage: "home" | "dashboard";
};

type PartialState = Partial<PageContextState>;

const PageContext = createContext<{
    state: PageContextState;
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
    const [state, setState] = useState<PageContextState>({activePage: "home"});

    const updatePageContextState = useCallback((partialState: PartialState) => {
        setState((prevState) => ({...prevState, ...partialState}));
    }, []);

    return (
        <PageContext.Provider value={{state, updatePageContextState}}>
            {children}
        </PageContext.Provider>
    );
};

export {usePageContext};