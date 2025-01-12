export const formatDefaultValue = (defaultValue: any, type: string): string => {
    switch (type) {
        case "varchar":
        case "text":
            return `"${defaultValue}"`;
        case "integer":
        case "float":
        case "double":
            return `${defaultValue}`.trim();
        case "boolean":
            return defaultValue ? "true" : "false";
        default:
            return `"${defaultValue}"`;
    }
}

export const mapTypeToTS = (type: string): string => {
    switch (type) {
        case "varchar":
        case "text":
            return "string";
        case "integer":
        case "float":
        case "double":
            return "number";
        case "boolean":
            return "boolean";
        case "datetime":
            return "Date";
        default:
            return "any";
    }
}
