import {
    Table,
    TableBody, TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Check,
    X, PencilIcon, MousePointerClick, SaveIcon, PlusIcon
} from 'lucide-react'
import DashboardBodyLayout from "@/components/layout/DashboardBodyLayout.tsx";
import {useSchemaContext} from "@/context/schema.context.tsx";
import {Button} from "@/components/ui/button.tsx";
import DataTypeIcon from "@/components/DataTypeIcon.tsx";
import SchemaFieldCreator from "@/components/SchemaFieldCreator/SchemaFieldCreator.tsx";
import {useState} from "react";

export default function SchemaPage() {
    const {state: {activeSchema}} = useSchemaContext();
    const [addNew, setAddNew] = useState(false);

    if(!activeSchema) {
        return <div className={'min-h-screen flex items-center justify-center'}>
            <div className={'flex flex-col gap-sm text-center items-center text-muted-foreground'}>
                <MousePointerClick className={'h-16 w-16'} />
                <p>
                    No schema selected
                </p>
            </div>
        </div>
    }

    return (
        <>
            <SchemaFieldCreator
                show={addNew}
                onClose={() => setAddNew(false)}
            />
            <DashboardBodyLayout>
                <div className="container mx-auto px-4 py-8 select-none">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{activeSchema.label}</h1>
                            <p className="text-muted-foreground mt-2">
                                {activeSchema?.description || 'No description'}
                            </p>
                        </div>
                        <div className={'flex items-center gap-sm'}>
                            <Button size={'sm'} variant={'outline'}><PencilIcon /> Edit</Button>
                            <Button size={'sm'}><SaveIcon /> Save</Button>
                        </div>
                    </div>

                    <div className="rounded-md border bg-card overflow-x-auto">
                        <Table>
                            <TableCaption>
                                <div className={'flex flex-col justify-center items-center text-center h-[60vh] gap-default'}>
                                    <p className={'text-center'}>No fields added to this collection. <br/>Click the button below to add a new field</p>
                                    <Button size={'sm'} onClick={() => setAddNew(true)}><PlusIcon /> Add Field</Button>
                                </div>
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px] sm:w-[300px]">Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Required</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeSchema.fields.map((field, index) => (
                                    <TableRow key={`schema-field-${index}`} className={'group'}>
                                        <TableCell className="font-medium">{field.def.label}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <DataTypeIcon type={field.def.type} className="mr-2 h-4 w-4 text-muted-foreground"/>
                                                <span className="hidden sm:inline">{field.def.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'text-left'}>
                                            <div>
                                                {!field.column.nullable ? (
                                                    <Check className="h-4 w-4 text-green-500"/>
                                                ) : (
                                                    <X className="h-4 w-4 text-red-500"/>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <button className={'opacity-0 group-hover:opacity-100 hover:text-foreground text-muted-foreground'}>
                                                <PencilIcon className={'h-4 w-4'} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DashboardBodyLayout>
        </>
    )
}

