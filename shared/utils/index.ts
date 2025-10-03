export function mergeObj(obj1: object, obj2: object) {
    return { ...obj1, ...obj2 };
}

export function extractObj<T>(obj: Record<string, T>, keys: string[]) {
    const entries = new Array<[string, T]>();
    for (const key of keys) {
        if (Object.hasOwn(obj, key)) {
            entries.push([key, obj[key]!]);
        }
    }
    return Object.fromEntries(entries);
}
