import {LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils.ts";

type Props = {
    label: string;
    Icon: LucideIcon;
    isActive?: boolean;
    onClick: () => void;
}
export default function EachNavLinkLg({isActive, onClick, Icon, label}:Props){
    return <>
        <button
            aria-label={label}
            onClick={onClick}
            className={cn(`w-full p-default border-b border-background flex items-center truncate gap-sm`, {
                "bg-accent text-accent-foreground": isActive,
                "hover:bg-accent/50": !isActive,
            })}
        >
            <Icon className={'h-4 w-4'}/>
            <span>{label}</span>
        </button>
    </>
}