import {MenuIcon} from "lucide-react";

export default function DashboardBodyLayout({children, headerComponent}: {
    children: React.ReactNode,
    headerComponent?: React.ReactNode
}) {
    return <>
        <header
            className={'px-default min-h-header max-h-header bg-card flex items-center justify-between'}>
            <div>
                <button className={'text-muted-foreground hover:text-foreground'}>
                    <MenuIcon />
                </button>
            </div>
            {headerComponent}
        </header>
        <main className={'overflow-y-auto xl:px-container px-default py-xl'}>
            {children}
        </main>
    </>
}
