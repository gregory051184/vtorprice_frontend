import { DateRangePickerValue } from '@mantine/dates';

export function humanizeDates(dates: DateRangePickerValue) {
  let localedString = '';
  if (dates[0]) {
    localedString += new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
    }).format(new Date(dates[0])).toString();
  }
  if (dates[1]) {
    localedString += ` - ${new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
    }).format(new Date(dates[1])).toString()}`;
  }
  return localedString;
}
