import {LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils.ts";

type Props = {
    label: string;
    Icon: LucideIcon;
    isActive?: boolean;
    onClick: () => void;
}

export default function EachNavLink({isActive, onClick, Icon, label}: Props) {
    return <>
        <button
            className={cn('p-sm rounded-md flex items-center gap-sm', {
                "bg-accent text-accent-foreground": isActive,
                "hover:bg-background": !isActive,
            })}
            onClick={onClick}
        >
            <Icon className={'h-5 w-5'} />
            <span>{label}</span>
        </button>
    </>
}
