import CardCheckbox from "../CardCheckbox.tsx";
import DateDefaultInput from "../DateDefaultInput.tsx";

interface DropdownInputProps {
  isChecked: boolean;
  onChangeChecked: any;
  name: string;
  inputValue: any;
  inputChange: React.MouseEventHandler<HTMLButtonElement>;
}

const DateCard = (
    {isChecked, onChangeChecked, name, inputValue, inputChange}
        : DropdownInputProps) => {

    return (
        <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
            <div className="group flex w-full items-center py-3">
                <CardCheckbox
                    name={''}
                    id={''}
                    onChange={onChangeChecked}
                    isChecked={isChecked}
                />
                <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    {name}
                </span>
            </div>
            <div className="text-sm/5 text-black/50">
                <div className="relative flex items-center gap-2">
                    <DateDefaultInput
                        onChange={inputChange}
                        selected={inputValue}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateCard;