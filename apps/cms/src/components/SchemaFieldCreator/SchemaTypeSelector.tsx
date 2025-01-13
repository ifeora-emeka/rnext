import SchemaFieldCreatorLayout from "@/components/SchemaFieldCreator/SchemaFieldCreatorLayout.tsx";
import {rNextDataType} from "@idegin/rnext/types";
import DataTypeIcon from "@/components/DataTypeIcon.tsx";
import {useState} from "react";
import {cn} from "@/lib/utils.ts";

export default function SchemaTypeSelector({onClose, onTypeSelect}: { onClose: () => void, onTypeSelect: (type: rNextDataType) => void }) {
    const dataTypes: {
        label: string,
        description: string,
        type: rNextDataType
    }[] =
        [
            {
                label: 'Rich text',
                description: 'A field for rich text content with formatting options like bold, italic etc',
                type: rNextDataType.RICH_TEXT
            },
            {
                label: 'Short text',
                description: 'A simple text field for plain text input.',
                type: rNextDataType.SHORT_TEXT
            },
            {
                label: 'Long text',
                description: 'A simple text field for plain text input.',
                type: rNextDataType.LONG_TEXT
            },
            {
                label: 'Number',
                description: 'A field for numeric values, supporting integers and decimals.',
                type: rNextDataType.NUMBER
            },
            {
                label: 'Switch',
                description: 'A field for boolean values, represented as a switch.',
                type: rNextDataType.BOOLEAN
            },
            {
                label: 'Timestamp',
                description: 'A field for date and time values, stored as timestamps.',
                type: rNextDataType.TIMESTAMP
            },
            {
                label: 'Image',
                description: 'A field for uploading and managing image files like jpg, png etc.',
                type: rNextDataType.IMAGE
            },
            {
                label: 'Video',
                description: 'A field for uploading and managing image files like jpg, png etc.',
                type: rNextDataType.VIDEO
            },
        ]

    const [selectedType, setSelectedType] = useState<rNextDataType | null>(null);

    return <>
        <SchemaFieldCreatorLayout
            heading={'Select Data Type'}
            subHeading={'Select the appropriate data type for the field'}
            primaryBtn={{
                label: 'Next',
                disabled: selectedType === null,
                onClick: () => {
                    if(selectedType) {
                        onTypeSelect(selectedType);
                    }
                },
            }}
            secondaryBtn={{
                label: 'Cancel',
                onClick: () => {
                    onClose();
                },
            }}
        >
            <div className={'grid grid-cols-3 gap-default'}>
                {
                    dataTypes.map((dataType, index) => {
                        return <EachDataType
                            key={`data-type-${index}`}
                            field={dataType}
                            isSelected={selectedType === dataType.type}
                            onClick={() => {
                                setSelectedType(dataType.type);
                            }}
                        />
                    })
                }
            </div>
        </SchemaFieldCreatorLayout>
    </>
}

const EachDataType = ({field, onClick, isSelected}: {
    field: {
        label: string,
        description: string,
        type: rNextDataType;
    },
    onClick: () => void;
    isSelected?: boolean;
}) => {

    return <button
        onClick={onClick}
        className={cn('p-default border border-background flex gap-default hover:bg-background hover:shadow-sm', {
            "bg-background border-muted-foreground": isSelected
        })}>
        <div>
            <DataTypeIcon type={field.type} className={'h-8 w-8 text-muted-foreground'}/>
        </div>
        <div className={'text-start'}>
            <h4>{field.label}</h4>
            <p className={'text-muted-foreground'}>
                {field.description}
            </p>
        </div>
    </button>
};

