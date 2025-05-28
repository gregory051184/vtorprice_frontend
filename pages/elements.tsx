import React, { useState } from 'react';
import {
  DatePicker
} from '@box/shared/ui';
import { DateRangePickerValue } from '@mantine/dates';

const Elements = () => {
  const [value, setValue] = useState<DateRangePickerValue>([null, null]);
  return (
  
    <div className="ml-[200px] mt-[200px]">

      <DatePicker value={value} onChange={setValue} />  

    </div>

  );
};

export default Elements;
