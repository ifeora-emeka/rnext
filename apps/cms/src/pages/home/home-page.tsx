import {usePageContext} from "@/context/page.context.tsx";


export default function HomePage() {
    const {updatePageContextState} = usePageContext();

    return <>
        <button
            onClick={() => updatePageContextState({
                activePage: 'dashboard'
            })}
        >
            Go To Dashboard
        </button>
    </>
}