import ModalHeader from "../../../../components/UI/General/Modal/ModalHeader";
import ModalBody from "../../../../components/UI/General/Modal/ModalBody";
import ModalFooter from "../../../../components/UI/General/Modal/ModalFooter";

import {
  Dialog,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";

import ButtonPrimary from "../../../../components/UI/General/Buttons/ButtonPrimary";
import IconButtonWatch from "../../../../components/UI/General/Buttons/IconButtonWatch";
import TextInput from "../../../../components/UI/General/Inputs/TextInput";
import DefaultIconModalWide from "../../../../components/UI/General/Modal/DefaultIconModalWide";
import CheckboxDefault from "../../../../components/UI/General/Inputs/CheckboxDefault";
import TextAreaInput from "../../../../components/UI/General/Inputs/TextAreaInput";
import DateDefaultInput from "../../../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../../../components/UI/General/Inputs/NumberInput";
import IconButtonEdit from "../../../../components/UI/General/Buttons/IconButtonEdit";
import SelectCustom from "../../../../components/UI/General/Inputs/Select";

export default function ModalOperationProcess(props: {
  name: string;
  title: string;
  textbutton: string;
  icon: ReactNode;
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onClickText: string;
  onClickClassName: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handeClick = async () => {
    const result = await props.onClick();
    console.log(result);
    if (result) closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        title={props.title}
        className={
          props.onClickClassName !== null ||
          props.onClickClassName !== undefined
            ? props.onClickClassName
            : "rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary bg-primary text-white"
        }>
        {props.icon}
        <IconButtonWatch />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <div
            className="fixed top-0 left-0 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
            aria-hidden="true"
          />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-230 rounded-lg bg-white dark:bg-boxdark">
                  <ModalHeader>
                    Операция над процессом
                    <button
                      type="button"
                      className="text-gray-400 bg-gray dark:bg-white/10 hover:bg-warning hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="default-modal"
                      onClick={closeModal}>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14">
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Закрыть окно</span>
                    </button>
                  </ModalHeader>
                  <ModalBody>
                    <>
                      <div className="flex flex-col pb-4 text-sm">
                        <div className="flex flex-row gap-2">
                          <span>Операция:</span>
                          <span className="text-black">[Данные]</span>
                        </div>
                        <div className="flex flex-row gap-2">
                          <span>Состояние:</span>
                          <span className="text-black">[Данные]</span>
                        </div>
                        <div className="flex flex-row gap-2">
                          <span>Оператор:</span>
                          <span className="text-black">[Данные]</span>
                        </div>
                        <div className="flex flex-row gap-2">
                          <span>Дата:</span>
                          <span className="text-black">[Дата]</span>
                        </div>
                      </div>

                      <TabGroup>
                        <TabList className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
                          <div className="flex justify-between w-full">
                            <div className="flex flex-wrap gap-3">
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Основания
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Комментарий
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Документы
                              </Tab>
                            </div>
                          </div>
                        </TabList>
                        <TabPanels className="leading-relaxed block">
                          <TabPanel></TabPanel>
                          <TabPanel></TabPanel>
                          <TabPanel>
                            {/* --------- Моадльное окно "Опись передаваемых документов" --------- */}
                            <DefaultIconModalWide
                              name={"Опись передаваемых документов"}
                              title={"Опись"}
                              textbutton={""}
                              icon={<IconButtonWatch />}
                              children={
                                <>
                                  {" "}
                                  <div className="flex flex-col pb-4 text-sm">
                                    <div className="flex flex-row gap-2">
                                      <span>Отправитель:</span>
                                      <span className="text-black">
                                        [Данные]
                                      </span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                      <span>Из подразделения:</span>
                                      <span className="text-black">
                                        [Данные]
                                      </span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                      <span>Получатель:</span>
                                      <span className="text-black">
                                        [Данные]
                                      </span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                      <span>В подразделение:</span>
                                      <span className="text-black">
                                        [Данные]
                                      </span>
                                    </div>

                                    <div className="flex flex-row gap-2">
                                      <span>Отправлено:</span>
                                      <span className="text-black">[Дата]</span>
                                      <span>Получено:</span>
                                      <span className="text-black">
                                        [Данные]
                                      </span>
                                    </div>
                                  </div>
                                  <DefaultIconModalWide
                                    name={"Редактирование документа"}
                                    title={"Редактирование документа"}
                                    textbutton={""}
                                    icon={<IconButtonEdit />}
                                    children={
                                      <>
                                        <form action="#">
                                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                            <div className="w-full flex flex-row gap-4">
                                              <a className="text-black">
                                                {" "}
                                                Тип документа:
                                              </a>
                                              Заявление о выдачи лицензии
                                            </div>
                                          </div>
                                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                            <div className="w-full sm:w-1/3">
                                              <NumberInput
                                                label={"Номер документа"}
                                                placeholder={"Не заполнено"}
                                                name={""}
                                                id={""}
                                                value={""}
                                                onChange={function (
                                                  event: React.MouseEvent<
                                                    HTMLButtonElement,
                                                    MouseEvent
                                                  >
                                                ): void {
                                                  throw new Error(
                                                    "Function not implemented."
                                                  );
                                                }}
                                              />
                                            </div>
                                            <div className="w-full sm:w-1/3">
                                              <DateDefaultInput
                                                label={
                                                  "Дата документа"
                                                }></DateDefaultInput>
                                            </div>
                                            <div className="w-full sm:w-1/3">
                                              <div className="grid grid-col gap-4">
                                                <p className="text-black">
                                                  Всего листов
                                                </p>
                                                <SelectCustom></SelectCustom>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                            <div className="w-2/3">
                                              <TextAreaInput
                                                label={"Комментарий"}
                                                type={"text"}
                                                placeholder={"Не заполнено"}
                                                value={""}
                                                name={""}
                                                id={""}
                                                defaultvalue={""}
                                                disable={false}
                                              />
                                            </div>
                                            <div className="w-1/3 grid grid-col">
                                              {" "}
                                              <CheckboxDefault
                                                label={"Оригинал"}
                                                name={""}
                                                id={""}
                                                value={false}
                                                onChange={
                                                  undefined
                                                }></CheckboxDefault>
                                              <CheckboxDefault
                                                label={"Копия/эл.образ"}
                                                name={""}
                                                id={""}
                                                value={false}
                                                onChange={
                                                  undefined
                                                }></CheckboxDefault>
                                              <CheckboxDefault
                                                label={"Заверенная копия"}
                                                name={""}
                                                id={""}
                                                value={false}
                                                onChange={
                                                  undefined
                                                }></CheckboxDefault>
                                            </div>
                                          </div>
                                        </form>

                                        <TabGroup>
                                          <TabList className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
                                            <div className="flex justify-between w-full">
                                              <div className="flex flex-wrap gap-3">
                                                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                                  Содержимое
                                                </Tab>
                                                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                                  Исполнитель
                                                </Tab>
                                              </div>
                                            </div>
                                          </TabList>
                                          <TabPanels className="leading-relaxed block">
                                            <TabPanel>
                                              <div className="flex flex-row gap-4">
                                                <p className="text-md text-black font-medium">
                                                  Просмотр образа:
                                                </p>
                                                <div className="flex flex-row">
                                                  <button className="text-md hover:text-primary font-medium">
                                                    Загрузить
                                                  </button>
                                                  <p className="text-md px-1">
                                                    /
                                                  </p>

                                                  <button className="text-md hover:text-primary font-medium">
                                                    Выгрузить
                                                  </button>
                                                </div>
                                              </div>
                                            </TabPanel>
                                            <TabPanel>
                                              <div className="grid justify-items-stretch gap-4">
                                                <div className="flex flex-row gap-4">
                                                  <div className="w-1/2">
                                                    <TextInput
                                                      label={"ФИО"}
                                                      type={"text"}
                                                      placeholder={
                                                        "Не заполнено"
                                                      }
                                                      value={""}
                                                      name={""}
                                                      id={""}
                                                      defaultvalue={""}
                                                      onChange={undefined}
                                                      disable={false}
                                                    />
                                                  </div>
                                                  <div className="w-1/2">
                                                    <TextInput
                                                      label={"Должность"}
                                                      type={"text"}
                                                      placeholder={
                                                        "Не заполнено"
                                                      }
                                                      value={""}
                                                      name={""}
                                                      id={""}
                                                      defaultvalue={""}
                                                      onChange={undefined}
                                                      disable={false}
                                                    />
                                                  </div>
                                                </div>
                                                <button
                                                  type="button"
                                                  className="justify-self-end text-white bg-meta-3 hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                                  {" "}
                                                  Стать исполнителем
                                                </button>
                                              </div>
                                            </TabPanel>
                                          </TabPanels>
                                        </TabGroup>
                                      </>
                                    }
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
                                    onClickText={"Сохранить"}
                                    onClickClassName={
                                      ""
                                    }></DefaultIconModalWide>
                                </>
                              }
                              onClick={function (
                                event: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                              onClickText={"Закрыть"}
                              onClickClassName={""}></DefaultIconModalWide>
                          </TabPanel>
                        </TabPanels>
                      </TabGroup>
                    </>{" "}
                  </ModalBody>
                  <ModalFooter>
                    <>
                      <ButtonPrimary id={"LIC_VIEW"} onClick={handeClick}>
                        Закрыть
                      </ButtonPrimary>
                    </>
                  </ModalFooter>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
