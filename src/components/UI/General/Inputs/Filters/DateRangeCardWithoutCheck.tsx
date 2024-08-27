import CardCheckbox from "../CardCheckbox.tsx";
import DateDefaultInput from "../DateDefaultInput.tsx";

interface DropdownInputProps {
  name: string;
  inputValueMin: any;
  inputChangeMin: any;
  inputValueMax: any;
  inputChangeMax: any
}

const DateRangeCard = (
    {name, inputValueMin, inputChangeMin, inputValueMax, inputChangeMax}
        : DropdownInputProps) => {

    return (
        <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
            <div className="group flex w-full items-center py-3">
                <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    {name}
                </span>
            </div>
            <div className="text-sm/5 text-black/50">
                <div className="relative flex items-center gap-2">
                    <DateDefaultInput
                        label={'c'}
                        onChange={inputChangeMin}
                        selected={inputValueMin}
                    />
                    <DateDefaultInput
                        label={'по'}
                        onChange={inputChangeMax}
                        selected={inputValueMax}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateRangeCard;