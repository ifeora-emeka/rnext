import {ChevronRight, PlusIcon} from "lucide-react";
import EachNavLinkLg from "@/components/EachNavLinkLg.tsx";
import CreateCollectionModal
    from "@/pages/dashboard/schemas/components/CreateSchemaModal.tsx";

export default function SchemaLeftNav() {
    return <>
        <div>
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {
            }}/>
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {
            }}/>
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {
            }}/>
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {
            }}/>

            <CreateCollectionModal>
                <EachNavLinkLg label={"Add new"} Icon={PlusIcon} onClick={() => {
                }}/>
            </CreateCollectionModal>
        </div>
    </>
}

