import CheckboxDefault from "../CheckboxDefault.tsx";
import CardCheckbox from "../CardCheckbox.tsx";

interface DropdownInputProps {
  values: [];
  onChangeChecked: any;
  name: string;
  isChecked: any
}

const RadioCard = (
    {values, onChangeChecked, name, isChecked}
        : DropdownInputProps) => {

    return (
        <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
            <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                {name}
            </span>
            {values?.map((value) =>
                <div className="group flex w-full items-center py-3">
                    <CheckboxDefault
                        name={value.name}
                        id={value.id}
                        onChange={() => onChangeChecked(value)}
                        value={value.id === isChecked}
                    />
                    <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    {value.name}
                </span>
                </div>
            )}
        </div>
    );
};

export default RadioCard;