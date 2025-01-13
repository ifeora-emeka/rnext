import {ThemeProvider} from "@/components/theme-provider"
import * as React from "react";
import {
    TooltipProvider,
} from "@/components/ui/tooltip"
import {PageContextProvider} from "@/context/page.context.tsx";
import {DashboardContextProvider} from "@/context/dashboard-context.tsx";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function Providers({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                <QueryClientProvider client={queryClient}>
                    <PageContextProvider>
                        <DashboardContextProvider>
                            {children}
                        </DashboardContextProvider>
                    </PageContextProvider>
                </QueryClientProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}

export default Providers
