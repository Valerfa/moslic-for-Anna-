import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function AsyncSelectCustom({
  value,
  onChange,
  queryChange,
  placeholder,
  prepareRawInput,
  displayField,
  filterLimit,
}) {
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState("");

  const handleOption = (e) => {
    onChange(e);
  };

  const handleChange = async (e) => {
    let new_e = "";
    onChange(null);
    if (prepareRawInput === null || prepareRawInput === undefined)
      new_e = e.target.value;
    else new_e = prepareRawInput(e.target.value);
    console.log(new_e);
    setQuery(new_e);
    if (new_e.length < filterLimit) return;
    setOptions(await queryChange(new_e));
  };

  return (
    <div>
      <Combobox value={value} onChange={handleOption} nullable>
        <div className="relative mt-1">
          <Combobox.Input
            className="relative z-20 w-full appearance-none rounded border border-stroke bg-gray py-2 pl-5 pr-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-meta-4"
            displayValue={(value) => value?.name}
            // value={(value) => value === null? query : value.name}
            onChange={handleChange}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}>
            <Combobox.Options className="absolute mt-1 z-30 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Пусто.
                </div>
              ) : (
                options.map((option, optionIdx) => (
                  <Combobox.Option
                    key={optionIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? "bg-primary text-white" : "text-gray-900"
                      }`
                    }
                    value={option}>
                    {({ value, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            value ? "font-medium" : "font-normal"
                          }`}>
                          {option[displayField]}
                        </span>
                        {value ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
