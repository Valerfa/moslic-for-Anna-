interface InputDefaultProps {
  label: string;
  type: string;
  value: string;
  name: string;
  id: string;
  placeholder: string;
  defaultvalue: string;
  onChange: any;
  disable: boolean;
}

const TextInput = ({
  label,
  type,
  value,
  name,
  id,
  placeholder,
  defaultvalue,
  onChange,
  disable = false,
}: InputDefaultProps) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <>
      <label className="mb-2 block text-sm font-medium text-black dark:text-white text-left">
        {label}
      </label>
      <div className="relative w-full">
        <input
          className="w-full rounded border border-stroke bg-gray px-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-danger-50 disabled:text-danger-500 disabled:border-danger-200 disabled:shadow-none"
          type={type}
          value={value}
          name={name}
          id={id}
          placeholder={placeholder}
          defaultValue={defaultvalue}
          onChange={handleChange}
          disabled={disable}
        />
      </div>
    </>
  );
};

export default TextInput;
