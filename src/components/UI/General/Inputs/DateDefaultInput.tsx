import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import DatePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

registerLocale("ru", ru);

interface InputDefaultProps {
  label: string;
  onChange: Any;
  selected: string;
}

const DateDefaultInput = ({ label, onChange, selected }: InputDefaultProps) => {
  return (
    <>
      <label className="text-left mb-2 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <DatePicker
        className="w-full rounded border border-stroke bg-gray py-2 px-3 text-black focus:border-primary focus-visible:outline-none"
        onChange={onChange}
        format="dd.MM.yyyy"
        value={selected}
        calendarIcon={null}
      />
    </>
  );
};

export default DateDefaultInput;
