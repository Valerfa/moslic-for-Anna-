interface InputDefaultProps {
  label: string;
  type: string;
  value: string;
  name: string;
  id: string;
  placeholder: string;
  defaultvalue: string;
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
}: InputDefaultProps) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full rounded border border-stroke bg-gray py-2 px-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          type={type}
          value={value}
          name={name}
          id={id}
          placeholder={placeholder}
          defaultValue={defaultvalue}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default TextInput;
