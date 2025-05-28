import { DateRangePickerValue } from "@mantine/dates";
import { IAppInput } from "../input";

export interface IDatePicker extends Omit<IAppInput, "onChange" | "value"> {
  containerSize?: number;
  amountOfMonths?: number;
  value: DateRangePickerValue;
  onChange: (val: DateRangePickerValue) => void;
  inputStyle?: string;
  maxDate?: Date;
}
