import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { usePopper } from "react-popper";

export default function CustomPopover({ name, children }) {
  let [referenceElement, setReferenceElement] = useState();
  let [popperElement, setPopperElement] = useState();
  let { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <Popover className="">
      <Popover.Button
        ref={setReferenceElement}
        className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        {name}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          className="absolute  bg-white border border-bodydark z-50 ag-theme-alpine ag-theme-acmecorp ag-popup"
          ref={setPopperElement}
        >
          <div className="">{children}</div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
