interface InputDefaultProps {
  label: string;
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: React.MouseEventHandler<HTMLButtonElement>;
}

const NumberInput = ({
  label,
  name,
  id,
  placeholder,
  value,
  onChange,
}: InputDefaultProps) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <>
      <label className="text-left mb-2 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full rounded border border-stroke bg-gray py-2 px-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          type="number"
          step="1"
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default NumberInput;
