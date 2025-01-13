import {ChevronRight, PlusIcon} from "lucide-react";
import EachNavLinkLg from "@/components/EachNavLinkLg.tsx";
import CreateCollectionModal
    from "@/pages/dashboard/schemas/components/CreateSchemaModal.tsx";
import {useDashboardContext} from "@/context/dashboard-context.tsx";
import {useSchemaContext} from "@/context/schema.context.tsx";

export default function SchemaLeftNav() {
    const {state: {schemas}} = useDashboardContext();
    const {updateSchemaContextState, state: {activeSchema}} = useSchemaContext()

    return <>
        <div>
            {
                schemas.map((schema, index) => {
                    return <EachNavLinkLg
                        key={`schema-${index}`}
                        isActive={activeSchema?.tableName === schema.tableName}
                        label={schema?.label}
                        Icon={ChevronRight}
                        onClick={() => {
                            updateSchemaContextState({activeSchema: schema})
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

