import {ChevronRight} from "lucide-react";
import EachNavLinkLg from "@/components/EachNavLinkLg.tsx";

export default function ContentLeftNav(){
    return <>
        <div>
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {}} />
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {}} />
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {}} />
            <EachNavLinkLg label={"Collection name"} Icon={ChevronRight} onClick={() => {}} />
        </div>
    </>
}

