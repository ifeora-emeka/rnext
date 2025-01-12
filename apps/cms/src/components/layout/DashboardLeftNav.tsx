
export default function DashboardLeftNav({children}:{children: React.ReactNode}) {
    return <>
        <aside
            className={'border-r border-background bg-card w-[20rem] min-h-screen max-h-screen'}
        >
            <div className={'border-b border-background min-h-header max-h-header'}>
            </div>
            <div className={'flex flex-col overflow-y-auto max-h-[calc(100vh-var(--header-height))]'}>
                {children}
            </div>
        </aside>
    </>
}
