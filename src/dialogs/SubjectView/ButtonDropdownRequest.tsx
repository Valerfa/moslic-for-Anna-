import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Fragment,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import TextAreaInput from "../../components/UI/General/Inputs/TextAreaInput";
import DefaultModalNarrow from "../../components/UI/General/Modal/DefaultModalNarrow";
import CheckboxQuarter from "../../components/UI/General/Inputs/CheckBoxQuarter";
import TextInput from "../../components/UI/General/Inputs/TextInput";

export default function ButtonDropdownRequest(props: {
  title: string;
  textbutton: string;
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onClickText: string;
  onClickClassName: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="w-96 text-left">
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
          <MenuItems className="absolute left-0 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1">
              {/* ---------- Модальное окно "Запрос краткой выписки из ЕГРЮЛ" ---------- */}
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "text-meta-5 text-left" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <DefaultModalNarrow
                      title={"Запрос краткой выписки из ЕГРЮЛ"}
                      textbutton={
                        "Выписка из ЕГРЮЛ по запросам органов государственной власти (СМЭВ 3)"
                      }
                      children={
                        <form action="#">
                          <div className="mb-5.5 grid grid-cols-8 gap-4">
                            <div className="col-span-7">
                              <label
                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                ИНН
                              </label>
                              <NumberInput></NumberInput>
                            </div>

                            <div className="col-span-7">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                ОГРН
                              </label>
                              <div className="">
                                <NumberInput></NumberInput>{" "}
                              </div>
                            </div>

                            <div className="p-3.5 rounded-md border border-stroke self-end">
                              {" "}
                              <CheckboxQuarter />
                            </div>
                          </div>
                        </form>
                      }
                      onClick={function (
                        event: MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Создать"}
                      onClickClassName={""}
                    />
                  </button>
                )}
              </MenuItem>

              {/* ---------- Модальное окно "Запрос для получения лицензии на медицинскую деятельность" ---------- */}
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "text-meta-5 text-left" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <DefaultModalNarrow
                      title={
                        "Запрос для получения лицензии на медицинскую деятельность"
                      }
                      textbutton={
                        "Лицензия на осуществление медицинской деятельности"
                      }
                      children={
                        <form action="#">
                          <div className="mb-4">
                            <div className="mb-5.5">
                              <div className="flex flex-row mb-2">
                                <CheckboxDefault />
                                <label className="text-left block text-sm font-medium dark:text-white">
                                  Группа 1
                                </label>
                              </div>
                              <div className="grid grid-cols-8 gap-4 border border-stroke rounded-md p-2">
                                <div className="col-span-4">
                                  <label
                                    className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                    htmlFor="emailAddress">
                                    ИНН
                                  </label>
                                  <NumberInput></NumberInput>
                                </div>

                                <div className="col-span-4">
                                  <label
                                    className="text-left block text-sm text-black font-medium dark:text-white"
                                    htmlFor="emailAddress">
                                    ОГРН
                                  </label>
                                  <div className="">
                                    <NumberInput></NumberInput>{" "}
                                  </div>
                                </div>
                                <div className="col-span-8">
                                  <div className="flex flex-row">
                                    <CheckboxQuarter />
                                    <label className="text-left block text-sm text-black font-medium dark:text-white">
                                      Вид деятельности
                                    </label>
                                  </div>
                                  <div className="">
                                    <SelectCustom />{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex flex-row mb-2">
                              <CheckboxDefault />
                              <label className="text-left block text-sm font-medium dark:text-white">
                                Группа 2
                              </label>
                            </div>
                            <div className="border border-stroke rounded-md p-2">
                              <TextInput
                                label={"Номер лицензии"}
                                type={""}
                                value={""}
                                name={""}
                                id={""}
                                placeholder={""}
                                defaultvalue={""}
                                onChange={undefined}
                                disable={false}
                              />
                            </div>
                          </div>
                        </form>
                      }
                      onClick={function (
                        event: MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Создать"}
                      onClickClassName={""}
                    />
                  </button>
                )}
              </MenuItem>

              {/* ---------- Модальное окно "Запрос для получения лицензии на образовательную деятельность" ---------- */}
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "text-meta-5 text-left" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <DefaultModalNarrow
                      title={
                        "Запрос для получения лицензии на образовательную деятельность"
                      }
                      textbutton={
                        "Лицензия на право ведения образовательной деятельности"
                      }
                      children={
                        <form action="#">
                          <div className="mb-5.5 grid grid-cols-8 gap-4">
                            <div className="col-span-7">
                              <label
                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                ИНН
                              </label>
                              <NumberInput></NumberInput>
                            </div>
                            <div className="p-3.5 rounded-md border border-stroke self-end">
                              {" "}
                              <CheckboxQuarter />
                            </div>

                            <div className="col-span-7">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                ОГРН
                              </label>
                              <div className="">
                                <NumberInput></NumberInput>{" "}
                              </div>
                            </div>

                            <div className="p-3.5 rounded-md border border-stroke self-end">
                              {" "}
                              <CheckboxQuarter />
                            </div>
                          </div>
                        </form>
                      }
                      onClick={function (
                        event: MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Создать"}
                      onClickClassName={""}
                    />
                  </button>
                )}
              </MenuItem>

              {/* ---------- Модальное окно "Запрос полной выписки из ЕГРЮЛ" ---------- */}
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "text-meta-5 text-left" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <DefaultModalNarrow
                      title={"Получение закрытых сведений из ЕГРЮЛ"}
                      textbutton={"Запрос полной выписки из ЕГРЮЛ"}
                      children={
                        <form action="#">
                          <div className="mb-5.5 grid grid-cols-8 gap-4">
                            <div className="col-span-7">
                              <label
                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                ИНН
                              </label>
                              <NumberInput></NumberInput>
                            </div>

                            <div className="col-span-7">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                ОГРН
                              </label>
                              <div className="">
                                <NumberInput></NumberInput>{" "}
                              </div>
                            </div>

                            <div className="p-3.5 rounded-md border border-stroke self-end">
                              {" "}
                              <CheckboxQuarter />
                            </div>
                          </div>
                        </form>
                      }
                      onClick={function (
                        event: MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Создать"}
                      onClickClassName={""}
                    />
                  </button>
                )}
              </MenuItem>

              {/* ---------- Модальное окно "Получение сведений о задолженностях" ---------- */}
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "text-meta-5 text-left" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <DefaultModalNarrow
                      title={"Получение сведений о задолженностях"}
                      textbutton={
                        "ФНС. Cведения о наличии (отсутствии) задолженности"
                      }
                      children={
                        <form action="#">
                          <div className="mb-5.5 grid grid-cols-8 gap-4">
                            <div className="col-span-5">
                              <NumberInput
                                label={"ИНН"}
                                name={""}
                                id={""}
                                placeholder={""}
                                value={""}
                                onChange={function (
                                  event: MouseEvent<
                                    HTMLButtonElement,
                                    globalThis.MouseEvent
                                  >
                                ): void {
                                  throw new Error("Function not implemented.");
                                }}></NumberInput>
                            </div>

                            <div className="col-span-3">
                              <div className="">
                                <DateDefaultInput
                                  label={"Дата"}
                                  onChange={undefined}
                                  selected={""}></DateDefaultInput>{" "}
                              </div>
                            </div>
                          </div>
                        </form>
                      }
                      onClick={function (
                        event: MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Создать"}
                      onClickClassName={""}
                    />
                  </button>
                )}
              </MenuItem>

              {/* ---------- Модальное окно "Получение сведений о задолженностях" ---------- */}
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "text-meta-5 text-left" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <DefaultModalNarrow
                      title={"Получение сведений о задолженностях"}
                      textbutton={
                        "ФНС. Cведения о наличии (отсутствии) задолженности свыше 3000 рублей"
                      }
                      children={
                        <form action="#">
                          <div className="mb-5.5 grid grid-cols-8 gap-4">
                            <div className="col-span-5">
                              <NumberInput
                                label={"ИНН"}
                                name={""}
                                id={""}
                                placeholder={""}
                                value={""}
                                onChange={function (
                                  event: MouseEvent<
                                    HTMLButtonElement,
                                    globalThis.MouseEvent
                                  >
                                ): void {
                                  throw new Error("Function not implemented.");
                                }}></NumberInput>
                            </div>

                            <div className="col-span-3">
                              <div className="">
                                <DateDefaultInput
                                  label={"Дата"}
                                  onChange={undefined}
                                  selected={""}></DateDefaultInput>{" "}
                              </div>
                            </div>
                          </div>
                        </form>
                      }
                      onClick={function (
                        event: MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Создать"}
                      onClickClassName={""}
                    />
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
