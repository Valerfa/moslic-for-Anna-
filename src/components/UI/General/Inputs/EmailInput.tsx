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

const EmailInput = ({
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
    console.log("old ", old_e, " value ", value);
    if (old_e.length < value.length) {
      onChange(old_e);
      return;
    }
    let new_email = "";
    let pos = 0;
    while (pos < old_e.length && old_e[pos] != "@") {
      let char = old_e[pos++];
      if (char.match(/[A-Za-z0-9А-Яа-яёЁ_\-.]/, char) === null) continue;
      if (char === "." || char === "-")
        if (
          new_email[new_email.length - 1] === "." ||
          new_email[new_email.length - 1] === "-" ||
          old_e[pos] === "@"
        )
          continue;
      new_email += char;
    }
    if (pos < old_e.length) new_email += "@";
    let domens = old_e.slice(pos + 1).split(".");
    console.log(domens);
    let domens_count = 0;
    for (let domen of domens) {
      pos = 0;
      domens_count++;
      while (pos < domen.length) {
        let char = domen[pos++];
        if (char.match(/[A-Za-z0-9А-Яа-яёЁ_\-]/, char) === null) continue;
        if (
          char === "-" &&
          (new_email[new_email.length - 1] === "-" ||
            new_email[new_email.length - 1] === ".")
        )
          continue;
        new_email += char;
      }
      if (domens_count == domens.length) break;
      else new_email += ".";
    }
    onChange(new_email);
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
          placeholder={placeholder}
          defaultValue={defaultvalue}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default EmailInput;
