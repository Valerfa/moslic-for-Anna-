import CardCheckbox from "../CardCheckbox.tsx";
import SelectFilter from "../SelectFilter.tsx";
import TextInput from "../TextInput.tsx";
import DropdownInput from "../DropdownInput.tsx";


interface DropdownInputProps {
  isChecked: boolean;
  onChangeChecked: any;
  name: string;
  selectValue: any;
  selectOptions: any;
  selectChange: any;
  inputValue: any;
  inputChange: any;
}

const IntegerCheckboxCard = (
    {isChecked, onChangeChecked, name, selectValue, selectOptions, selectChange, inputValue, inputChange}
        : DropdownInputProps) => {

    const handleChange = (e) => {
        if (e === "") {
          inputChange(null);
          return;
        }
        let num = "";
        for (let c of e) {
            if (c.match(/^\d$/) !== null)
                num += c;
        }
        inputChange(num);
    }

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
                <DropdownInput
                    leftChildren={
                        <SelectFilter
                            value={selectValue}
                            options={selectOptions}
                            onChange={selectChange}
                        />
                    }
                    rightChildren={
                    <TextInput
                        label={""}
                        type={""}
                        value={inputValue}
                        onChange={handleChange}
                        name={""}
                        id={""}
                        placeholder={"Введите число"}
                        defaultvalue={""}
                        disable={false}
                    />
                }
            />
        </div>
    </div>
  );
};

export default IntegerCheckboxCard;