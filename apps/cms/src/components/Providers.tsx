import {ThemeProvider} from "@/components/theme-provider"
import * as React from "react";
import {
    TooltipProvider,
} from "@/components/ui/tooltip"


function Providers({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                {children}
            </TooltipProvider>
        </ThemeProvider>
    )
}

export default Providers
