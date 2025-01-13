import { useState, useEffect } from 'react';

export function useKeyGenerator(fieldName: string) {
    const [key, setKey] = useState('');

    useEffect(() => {
        const generatedKey = fieldName
            .toLowerCase()
            .trim()
            .replace(/[^a-z\s]/g, '')
            .replace(/\s+/g, '_');
        setKey(generatedKey);
    }, [fieldName]);

    return key;
}

