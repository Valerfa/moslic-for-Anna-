import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import DialogModal from "../Modal/DialogModal";
import DefaultModalNarrow from "../Modal/DefaultModalNarrow";
import SelectCustom from "../Inputs/Select";
import DateDefaultInput from "../Inputs/DateDefaultInput";
import NumberInput from "../Inputs/NumberInput";
import CheckboxDefault from "../Inputs/CheckboxDefault";
import TextAreaInput from "../Inputs/TextAreaInput";

export default function ButtonDropdown3(props: {
  title: string;
  textbutton: string;
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onClickText: string;
  onClickClassName: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="w-56 text-left">
      <Menu as="div" className="relative inline-block">
        <div>
          <MenuButton className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            Добавить документ
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <MenuItems className="absolute left-0 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "text-meta-5 text-left" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    {/* ---------- Модальное окно "Добавление документа" ---------- */}
                    <DefaultModalNarrow
                      title={"Добавление документа"}
                      textbutton={"Дополнительные документы по заявке"}
                      children={
                        <>
                          <form className="grid grid-cols-2 gap-4">
                            <div className="">
                              {" "}
                              <SelectCustom
                                value={undefined}
                                options={undefined}
                                onChange={undefined}
                                label={"Тип документа"}
                              />
                            </div>
                            <div className="">
                              {" "}
                              <DateDefaultInput
                                label={"Дата документа"}
                                onChange={undefined}
                                selected={""}
                              />
                            </div>
                            <div className="col-span-2">
                              {" "}
                              <NumberInput
                                label={"Номер документа"}
                                name={""}
                                id={""}
                                placeholder={""}
                                value={""}
                                onChange={function (
                                  event: React.MouseEvent<
                                    HTMLButtonElement,
                                    MouseEvent
                                  >
                                ): void {
                                  throw new Error("Function not implemented.");
                                }}
                              />
                            </div>
                            <div className="col-span-2">
                              {" "}
                              <TextAreaInput
                                label={"Комментарий"}
                                type={""}
                                value={""}
                                name={""}
                                id={""}
                                placeholder={""}
                                defaultvalue={""}
                                disable={false}
                              />
                              <div className="flex flex-row gap-4">
                                {" "}
                                <CheckboxDefault
                                  label={"Оригинал"}
                                  name={""}
                                  id={""}
                                  value={false}
                                  onChange={undefined}
                                />
                                <CheckboxDefault
                                  label={"Копия/эл.образ"}
                                  name={""}
                                  id={""}
                                  value={false}
                                  onChange={undefined}
                                />
                                <CheckboxDefault
                                  label={"Заверенная копия"}
                                  name={""}
                                  id={""}
                                  value={false}
                                  onChange={undefined}
                                />
                              </div>
                            </div>
                          </form>
                        </>
                      }
                      onClick={function (
                        event: MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Сохранить"}
                      onClickClassName={""}
                    />
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-violet-500 text-meta-5" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    {active ? (
                      <div className="text-black" aria-hidden="true" />
                    ) : (
                      <div
                        className="text-black hover:text-meta-5"
                        aria-hidden="true"
                      />
                    )}
                    Полный пакет на оформление лицензии
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
