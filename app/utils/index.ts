export function requiredRule(value: string | number | undefined) {
    return value ? true : 'This field cannot be empty!';
}
