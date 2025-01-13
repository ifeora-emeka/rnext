'use client'

import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import SchemaFieldCreatorLayout
    from "@/components/SchemaFieldCreator/SchemaFieldCreatorLayout"
import {useKeyGenerator} from '@/hooks/useKeyGenerator'

const formSchema = z.object({
    fieldName: z.string().min(1, 'Field Name is required').max(20, 'Field Name must be 20 characters or less').regex(/^[a-zA-Z\s]+$/, 'Only alphabetic characters and spaces are allowed'),
    isRequired: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function SchemaTypeConfig({type}: { type: rNextDataType }) {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: {errors}
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fieldName: '',
            isRequired: false,
        },
    })

    const fieldName = watch('fieldName')
    const key = useKeyGenerator(fieldName)

    const onSubmit = (data: FormValues) => {
        console.log(data)
    }

    const handleReset = () => {
        reset()
    }

    return (
        <SchemaFieldCreatorLayout
            heading="Select Data Type"
            subHeading="Select the appropriate data type for the field"
            primaryBtn={{
                label: 'Submit',
                onClick: handleSubmit(onSubmit),
            }}
            secondaryBtn={{
                label: 'Reset',
                onClick: handleReset,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="fieldName">Field Name</Label>
                        <Controller
                            name="fieldName"
                            control={control}
                            render={({field}) => (
                                <Input id="fieldName" {...field} />
                            )}
                        />
                        {errors.fieldName && (
                            <p className="text-sm text-red-500">{errors.fieldName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="key">Key (Read-Only)</Label>
                        <Input id="key" value={key} readOnly/>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <Label htmlFor="isRequired">Required</Label>
                        <div className={'py-2'}>
                            <Controller
                                name="isRequired"
                                control={control}
                                render={({field}) => (
                                    <Switch
                                        id="isRequired"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </SchemaFieldCreatorLayout>
    )
}

