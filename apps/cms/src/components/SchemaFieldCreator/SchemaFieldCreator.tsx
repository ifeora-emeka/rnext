import SchemaTypeSelector from "@/components/SchemaFieldCreator/SchemaTypeSelector.tsx";
import {rNextDataType} from "@idegin/rnext/types";
import {useState} from "react";
import SchemaTypeConfig from "@/components/SchemaFieldCreator/SchemaTypeConfig.tsx";

export default function SchemaFieldCreator({show, onClose}: {
    show: boolean,
    onClose: () => void
}) {
    const [selectedType, setSelectedType] = useState<rNextDataType | null>(null);

    if (!show) return null;

    return <>
        <div
            className={'bg-background/70 fixed top-0 bottom-0 left-0 right-0 z-[1000] flex items-center justify-center p-sm select-none animate-in fade-in'}>
            {
                !selectedType &&
                <SchemaTypeSelector
                    onClose={onClose}
                    onTypeSelect={(type) => {
                        setSelectedType(type);
                    }}
                />
            }
            {
                selectedType && <div className={'animate-in fade-in-70'}>
                    <SchemaTypeConfig
                        type={selectedType}
                    />
                </div>
            }
        </div>
    </>
}