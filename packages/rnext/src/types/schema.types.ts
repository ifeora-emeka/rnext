export type rNextSchemaDef = {
    label: string;
    tableName: string;
    fields: rNextSchemaField[];
}

export enum rNextDataType {
    RICH_TEXT = 'rich-text',
    TEXT = 'text',
    INTEGER = 'integer',
    BOOLEAN = 'boolean',
    DATE = 'date',
    MULTI_SELECT = 'multi-select',
    RELATION = 'relation',
    RICH_MEDIA = 'rich-media',
    COLOR = 'color',
    URL = 'url',
    EMAIL = 'email',
    PASSWORD = 'password',
    JSON = 'json',
    GEO_POINT = 'geo-point',
    MEDIA = 'media',
    NUMBER = 'number',
    PERCENTAGE = 'percentage',
    CURRENCY = 'currency',
    PHONE = 'phone',
    SLUG = 'slug',
    UID = 'uid',
    TIMESTAMP = 'timestamp',
}

export type rNextSchemaField = {
    def: {
        label: string;
        slug: string;
        type: rNextDataType
    },
    column: {
        name: string;
        type: string;
        length?: number;
        nullable?: boolean;
        unique?: boolean;
        primary?: boolean;
        default?: any;
        autoincrement?: boolean;
        onUpdate?: string;
    }
}
