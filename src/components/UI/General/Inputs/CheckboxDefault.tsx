import { useState } from "react";

interface CheckboxDefaultProps {
  label: string;
  name: string;
  id: string;
  value: boolean;
  onChange: any;
}

const CheckboxDefault = ({
  label,
  name,
  id,
  value,
  onChange,
}: CheckboxDefaultProps) => {
  return (
    <div>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            name={name}
            className="sr-only"
            onChange={() => {
              onChange(!value);
            }}
          />
          <div
            className={`box mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary ${
              value && "!border-4"
            }`}>
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CheckboxDefault;
