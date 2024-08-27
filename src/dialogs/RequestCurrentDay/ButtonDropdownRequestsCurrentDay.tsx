import {
  Menu,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from "@headlessui/react";
import { Fragment, MouseEvent } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import DialogModal2 from "../../pages/9.Okno/LicenseList/DialogModal2";
import DialogModal from "../../components/UI/General/Modal/DialogModal";
import TextInput from "../../components/UI/General/Inputs/TextInput";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput";
import DefaultModalWide from "../../components/UI/General/Modal/DefaultModalWide";
import TextAreaInput from "../../components/UI/General/Inputs/TextAreaInput";
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import IconButtonX from "../../components/UI/General/Buttons/IconButtonX";
import IconButtonList from "../../components/UI/General/Buttons/IconButtonList";
import CheckboxQuarter from "../../components/UI/General/Inputs/CheckBoxQuarter";
import ModalSearchSubject from "./ModalSearchSubject";
import CardFilter from "../../components/UI/General/CardFilter/CardFilter";
import { Link } from "react-router-dom";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";

export default function ButtonDropdownRequestsCurrentDay() {
  return (
    <div className="w-56">
      <Menu as="div" className="relative z-9 inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white hover:bg-primary border border-graydark hover:border-white px-4 py-2 text-sm font-medium text-graydark hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            Добавить обращение{" "}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              {/* -----------------------------------------начало--------------------------------------------
                   ---------------------------------------------------------------------------------------------
                  -------------------- Заявка на получение лицензии --------------------
                  ----------------------------------------------------------------------------------------------
                  -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                {/* ---------- Модальное окно "Поиск субъекта" ---------- */}
                <ModalSearchSubject
                  title={"Поиск субъекта"}
                  textbutton={"Заявка на получение лицензии"}
                  children={
                    <>
                      <div className="flex items-end gap-4 place-content-end mb-5.5">
                        <div className="w-2/5">
                          <div className="flex flex-row items-center">
                            <CheckboxQuarter />{" "}
                            <label className="text-sm text-black">
                              По наименованию{" "}
                            </label>{" "}
                          </div>
                          <TextInput
                            label={""}
                            type={""}
                            value={""}
                            name={""}
                            id={""}
                            placeholder={""}
                            defaultvalue={""}
                            onChange={undefined}
                            disable={false}></TextInput>
                        </div>
                        <div className="w-1/4">
                          <div className="flex flex-row items-center">
                            <CheckboxQuarter />{" "}
                            <label className="text-sm text-black">
                              По ИНН{" "}
                            </label>{" "}
                          </div>
                          <NumberInput
                            label={""}
                            type={""}
                            value={""}
                            name={""}
                            id={""}
                            placeholder={""}
                            defaultvalue={""}
                            disable={false}></NumberInput>
                        </div>
                        <ButtonPrimary
                          children={undefined}
                          onClick={function (
                            event: MouseEvent<
                              HTMLButtonElement,
                              globalThis.MouseEvent
                            >
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          id={undefined}>
                          {" "}
                          Поиск
                        </ButtonPrimary>
                      </div>
                      <div className="">
                        <div className="w-full border border-stroke rounded-md p-4">
                          <Link to="/subject-add">
                            {" "}
                            <ButtonsSecondary
                              children={undefined}
                              onClick={function (
                                event: MouseEvent<
                                  HTMLButtonElement,
                                  globalThis.MouseEvent
                                >
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                              id={undefined}>
                              Добавить ЮЛ
                            </ButtonsSecondary>
                          </Link>

                          <p> "Место для таблицы"</p>
                        </div>
                      </div>
                    </>
                  }
                  onClick={function (
                    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  onClickText={"Выбрать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                />
              </Menu.Item>
              {/* -----------------------------------------конец---------------------------------------------------  */}

              {/* ------------------------------начало-------------------------------------------------------
                   ---------------------------------------------------------------------------------------------
                  -------------------- Заявка на продление лицензии --------------------
                  ----------------------------------------------------------------------------------------------
                  -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DialogModal2
                  title={"Запрос выписки из ЕГРЮЛ"}
                  textbutton={"Запрос выписки из ЕГРЮЛ"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
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
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                          Создать
                        </button>
                      </div>
                    </>
                  }></DialogModal2>
              </Menu.Item>
              {/*---------------------------------------конец-----------------------------------------------------  */}

              {/* ------------------------------------------начало-------------------------------------------
                   ---------------------------------------------------------------------------------------------
                  -------------------- Заявка на переоформление лицензии --------------------
                  ----------------------------------------------------------------------------------------------
                  -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DialogModal2
                  title={"Запрос краткой выписки из ЕГРЮЛ"}
                  textbutton={"Запрос краткой выписки из ЕГРЮЛ"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
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
                            <CheckboxDefault />
                          </div>
                        </div>
                      </form>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                          Создать
                        </button>
                      </div>
                    </>
                  }></DialogModal2>
              </Menu.Item>
              {/*-------------------------------------------конец------------------------------------------------  */}

              {/* ------------------------------------------начало-------------------------------------------
                   ---------------------------------------------------------------------------------------------
                  -------------------- Заявка на прекращение лицензии --------------------
                  ----------------------------------------------------------------------------------------------
                  -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DefaultModalWide
                  title={"Запрос на предоставление различных данных по ОН"}
                  textbutton={"Запрос выписки из ЕГРН"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      <div>
                        <div className="mb-5.5 grid grid-cols-9 gap-4">
                          <div className="col-span-3">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Объект
                            </label>
                            <SelectCustom></SelectCustom>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Тип
                            </label>
                            <div className="">
                              <SelectCustom></SelectCustom>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Кадастровый номер
                            </label>
                            <div className="">
                              <NumberInput></NumberInput>{" "}
                            </div>
                          </div>
                          <div className="col-span-9">
                            <div className="flex flex-row gap-2">
                              {" "}
                              <CheckboxDefault />
                              <label
                                className="w-full text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                Адрес
                              </label>
                            </div>

                            <div className="flex flex-row gap-4">
                              <div className="w-1/3">
                                <SelectCustom></SelectCustom>
                              </div>{" "}
                              <div className="w-1/3">
                                <SelectCustom></SelectCustom>
                              </div>{" "}
                              <div className="w-1/3">
                                <TextInput></TextInput>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-9">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Характеристики
                            </label>
                            <div className="rounded-md border border-stroke p-8">
                              <ButtonPrimary>
                                <DefaultModal
                                  title={"Добавить характеристику"}
                                  textbutton={"Добавить"}
                                  children={
                                    <>
                                      <div className="flex flex-row gap-4">
                                        <div className="w-1/3">
                                          <label
                                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                            htmlFor="emailAddress">
                                            Тип
                                          </label>
                                          <SelectCustom />
                                        </div>
                                        <div className="w-1/3">
                                          <label
                                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                            htmlFor="emailAddress">
                                            Единица измерения
                                          </label>
                                          <SelectCustom />
                                        </div>
                                        <div className="w-1/3">
                                          <label
                                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                            htmlFor="emailAddress">
                                            Значение
                                          </label>
                                          <TextInput />
                                        </div>
                                      </div>
                                    </>
                                  }
                                  buttons={undefined}
                                />
                              </ButtonPrimary>
                              - Место для таблицы -
                            </div>
                          </div>

                          <div className="col-span-9">
                            <label
                              className="w-full text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Дополнительная информация
                            </label>
                            <div className="flex flex-row gap-4">
                              <div className="w-1/2">
                                <label
                                  className="text-left mb-2 block text-sm font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Тэги дополнительных сведений (без справочного
                                  значения)
                                </label>
                                <TextAreaInput />
                              </div>
                              <div className="w-1/2">
                                <label
                                  className="text-left mb-2 block text-sm font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Дополнительные сведения
                                </label>
                                <TextAreaInput />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }></DefaultModalWide>
              </Menu.Item>
              {/*-----------------------------------------конец--------------------------------------------------  */}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

function EditInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArchiveInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function ArchiveActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}
