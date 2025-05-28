import dayjs from 'dayjs';

export const getHoursTime = (date: Date) => dayjs(date).format('HH:mm');
