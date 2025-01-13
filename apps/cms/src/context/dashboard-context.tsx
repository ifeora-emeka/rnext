import {useState, useCallback, createContext, useContext, useEffect} from "react";
import * as React from "react";
import {useQuery} from "@tanstack/react-query";
import {APICall} from "@/lib/api.ts";
import {cacheTTL} from "@/config/api.config.ts";
import { rNextSchemaDef } from '@idegin/rnext/types';

type DashboardContextState = {
    activePage: "content" | "schema" | "media" | "settings";
    isLoading?: boolean;
    schemas: rNextSchemaDef[];
};

type PartialState = Partial<DashboardContextState>;

const DashboardContext = createContext<{
    state: DashboardContextState;
    updateDashboardContextState: (partialState: PartialState) => void;
    refetch: () => void;
} | null>(null);

const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboardContext must be used within a DashboardContextProvider");
    }
    return context;
};

export const DashboardContextProvider = ({children}: { children: React.ReactNode }) => {
    const [state, setState] = useState<DashboardContextState>({
        activePage: "content",
        isLoading: true,
        schemas: []
    });

    const {isFetching, data, refetch} = useQuery({
        queryKey: ['dashboard'],
        staleTime: cacheTTL.long,
        queryFn: () => APICall(''),
    });

    const updateDashboardContextState = useCallback((partialState: PartialState) => {
        setState((prevState) => ({...prevState, ...partialState}));
    }, []);

    useEffect(() => {
        if (data) {
            updateDashboardContextState({
                schemas: data.data.schemas
            });
        }
        updateDashboardContextState({isLoading: isFetching});
    }, [data, isFetching])

    return (
        <DashboardContext.Provider value={{state, updateDashboardContextState, refetch}}>
            {children}
        </DashboardContext.Provider>
    );
};

export {useDashboardContext};
