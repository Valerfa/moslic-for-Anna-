interface InputDefaultProps {
  label: string;
  type: string;
  value: string;
  name: string;
  id: string;
  placeholder: string;
  defaultvalue: string;
  disable: boolean;
}

const PhoneInput = ({
  label,
  type,
  value,
  name,
  id,
  placeholder,
  defaultvalue,
  onChange,
  disabled = false,
}: InputDefaultProps) => {
  const handleChange = (event) => {
    let old_e = event.target.value;
    if (old_e.length < value.length) {
      onChange(old_e);
      return;
    }
    let new_phone = "";
    let e = "";
    for (let char of old_e) {
      if (char.match(/\d/, char) !== null) e += char;
    }
    e = e.length > 12 ? e.slice(0, 12) : e;
    if (e[0] == "+") e = e.slice(1);
    new_phone += "+";
    if (e.length !== 0)
      if (e[0] == "7") {
        new_phone += e[0];
        e = e.slice(1);
      } else {
        new_phone += "7";
      }
    else new_phone += "7";
    new_phone += " (";
    new_phone += e.slice(0, e.length < 3 ? e.length : 3);
    if (e.length >= 3) new_phone += ") ";

    e = e.slice(e.length < 3 ? e.length : 3);
    if (e.length !== 0) {
      new_phone += e.slice(0, e.length < 3 ? e.length : 3);
      if (e.length >= 3) new_phone += "-";
      e = e.slice(e.length < 3 ? e.length : 3);
    }

    if (e.length !== 0) {
      new_phone += e.slice(0, e.length < 2 ? e.length : 2);
      if (e.length >= 2) {
        new_phone += "-";
      }
      e = e.slice(e.length < 2 ? e.length : 2);
    }

    if (e.length !== 0) {
      new_phone += e.slice(0, e.length < 2 ? e.length : 2);
    }
    onChange(new_phone);
  };

  return (
    <>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white text-left">
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full rounded border border-stroke bg-gray py-2 px-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          type={type}
          value={value}
          name={name}
          id={id}
          placeholder={"+7"}
          defaultValue={defaultvalue}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default PhoneInput;
