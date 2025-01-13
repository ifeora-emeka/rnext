import {Button} from "@/components/ui/button.tsx";

type BtnProps = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

type Props = {
    children: React.ReactNode;
    heading: string;
    subHeading: string;
    primaryBtn: BtnProps,
    secondaryBtn: BtnProps
}

export default function SchemaFieldCreatorLayout(
    {
        primaryBtn,
        secondaryBtn,
        subHeading,
        heading,
        children
    }: Props) {
    return <>
        <div
            className={'bg-card border shadow-lg w-full md:w-[900px] xl:w-[1200px] h-[800px] rounded-sm overflow-hidden flex flex-col animate-in fade-in'}>
            <header
                className={'h-header border-b border-background flex items-center justify-between px-default'}>
                <div>
                    <h1>{heading}</h1>
                    <p className={'text-muted-foreground'}>{subHeading}</p>
                </div>
            </header>
            <main className={'flex-1 overflow-y-auto p-default'}>
                {children}
            </main>
            <footer
                className={'flex justify-end items-center gap-default border-t border-background h-header px-default'}>
                <Button {...secondaryBtn} variant={'outline'} >
                    {secondaryBtn.label}
                </Button>
                <Button {...primaryBtn}>
                    {primaryBtn.label}
                </Button>
            </footer>
        </div>
    </>
}