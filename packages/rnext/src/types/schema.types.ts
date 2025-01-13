export type rNextSchemaDef = {
    label: string;
    tableName: string;
    description: string | null;
    fields: rNextSchemaField[];
}

export enum rNextDataType {
    RICH_TEXT = 'rich-text',
    SHORT_TEXT = 'short-text',
    LONG_TEXT = 'long-text',

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

    DOCUMENT = 'document',
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    FILE = 'file',

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
        key: string;
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
