import CardCheckbox from "../CardCheckbox.tsx";

interface DropdownInputProps {
  values: [];
  onChangeChecked: any;
  name: string;
}

const CheckboxCard = (
    {values, onChangeChecked, name}
        : DropdownInputProps) => {

    return (
        <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
            <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                {name}
            </span>
            {values?.map((value) =>
                <div className="group flex w-full items-center py-3">
                    <CardCheckbox
                        name={value.name}
                        id={value.id}
                        onChange={() => onChangeChecked(value)}
                        isChecked={value.value}
                    />
                    <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    {value.name}
                </span>
                </div>
            )}
        </div>
    );
};

export default CheckboxCard;