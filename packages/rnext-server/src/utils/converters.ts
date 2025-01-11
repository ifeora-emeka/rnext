
import type {rNextSchemaDef, rNextSchemaField} from "../types/schema.types.ts";

const convertFieldToColumn = (field: rNextSchemaField) => {
    const { name, type, length, nullable, unique, primary, default: defaultValue } = field.column;

    const columnDefinition: any = {
        name,
        type,
        nullable: nullable || false,
        unique: unique || false,
        primary: primary || false,
        default: defaultValue || undefined,
    };

    if (length && type === "varchar") {
        columnDefinition.length = length;
    }

    return columnDefinition;
};

export const convertSchemaToTypeORM = (schemaDef: rNextSchemaDef) => {
    const { tableName, fields } = schemaDef;

    const columns = fields.map((field: rNextSchemaField) => {
        return convertFieldToColumn(field);
    });

    return {
        tableName,
        columns,
    };
};
