import {useDashboardContext} from "@/context/dashboard-context.tsx";
import ContentLeftNav from "@/pages/dashboard/content/layout/content-left-nav.tsx";
import SettingsLeftNav from "@/pages/dashboard/settings/layout/settings-left-nav.tsx";
import SchemaLeftNav from "@/pages/dashboard/schemas/layout/schema-left-nav.tsx";

export default function DashboardLeftNav() {
    const {state: {activePage}} = useDashboardContext();

    const renderLeftNav = () => {
        switch (activePage) {
            case "content":
                return <ContentLeftNav/>
            case "settings":
                return <SettingsLeftNav/>
            case "schema":
                return <SchemaLeftNav />
            default:
                return null
        }
    }

    return <>
        <aside
            className={'border-r border-background bg-card w-[18rem] min-h-screen max-h-screen select-none z-0'}
        >
            <div className={'border-b border-background min-h-header max-h-header'}>
            </div>
            <div
                className={'flex flex-col overflow-y-auto max-h-[calc(100vh-var(--header-height))] gap-xl'}>
                {renderLeftNav()}
            </div>
        </aside>
    </>
}
