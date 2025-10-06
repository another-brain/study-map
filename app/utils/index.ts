import { defaultWebsiteIconName, imgFileFormats } from '~/consts/routes';

export function requiredRule(value: string | number | undefined) {
    return value ? true : 'This field cannot be empty!';
}

export function isDefaultWebsiteIconName(fileName: string) {
    const parts = fileName.split('.') as [string, string];
    return (
        parts.length === 2 &&
        parts[0] === defaultWebsiteIconName &&
        imgFileFormats.includes(parts[1])
    );
}
