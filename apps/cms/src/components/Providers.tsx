import {ThemeProvider} from "@/components/theme-provider"
import * as React from "react";
import {
    TooltipProvider,
} from "@/components/ui/tooltip"
import {PageContextProvider} from "@/context/page.context.tsx";
import {DashboardContextProvider} from "@/context/dashboard-context.tsx";


function Providers({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                <PageContextProvider>
                    <DashboardContextProvider>
                        {children}
                    </DashboardContextProvider>
                </PageContextProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}

export default Providers
