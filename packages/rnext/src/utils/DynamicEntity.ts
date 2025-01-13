import { EntitySchema } from "typeorm";

export const createDynamicEntity = (entityName: string, schema: any) => {
    const columns: Record<string, any> = {};
    for (const [key, value] of Object.entries(schema.properties)) {
        columns[key] = {
            //@ts-ignore
            type: value?.type === "integer" ? "int" : value.type,
            nullable: !schema.required?.includes(key),
        };
    }

    return new EntitySchema({
        name: entityName,
        columns,
    });
};
