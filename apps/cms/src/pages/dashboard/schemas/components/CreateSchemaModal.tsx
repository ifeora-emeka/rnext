"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast, Toaster } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { useMutation } from "@tanstack/react-query"
import { APICall } from "@/lib/api"
import {useDashboardContext} from "@/context/dashboard-context.tsx";

type FormData = {
    name: string
}

export default function CreateCollectionModal({children}:{
    children: React.ReactNode,
}) {
    const [open, setOpen] = useState(false);
    const {refetch} = useDashboardContext();

    const form = useForm<FormData>({
        defaultValues: {
            name: "",
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: { label: string, tableName: string, fields: unknown[] }) =>
            APICall('/schemas', {
                method: 'POST',
                data
            }),
        onSuccess: (data) => {
            refetch()
            console.log('DONE::', data)
            toast.success("Collection created successfully!")
            setOpen(false)
            form.reset()
        },
        onError: (error) => {
            console.log('ERROR::', error)
            toast.error("Failed to create collection")
        }
    })

    const onSubmit = async (data: FormData) => {
        const tableName = data.name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '_')
        mutate({
            label: data.name,
            tableName: tableName,
            fields: []
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Collection</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{
                                    required: "Name is required",
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "Only letters and spaces are allowed",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter collection name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Collection"
                                )}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Toaster />
        </>
    )
}

