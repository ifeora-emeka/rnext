import {useDashboardContext} from "@/context/dashboard-context.tsx";
import ContentPage from "@/pages/dashboard/content/content-page.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";
import SchemaPage from "@/pages/dashboard/schemas/schema-page.tsx";

export default function DashboardPage() {
    const {state: {activePage}} = useDashboardContext();

    const renderPage = () => {
        switch (activePage) {
            case "content":
                return <ContentPage/>
            case 'schema':
                return <SchemaPage/>
            default:
                return null
        }
    }

    return <>
        <DashboardLayout>
            <>
                {renderPage()}
            </>
        </DashboardLayout>
    </>
}