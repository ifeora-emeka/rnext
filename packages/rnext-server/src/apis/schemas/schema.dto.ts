import { z } from 'zod';
import { rNextDataType } from "../../types/schema.types.ts";

export const rNextSchemaValidation = z.object({
    label: z.string(),
    tableName: z.string(),
    fields: z.array(
        z.object({
            def: z.object({
                label: z.string(),
                slug: z.string(),
                type: z.nativeEnum(rNextDataType),
            }),
            column: z.object({
                name: z.string(),
                type: z.string(),
                length: z.number().optional(),
                nullable: z.boolean().optional(),
                unique: z.boolean().optional(),
                primary: z.boolean().optional(),
                default: z.any().optional(),
            }),
        })
    ),
});
