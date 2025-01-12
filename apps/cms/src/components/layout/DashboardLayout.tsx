import {
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
import {useDashboardContext} from "@/context/dashboard-context.tsx";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const {updateDashboardContextState, state:{activePage}} = useDashboardContext();

    const navList: {
        label: string;
        Icon: LucideIcon;
        isActive?: boolean;
        page: unknown;
    }[] = [
        {
            Icon: DatabaseIcon,
            label: 'Content',
            isActive: activePage === 'content',
            page: 'content'
        },
        {
            Icon: PencilIcon,
            label: 'Edit schema',
            page: 'schema',
            isActive: activePage === 'schema'
        },
        {
            Icon: ImageIcon,
            label: 'Browse assets',
            page: 'media',
            isActive: activePage === 'media'
        }
    ]

    return <>
        <div className={'min-h-screen max-h-screen bg-background flex'}>
            <div
                className={'bg-card min-h-screen max-h-screen border-r border-background w-16 max-w-16 flex flex-col justify-between select-none'}
            >
                <div>
                    <div className={'h-header bg-card p-sm text-muted-foreground'}>
                        <div
                            className={'bg-primary text-primary-foreground flex items-end justify-end h-full w-full rounded-lg px-sm'}>
                            <span className={'font-bold text-4xl'}>r</span>
                        </div>
                    </div>
                    <div className={'flex flex-col w-full'}>
                        {
                            navList.map(({Icon, label, isActive, page}, index) => {
                                return <EachToggleBtn
                                    key={`toggle-${index}`}
                                    Icon={Icon}
                                    label={label}
                                    isActive={isActive}
                                    onClick={() => updateDashboardContextState({
                                            activePage: page as undefined
                                        }
                                    )}
                                />
                            })
                        }
                    </div>
                </div>
                <div className={'flex flex-col w-full'}>
                    <EachToggleBtn
                        Icon={SunIcon}
                        label={'Change color mode'}
                        onClick={() => {
                        }}
                    />
                    <EachToggleBtn
                        Icon={SettingsIcon}
                        label={'Settings'}
                        isActive={activePage === 'settings'}
                        onClick={() => updateDashboardContextState({
                                activePage: "settings"
                            }
                        )}
                    />
                </div>
            </div>
            <DashboardLeftNav />
            <div className={'flex-1 flex flex-col'}>
                {children}
            </div>
        </div>
    </>
}

const EachToggleBtn = ({Icon, isActive, label, onClick}: {
    label: string;
    Icon: LucideIcon;
    isActive?: boolean;
    onClick: () => void;
}) => {
    return <Tooltip>
        <TooltipTrigger asChild>
            <button
                aria-label={label}
                onClick={onClick}
                className={cn('flex items-center justify-center h-16 ', {
                    "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground": isActive,
                    "text-muted-foreground hover:bg-background hover:text-foreground": !isActive,
                })}
            >
                <Icon/>
            </button>
        </TooltipTrigger>
        <TooltipContent side={'right'}>
            <p>{label}</p>
        </TooltipContent>
    </Tooltip>
}
