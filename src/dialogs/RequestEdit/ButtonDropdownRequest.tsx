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

export default function ButtonDropdownRequest() {
  return (
    <div className="w-56">
      <Menu as="div" className="relative z-2 inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white hover:bg-primary border border-graydark hover:border-white px-4 py-2 text-sm font-medium text-graydark hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            Сформировать запрос
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
          <Menu.Items className="absolute left-0 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              {/* -----------------------------------------начало--------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Запрос сведений о задолженностях из ФНС  --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DialogModal2
                  title={"Получение сведений о задолженностях"}
                  textbutton={"Запрос сведений о задолженностях из ФНС"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      <form action="#">
                        <div className="mb-5.5 grid grid-cols-8 gap-4">
                          <div className="col-span-8">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              ИНН
                            </label>
                            <NumberInput></NumberInput>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Дата
                            </label>
                            <div className="">
                              <DateDefaultInput></DateDefaultInput>{" "}
                            </div>
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
              {/* -----------------------------------------конец---------------------------------------------------  */}

              {/* ------------------------------начало-------------------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Запрос выписки из ЕГРЮЛ --------------------
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
              {/*---------------------------------------конец-----------------------------------------------------  */}

              {/* ------------------------------------------начало-------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Запрос краткой выписки из ЕГРЮЛ --------------------
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
                -------------------- Запрос на предоставление различных данных по ОН --------------------
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

              {/* -----------------------------------------начало--------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Выписка о содержании правоустанавливающих документов --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DefaultModalWide
                  title={"Выписка о содержании правоустанавливающих документов"}
                  textbutton={
                    "Запрос выписки о правоустанавливающих документах"
                  }
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      <TabGroup>
                        <TabList className="flex flex-wrap gap-3 pb-5 dark:border-strokedark">
                          <div className="flex justify-between w-full">
                            <div className="flex flex-wrap gap-3">
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-xs font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Объект недвижимости
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-xs font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Документ, подтверждающий полномочия
                                представителя
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-xs font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Правоустанавливающие документы
                              </Tab>
                            </div>
                          </div>
                        </TabList>
                        <TabPanels className="leading-relaxed block p-5.5">
                          {/*Вкладка "Объект недвижимости" */}
                          <TabPanel>
                            {" "}
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
                                        Тэги дополнительных сведений (без
                                        справочного значения)
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
                          </TabPanel>
                          {/*Вкладка "Документ, подтверждающий полномочия
                                представителя" */}
                          <TabPanel>
                            {" "}
                            <ButtonPrimary>
                              <DefaultModalWide
                                title={
                                  "Реквизиты документа, подтверждающего полномочия представителя"
                                }
                                onClickText={"Сохранить"}
                                textbutton={"Добавить"}
                                children={
                                  <>
                                    <TabGroup>
                                      <TabList className="flex flex-wrap gap-3 pb-5 dark:border-strokedark">
                                        <div className="flex justify-between w-full">
                                          <div className="flex flex-wrap gap-3">
                                            <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-xs font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                              Общие сведения
                                            </Tab>
                                            <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-xs font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                              Выдан
                                            </Tab>
                                            <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-xs font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                              Особые отметки
                                            </Tab>
                                            <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-xs font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                              Нотариальное заверение
                                            </Tab>
                                          </div>
                                        </div>
                                      </TabList>
                                      <TabPanels className="leading-relaxed block">
                                        {/*Вкладка "Общие сведения" */}
                                        <TabPanel>
                                          {" "}
                                          <div className="mb-5.5 grid grid-cols-12 gap-4">
                                            <div className="col-span-12">
                                              <label
                                                className="w-full text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Файл
                                              </label>
                                              <div className="flex flex-row gap-4">
                                                <div className="text-left text-primary text-xs self-center border border-stroke p-4 rounded-md">
                                                  Название файла.xls
                                                </div>
                                                <div className="self-center">
                                                  <ButtonPrimary
                                                    children={undefined}
                                                    onClick={function (
                                                      event: React.MouseEvent<
                                                        HTMLButtonElement,
                                                        MouseEvent
                                                      >
                                                    ): void {
                                                      throw new Error(
                                                        "Function not implemented."
                                                      );
                                                    }}
                                                    id={undefined}>
                                                    Выбрать файл
                                                  </ButtonPrimary>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-span-6">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Наименование
                                              </label>
                                              <div className="">
                                                <TextInput />
                                              </div>
                                            </div>

                                            <div className="col-span-6">
                                              <label
                                                className="text-left block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Тип документов
                                              </label>
                                              <div className="">
                                                <SelectCustom />
                                              </div>
                                            </div>
                                            <div className="col-span-6">
                                              <label
                                                className="text-left block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Серия / номер
                                              </label>
                                              <div className="flex flex-row">
                                                <div className="w-1/3">
                                                  {" "}
                                                  <NumberInput />
                                                </div>
                                                <p className="text-xl px-2 self-center">
                                                  /
                                                </p>{" "}
                                                <div className="w-2/3">
                                                  {" "}
                                                  <NumberInput />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-span-6">
                                              <label
                                                className="text-left block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Срок действия
                                              </label>
                                              <div className="flex flex-row">
                                                <p className="px-2 self-center">
                                                  с:
                                                </p>
                                                <div className="">
                                                  {" "}
                                                  <DateDefaultInput />
                                                </div>
                                                <p className="px-2 self-center">
                                                  по:
                                                </p>{" "}
                                                <div className="">
                                                  {" "}
                                                  <DateDefaultInput />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </TabPanel>
                                        {/*Вкладка "Выдан" */}
                                        <TabPanel>
                                          <div className="mb-5.5 grid grid-cols-12 gap-4">
                                            <div className="col-span-12">
                                              {" "}
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Выдавшая организация или автор
                                                документа
                                              </label>
                                              <div className="">
                                                <TextInput />
                                              </div>
                                            </div>
                                            <div className="col-span-4">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Код подразделения
                                              </label>
                                              <div className="">
                                                <NumberInput />
                                              </div>
                                            </div>
                                            <div className="col-span-4">
                                              <label
                                                className="text-left block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Дата выдачи
                                              </label>
                                              <div className="">
                                                <DateDefaultInput />
                                              </div>
                                            </div>
                                          </div>
                                        </TabPanel>
                                        {/*Вкладка "Особые отметки" */}
                                        <TabPanel>
                                          <div className="mb-5.5 grid grid-cols-12 gap-4">
                                            <div className="col-span-12">
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
                                                    Тэги дополнительных сведений
                                                    (без справочного значения)
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
                                        </TabPanel>
                                        {/*Вкладка "Нотариальное заверение" */}
                                        <TabPanel>
                                          {" "}
                                          <div className="mb-5.5 grid grid-cols-12 gap-4">
                                            <div className="col-span-12">
                                              {" "}
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Зарегистрировал (ФИО нотариуса)
                                              </label>
                                              <div className="">
                                                <TextInput />
                                              </div>
                                            </div>
                                            <div className="col-span-8">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Номер нотариального документа в
                                                реестре нотариальных действий
                                              </label>
                                              <div className="">
                                                <NumberInput />
                                              </div>
                                            </div>
                                            <div className="col-span-4">
                                              <label
                                                className="text-left block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Дата регистрации
                                              </label>
                                              <div className="">
                                                <DateDefaultInput />
                                              </div>
                                            </div>
                                          </div>
                                        </TabPanel>
                                      </TabPanels>
                                    </TabGroup>
                                  </>
                                }
                                buttons={undefined}
                              />
                            </ButtonPrimary>
                            <IconButtonX
                              onClick={function (
                                event: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                              title={""}
                            />
                          </TabPanel>
                          {/*Вкладка " Правоустанавливающие документы" */}
                          <TabPanel>
                            <div className="mb-5.5 grid grid-cols-12 gap-4">
                              <div className="col-span-6">
                                <label
                                  className="w-full text-left block text-sm text-black font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Информация по кодам документа
                                </label>
                                <div className="flex flex-row">
                                  <div className="w-2/3">
                                    <TextInput />
                                  </div>
                                  <div className="w-1/3 self-end">
                                    <ButtonPrimary>
                                      <DefaultModalWide
                                        title={"Информация по кодам документа"}
                                        onClickText={"Выбрать"}
                                        textbutton={"Выбрать"}
                                        children={<></>}
                                        buttons={undefined}
                                      />
                                    </ButtonPrimary>
                                  </div>
                                </div>
                              </div>

                              <div className="col-span-6">
                                <label
                                  className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Наименование документа
                                </label>
                                <div className="">
                                  <TextInput />
                                </div>
                              </div>

                              <div className="col-span-4">
                                <label
                                  className="text-left block text-sm text-black font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Номер документа
                                </label>
                                <div className="">
                                  <TextInput />
                                </div>
                              </div>

                              <div className="col-span-4">
                                <label
                                  className="text-left block text-sm text-black font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Серия документа
                                </label>
                                <div className="">
                                  <TextInput />
                                </div>
                              </div>
                              <div className="col-span-4">
                                <label
                                  className="text-left block text-sm text-black font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Дата выдачи
                                </label>
                                <div className="">
                                  <DateDefaultInput />
                                </div>
                              </div>
                              <div className="col-span-12">
                                <label
                                  className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                  htmlFor="emailAddress">
                                  Положения правоустанавливающего документа
                                </label>
                                <div className="">
                                  <TextInput />
                                </div>
                              </div>
                            </div>
                          </TabPanel>
                        </TabPanels>
                      </TabGroup>
                    </>
                  }></DefaultModalWide>
              </Menu.Item>
              {/*------------------------------------------конец--------------------------------------------------  */}

              {/* -----------------------------------------начало--------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Кадастровый план территории --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DialogModal2
                  title={"Кадастровый план территории"}
                  textbutton={"Запрос кадастрового плана территории"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      <form action="#">
                        <div className="mb-5.5 grid grid-cols-12 gap-4">
                          <div className="col-span-12">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Объект
                            </label>
                            <SelectCustom></SelectCustom>
                          </div>
                          <div className="col-span-12">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Индентификатор
                            </label>
                            <NumberInput></NumberInput>
                          </div>
                          <div className="col-span-12">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Кадастровый номер
                            </label>
                            <SelectCustom></SelectCustom>
                          </div>
                          <div className="col-span-12">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Ориентиры
                            </label>
                            <TextAreaInput></TextAreaInput>
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
              {/*-----------------------------------------конец---------------------------------------------------  */}

              {/* ------------------------------------------начало-------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Запрос поэтажного плана --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DefaultModalWide
                  title={"Поэтажный план"}
                  textbutton={"Запрос поэтажного плана"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      <div>
                        <div className="mb-5.5 grid grid-cols-12 gap-4">
                          <div className="col-span-6">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Объект
                            </label>
                            <SelectCustom></SelectCustom>
                          </div>

                          <div className="col-span-6 flex flex-row gap-4">
                            <div className="w-1/3">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                Код УНОМ
                              </label>
                              <div className="flex flex-row gap-1">
                                <div className="flex-auto">
                                  <TextInput></TextInput>
                                </div>
                                <div className="self-end">
                                  <DefaultIconModalWide
                                    name={""}
                                    title={""}
                                    textbutton={""}
                                    icon={<IconButtonList />}
                                    children={
                                      <>
                                        <form action="#">
                                          <div className="mb-5.5 grid grid-cols-12 gap-4">
                                            <div className="col-span-4">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Округ
                                              </label>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-4">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Район
                                              </label>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-4">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Здание
                                              </label>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-4 border border-stroke p-4 rounded-md">
                                              <div className="w-full">
                                                {" "}
                                                <SelectCustom />
                                              </div>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-8 border border-stroke p-4 rounded-md">
                                              <div className="w-1/2">
                                                {" "}
                                                <SelectCustom />
                                              </div>
                                              <div className="w-full">
                                                {" "}
                                                <SelectCustom
                                                  value={undefined}
                                                  options={undefined}
                                                  onChange={undefined}
                                                  title={"Название"}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-span-6 border border-stroke p-4 rounded-md">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Корпус
                                              </label>
                                              <div className="flex flex-row gap-2">
                                                <div className="w-1/3">
                                                  {" "}
                                                  <TextInput></TextInput>
                                                </div>
                                                <div className="w-1/3">
                                                  <SelectCustom />
                                                </div>
                                                <div className="w-1/3">
                                                  {" "}
                                                  <TextInput></TextInput>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-span-6">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Код УНОМ
                                              </label>
                                              <TextInput></TextInput>
                                            </div>
                                          </div>
                                        </form>
                                      </>
                                    }
                                    onClick={function (
                                      event: MouseEvent<
                                        HTMLButtonElement,
                                        globalThis.MouseEvent
                                      >
                                    ): void {
                                      throw new Error(
                                        "Function not implemented."
                                      );
                                    }}
                                    onClickText={""}
                                    onClickClassName={
                                      ""
                                    }></DefaultIconModalWide>
                                </div>
                              </div>
                            </div>
                            <div className="w-1/3">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                Этаж
                              </label>
                              <div className="">
                                <SelectCustom></SelectCustom>
                              </div>
                            </div>
                            <div className="w-1/3">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                Номер этажа
                              </label>
                              <div className="">
                                <NumberInput></NumberInput>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12">
                            <label
                              className="mb-2 text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Признак получения документа
                            </label>
                            <div className="flex flex-row gap-4 p-4 border border-stroke rounded-md">
                              <div className="w-1/2 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black">
                                  Растровая часть поэтажного плана
                                </p>
                              </div>
                              <div className="w-1/2 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black">
                                  DWG-чертеж всего этажа
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12">
                            <label
                              className="mb-2 text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Номер помещения/Набор комнат
                            </label>
                            <div className="p-4 rounded-md border border-stroke">
                              <DialogModal
                                title={"Номер помещения/Набор комнат"}
                                textbutton={"Добавить"}
                                children={
                                  <>
                                    <form action="#">
                                      <div className="mb-5.5 grid grid-cols-12 gap-4">
                                        <div className="col-span-6">
                                          <label
                                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                            htmlFor="emailAddress">
                                            Номер помещения
                                          </label>
                                          <TextInput></TextInput>
                                        </div>
                                        <div className="col-span-6">
                                          <label
                                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                            htmlFor="emailAddress">
                                            Комнаты
                                          </label>
                                          <SelectCustom></SelectCustom>
                                        </div>
                                      </div>
                                    </form>
                                  </>
                                }
                                buttons={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-span-6">
                            {" "}
                            <label
                              className="mb-2 text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Формат листа
                            </label>
                            <SelectCustom />
                          </div>
                          <div className="col-span-6">
                            {" "}
                            <label
                              className="mb-2 text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Тип выгрузки
                            </label>
                            <SelectCustom
                              value={undefined}
                              options={undefined}
                              onChange={undefined}
                            />
                          </div>

                          <div className="col-span-12">
                            <label
                              className="mb-2 text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Полный план
                            </label>
                            <div className="flex flex-row gap-4 p-4 border border-stroke rounded-md">
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">Комната</p>
                              </div>
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">Помещение</p>
                              </div>
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">Этаж</p>
                              </div>
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">
                                  Объект права
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12">
                            <label
                              className="mb-2 text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Только контуры объектов
                            </label>
                            <div className="flex flex-row gap-4 p-4 border border-stroke rounded-md">
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">Комната</p>
                              </div>
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">Помещение</p>
                              </div>
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">Этаж</p>
                              </div>
                              <div className="w-1/4 flex flex-row gap-2">
                                <CheckboxDefault></CheckboxDefault>{" "}
                                <p className="text-black text-sm">
                                  Объект права
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Имя листа
                            </label>
                            <div className="">
                              <TextInput />
                            </div>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Масштаб
                            </label>
                            <div className="">
                              <SelectCustom />
                            </div>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Разрешение
                            </label>
                            <div className="">
                              <SelectCustom />
                            </div>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Признак источника данных
                            </label>
                            <div className="">
                              <SelectCustom />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }></DefaultModalWide>
              </Menu.Item>
              {/*------------------------------------------конец--------------------------------------------------  */}

              {/* ------------------------------------------начало-------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Экспликация к поэтажному плану --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DefaultModalWide
                  title={"Экспликация к поэтажному плану"}
                  textbutton={"Запрос эспликации к поэтажному плану"}
                  onClickText={"Сохранить"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      <div>
                        <div className="mb-5.5 grid grid-cols-12 gap-4">
                          <div className="col-span-12 flex flex-row gap-4">
                            <div className="w-1/2">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                Код УНОМ
                              </label>
                              <div className="flex flex-row gap-1">
                                <div className="flex-auto">
                                  <TextInput></TextInput>
                                </div>
                                <div className="self-end">
                                  <DefaultIconModalWide
                                    name={""}
                                    title={""}
                                    textbutton={""}
                                    icon={<IconButtonList />}
                                    children={
                                      <>
                                        <form action="#">
                                          <div className="mb-5.5 grid grid-cols-12 gap-4">
                                            <div className="col-span-4">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Округ
                                              </label>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-4">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Район
                                              </label>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-4">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Здание
                                              </label>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-4 border border-stroke p-4 rounded-md">
                                              <div className="w-full">
                                                {" "}
                                                <SelectCustom />
                                              </div>
                                              <div className="w-full">
                                                {" "}
                                                <TextInput></TextInput>
                                              </div>
                                            </div>
                                            <div className="col-span-8 border border-stroke p-4 rounded-md">
                                              <div className="w-1/2">
                                                {" "}
                                                <SelectCustom />
                                              </div>
                                              <div className="w-full">
                                                {" "}
                                                <SelectCustom
                                                  value={undefined}
                                                  options={undefined}
                                                  onChange={undefined}
                                                  title={"Название"}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-span-6 border border-stroke p-4 rounded-md">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Корпус
                                              </label>
                                              <div className="flex flex-row gap-2">
                                                <div className="w-1/3">
                                                  {" "}
                                                  <TextInput></TextInput>
                                                </div>
                                                <div className="w-1/3">
                                                  <SelectCustom />
                                                </div>
                                                <div className="w-1/3">
                                                  {" "}
                                                  <TextInput></TextInput>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-span-6">
                                              <label
                                                className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                                                htmlFor="emailAddress">
                                                Код УНОМ
                                              </label>
                                              <TextInput></TextInput>
                                            </div>
                                          </div>
                                        </form>
                                      </>
                                    }
                                    onClick={function (
                                      event: MouseEvent<
                                        HTMLButtonElement,
                                        globalThis.MouseEvent
                                      >
                                    ): void {
                                      throw new Error(
                                        "Function not implemented."
                                      );
                                    }}
                                    onClickText={""}
                                    onClickClassName={
                                      ""
                                    }></DefaultIconModalWide>
                                </div>
                              </div>
                            </div>
                            <div className="w-1/2">
                              <label
                                className="text-left block text-sm text-black font-medium dark:text-white"
                                htmlFor="emailAddress">
                                Уникальный номер квартиры
                              </label>
                              <div className="">
                                <SelectCustom></SelectCustom>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }></DefaultModalWide>
              </Menu.Item>
              {/*------------------------------------------конец--------------------------------------------------  */}

              {/* ------------------------------------------начало-------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Запрос сведений об оплатах из РНиП --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DefaultModalWide
                  title={"Запрос сведений об оплатах из РНиП"}
                  textbutton={"Запрос сведений об оплатах из РНиП"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      {" "}
                      <form action="#">
                        <div className="mb-5.5 grid grid-cols-12 gap-4">
                          <div className="col-span-12">
                            <div className="flex flex-col pb-4">
                              <div className="flex flex-row gap-2">
                                <span>Вид запроса:</span>
                                <span className="text-black">[Данные]</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12">
                            <div className="flex flex-row mb-2">
                              <CheckboxQuarter />
                              <label className="text-left block text-sm text-black font-medium dark:text-white">
                                Получатель
                              </label>
                            </div>
                            <div className="border border-stroke rounded-md p-4 flex flex-col gap-3">
                              {" "}
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Департамент торговли и услуг города Москвы
                                </label>
                              </div>
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Иное значение
                                </label>
                              </div>
                              <div className="flex flex-row gap-4">
                                <div className="flex-auto">
                                  <TextInput
                                    label={"ИНН"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></TextInput>
                                </div>{" "}
                                <div className="flex-auto">
                                  <TextInput
                                    label={"КБК"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></TextInput>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="flex flex-row mb-2">
                              <CheckboxQuarter />
                              <label className="text-left block text-sm text-black font-medium dark:text-white">
                                По идентификатору
                              </label>
                            </div>
                            <div className="border border-stroke rounded-md p-4 flex flex-col gap-3">
                              {" "}
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Плательщика
                                </label>
                              </div>
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Начисления
                                </label>
                              </div>
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Платежа
                                </label>
                              </div>
                              <div className="flex flex-row gap-4">
                                <div className="w-1/2">
                                  <TextInput
                                    label={"ИНН"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></TextInput>
                                </div>{" "}
                                <div className="w-1/2">
                                  <SelectCustom
                                    label={"КПП"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></SelectCustom>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-6 my-4">
                            {" "}
                            <div className="flex flex-row mb-2">
                              <CheckboxQuarter />
                              <label className="text-left block text-sm text-black font-medium dark:text-white">
                                Дата
                              </label>
                            </div>
                            <div className="flex flex-row gap-4 mb-2 border border-stroke p-4 rounded-md">
                              <div>
                                {" "}
                                <DateDefaultInput
                                  label={"С"}
                                  onChange={undefined}
                                  selected={""}
                                />{" "}
                              </div>
                              <div>
                                <DateDefaultInput
                                  label={"По"}
                                  onChange={undefined}
                                  selected={""}
                                />{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </>
                  }></DefaultModalWide>
              </Menu.Item>
              {/* ------------------------------конец-------------------------------------------------------*/}

              {/* ------------------------------------------начало-------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Запрос сведений о начислениях --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DefaultModalWide
                  title={"Запрос сведений о начислениях из РНиП"}
                  textbutton={"Запрос сведений о начислениях из РНиП"}
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      {" "}
                      <form action="#">
                        <div className="mb-5.5 grid grid-cols-12 gap-4">
                          <div className="col-span-12">
                            <div className="flex flex-col pb-4">
                              <div className="flex flex-row gap-2 items-center">
                                <span>Вид запроса:</span>
                                <span className="text-black">
                                  {" "}
                                  <div className="flex flex-row">
                                    <CheckboxDefault />
                                    <label className="text-left block text-sm text-black font-medium dark:text-white">
                                      Неоплаченные штрафы
                                    </label>
                                  </div>
                                </span>
                                <span className="text-black">
                                  {" "}
                                  <div className="flex flex-row">
                                    <CheckboxDefault />
                                    <label className="text-left block text-sm text-black font-medium dark:text-white">
                                      Все штрафы
                                    </label>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12">
                            <div className="flex flex-row mb-2">
                              <CheckboxQuarter />
                              <label className="text-left block text-sm text-black font-medium dark:text-white">
                                Получатель
                              </label>
                            </div>
                            <div className="border border-stroke rounded-md p-4 flex flex-col gap-3">
                              {" "}
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Департамент торговли и услуг города Москвы
                                </label>
                              </div>
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Иное значение
                                </label>
                              </div>
                              <div className="flex flex-row gap-4">
                                <div className="flex-auto">
                                  <TextInput
                                    label={"ИНН"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></TextInput>
                                </div>{" "}
                                <div className="flex-auto">
                                  <TextInput
                                    label={"КБК"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></TextInput>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="flex flex-row mb-2">
                              <CheckboxQuarter />
                              <label className="text-left block text-sm text-black font-medium dark:text-white">
                                По идентификатору
                              </label>
                            </div>
                            <div className="border border-stroke rounded-md p-4 flex flex-col gap-3">
                              {" "}
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Плательщика
                                </label>
                              </div>
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Начисления
                                </label>
                              </div>
                              <div className="flex flex-row">
                                <CheckboxDefault />
                                <label className="text-left block text-sm text-black font-medium dark:text-white">
                                  Платежа
                                </label>
                              </div>
                              <div className="flex flex-row gap-4">
                                <div className="w-1/2">
                                  <TextInput
                                    label={"ИНН"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></TextInput>
                                </div>{" "}
                                <div className="w-1/2">
                                  <SelectCustom
                                    label={"КПП"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}></SelectCustom>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-6 my-4">
                            {" "}
                            <div className="flex flex-row mb-2">
                              <CheckboxQuarter />
                              <label className="text-left block text-sm text-black font-medium dark:text-white">
                                Дата
                              </label>
                            </div>
                            <div className="flex flex-row gap-4 mb-2 border border-stroke p-4 rounded-md">
                              <div>
                                {" "}
                                <DateDefaultInput
                                  label={"С"}
                                  onChange={undefined}
                                  selected={""}
                                />{" "}
                              </div>
                              <div>
                                <DateDefaultInput
                                  label={"По"}
                                  onChange={undefined}
                                  selected={""}
                                />{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </>
                  }></DefaultModalWide>
              </Menu.Item>
              {/* ----------------------------конец-------------------------------------------------------*/}

              {/* -----------------------------------------начало--------------------------------------------
                 ---------------------------------------------------------------------------------------------
                -------------------- Запрос сведений о задолженностях из ФНС свыше 3000 рублей --------------------
                ----------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------  */}
              <Menu.Item>
                <DialogModal2
                  title={
                    "Получение сведений о задолженностях (свыше 3000 рублей)"
                  }
                  textbutton={
                    "Запрос сведений о задолженностях из ФНС свыше 3000 рублей"
                  }
                  onClickText={"Создать"}
                  onClickClassName={
                    "text-sm text-gray-900 hover:text-meta-5 px-2 py-2"
                  }
                  children={
                    <>
                      <form action="#">
                        <div className="mb-5.5 grid grid-cols-8 gap-4">
                          <div className="col-span-8">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              ИНН
                            </label>
                            <NumberInput></NumberInput>
                          </div>

                          <div className="col-span-3">
                            <label
                              className="text-left block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Дата
                            </label>
                            <div className="">
                              <DateDefaultInput></DateDefaultInput>{" "}
                            </div>
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
              {/*-----------------------------------конец---------------------------------------------------  */}
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
