import CardCheckbox from "../CardCheckbox.tsx";
import DateDefaultInput from "../DateDefaultInput.tsx";
import CheckboxDefault from "../CheckboxDefault.tsx";

interface DropdownInputProps {
  isChecked: boolean;
  onChangeChecked: any;
  name: string;
  selectValue: any;
  selectOptions: any;
  selectChange: any;
  inputValueMin: any;
  inputChangeMin: any;
  inputValueMax: any;
  inputChangeMax: any
}

const DateRangeCheckBoxCard = (
    {isChecked, onChangeChecked, name, selectChange, selectValue, selectOptions, inputValueMin, inputChangeMin, inputValueMax, inputChangeMax}
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
                <div className="relative">
                    <div className="relative  flex flex-col gap-2">
                        {selectOptions?.map((selectElem) => (
                            <CheckboxDefault
                                label={selectElem.name}
                                name={""}
                                id={""}
                                value={selectValue.value === selectElem.value}
                                onChange={() => selectChange(selectElem)}
                            ></CheckboxDefault>
                        ))}
                    </div>
                    <div className="mt-2 flex flex-row items-center gap-4">
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
        </div>
    );
};

export default DateRangeCheckBoxCard;