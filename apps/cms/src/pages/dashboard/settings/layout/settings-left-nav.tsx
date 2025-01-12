import EachNavLink from "@/components/EachNavLink.tsx";
import {HomeIcon} from "lucide-react";

export default function SettingsLeftNav(){
    return <>
        <div className={'flex flex-col gap-sm p-default'}>
            <EachNavLink label={"Home"} Icon={HomeIcon} onClick={() => {}} />
            <EachNavLink label={"Home"} Icon={HomeIcon} onClick={() => {}} isActive />
            <EachNavLink label={"Home"} Icon={HomeIcon} onClick={() => {}} />
            <EachNavLink label={"Home"} Icon={HomeIcon} onClick={() => {}} />
        </div>
    </>
}

