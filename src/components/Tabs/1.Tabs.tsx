import { useState } from "react";
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs() {
  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
          <Tab
            className={({ selected }) =>
              classNames(
                "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                selected
                  ? "bg-primary text-white "
                  : "bg-gray text-black dark:bg-meta-4 dark:text-white"
              )
            }
          >
            Общая информация
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                selected
                  ? "bg-primary text-white "
                  : "bg-gray text-black dark:bg-meta-4 dark:text-white"
              )
            }
          >
            Справочники
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                selected
                  ? "bg-primary text-white "
                  : "bg-gray text-black dark:bg-meta-4 dark:text-white"
              )
            }
          >
            Оборот
          </Tab>
        </Tab.List>
        <Tab.Panels className="leading-relaxed block">
          <Tab.Panel
            className={classNames(
              "rounded-xl",
              "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            Общая информация
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "rounded-xl",
              "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            Справочники
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "rounded-xl",
              "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            Оборот
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
