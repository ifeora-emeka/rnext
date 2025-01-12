import {Outlet} from "react-router";
import {
    CodeIcon,
    DatabaseIcon,
    ImageIcon,
    LucideIcon,
    PencilIcon,
    SettingsIcon, SunIcon
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils.ts";
import DashboardLeftNav from "@/components/layout/DashboardLeftNav.tsx";

export default function DashboardLayout() {

    const navList: {
        label: string;
        Icon: LucideIcon;
        isActive?: boolean;
    }[] = [
        {
            Icon: DatabaseIcon,
            label: 'Content',
            isActive: true
        },
        {
            Icon: PencilIcon,
            label: 'Edit schema'
        },
        {
            Icon: ImageIcon,
            label: 'Browse assets'
        },
        {
            Icon: CodeIcon,
            label: 'API docs'
        },
    ]

    return <>
        <div className={'min-h-screen max-h-screen bg-background flex'}>
            <div
                className={'bg-card min-h-screen max-h-screen border-r border-background w-16 max-w-16 flex flex-col justify-between'}
            >
                <div>
                    <div className={'h-header bg-card p-sm text-muted-foreground'}>
                        <div className={'bg-primary text-primary-foreground flex items-end justify-end h-full w-full rounded-lg px-sm'}>
                            <span className={'font-bold text-4xl'}>r</span>
                        </div>
                    </div>
                    <div className={'flex flex-col w-full'}>
                        {
                            navList.map(({Icon, label, isActive}, index) => {
                                return <EachToggleBtn
                                    key={`toggle-${index}`}
                                    Icon={Icon}
                                    label={label}
                                    isActive={isActive}
                                />
                            })
                        }
                    </div>
                </div>
                <div className={'flex flex-col w-full'}>
                    <EachToggleBtn
                        Icon={SunIcon}
                        label={'Change color mode'}
                    />
                    <EachToggleBtn
                        Icon={SettingsIcon}
                        label={'Settings'}
                    />
                </div>
            </div>
            <DashboardLeftNav>
                {
                    new Array(37).fill(null).map((_, index) => {
                        return <h1 key={index} className={'text-3xl'}>Hello from nav</h1>
                    })
                }
            </DashboardLeftNav>
            <div className={'flex-1 flex flex-col'}>
                <Outlet/>
            </div>
        </div>
    </>
}

const EachToggleBtn = ({Icon, isActive, label}: {
    label: string;
    Icon: LucideIcon;
    isActive?: boolean;
}) => {
    return <Tooltip>
        <TooltipTrigger asChild>
            <button aria-label={label}
                    className={cn('flex items-center justify-center h-16 ', {
                        "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground": isActive,
                        "text-muted-foreground hover:bg-background hover:text-foreground": !isActive,
                    })}>
                <Icon/>
            </button>
        </TooltipTrigger>
        <TooltipContent side={'right'}>
            <p>{label}</p>
        </TooltipContent>
    </Tooltip>
}
