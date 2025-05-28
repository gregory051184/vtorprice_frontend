export * from './createLoaderStore';
export * from './calcNds';
export * from './getHoursTime';

export function truncateString(inputString: string, maxLength: number) {
    if (inputString.length > maxLength) {
      return inputString.slice(0, maxLength) + '...';
    }
    return inputString;
}