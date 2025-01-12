import './App.css'
import DashboardBodyLayout from "@/components/layout/DashboardBodyLayout.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SaveIcon, UploadIcon} from "lucide-react";

function App() {

    return (
        <>
            <DashboardBodyLayout
                headerComponent={
                <div className={'flex items-center gap-default'}>
                    <Button variant={'outline'}>
                        <SaveIcon />
                        Save
                    </Button>
                    <Button>
                        <UploadIcon />
                        Publish
                    </Button>
                </div>
                }
            >
                {
                    new Array(30).fill(null).map((_, index) => {
                        return <h1 className={'text-5xl'} key={index}>
                            lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Aperiam, aspernatur atque autem beatae commodi
                        </h1>
                    })
                }
            </DashboardBodyLayout>
        </>
    )
}

export default App
