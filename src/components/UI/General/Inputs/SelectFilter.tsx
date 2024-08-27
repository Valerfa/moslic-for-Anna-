import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function SelectFilter({ value, options, onChange }) {
  const handleOption = (e) => {
    onChange(e);
  };

  return (
    <div>
      <Listbox value={value} onChange={handleOption}>
        <div className="relative">
          <Listbox.Button className="relative z-20 w-full appearance-none rounded border border-stroke bg-primary text-white py-2 pl-5 pr-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-meta-4">
            <span className="block truncate text-left">
              {value == null ? null : value.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options?.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none hover:bg-gray py-2 pl-8 pr-4 ${
                      active ? "text-black" : "text-form-strokedark "
                    }`
                  }
                  value={option}
                >
                  {({ value }) => (
                    <>
                      <span
                        className={`block truncate text-left ${
                          value ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {value ? (
                        <span className="absolute inset-y-0 left-0 flex items-center">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
