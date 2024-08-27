import SelectCustom from "../Select.tsx";
import MultiSelectCustom from "../MultiSelect.tsx";


interface SelectProps {
    name: string;
    type: string;
    selectValue: any;
    selectOptions: any;
    selectChange: any;
}

const SelectCard = (
    {name, type, selectValue, selectOptions, selectChange}
        : SelectProps) => {

    return (
        <div>
            {name?
            <div className="group flex w-full items-center py-3">
                <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    {name}
                </span>
            </div>
                :null}
            <div className="mt-2 text-sm/5 text-black/50">
                {type === 'single'?
                    <SelectCustom
                        value={selectValue}
                        options={selectOptions}
                        onChange={selectChange}
                    />
                : type === 'multy' ?
                    <MultiSelectCustom
                        value={selectValue}
                        options={selectOptions}
                        onChange={selectChange}
                    />
                :
                    null
                }
            </div>
        </div>
    )
}

export default SelectCard;