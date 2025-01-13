import {ChevronRight, PlusIcon} from "lucide-react";
import EachNavLinkLg from "@/components/EachNavLinkLg.tsx";
import CreateCollectionModal
    from "@/pages/dashboard/schemas/components/CreateSchemaModal.tsx";
import {useDashboardContext} from "@/context/dashboard-context.tsx";

export default function SchemaLeftNav() {
    const {state: {schemas}} = useDashboardContext();
    return <>
        <div>
            {
                schemas.map((schema, index) => {
                    return <EachNavLinkLg
                        key={`schema-${index}`}
                        label={schema?.label}
                        Icon={ChevronRight}
                        onClick={() => {
                        }}
                    />
                })
            }

            <CreateCollectionModal>
                <EachNavLinkLg
                    label={"Add new"}
                    Icon={PlusIcon}
                    onClick={() => {
                    }}
                />
            </CreateCollectionModal>
        </div>
    </>
}

