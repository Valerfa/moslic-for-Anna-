import CheckboxDefault from "./CheckboxDefault";
import DateDefaultInput from "./DateDefaultInput";
interface DropdownInputProps {
  onChange: string;
}

const CheckboxData = ({ onChange }: DropdownInputProps) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <>
      <div className="relative flex gap-6" onChange={handleChange}>
        <CheckboxDefault />
        <DateDefaultInput />
        <DateDefaultInput />
      </div>
    </>
  );
};

export default CheckboxData;
