import {
  Dialog,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from "@headlessui/react";
import { Fragment, MouseEvent, ReactNode, useState } from "react";
import ButtonPrimary from "../../../../components/UI/General/Buttons/ButtonPrimary";
import ModalBody from "../../../../components/UI/General/Modal/ModalBody";
import ModalFooter from "../../../../components/UI/General/Modal/ModalFooter";
import ModalHeader from "../../../../components/UI/General/Modal/ModalHeader";
import IconButtonEdit from "../../../../components/UI/General/Buttons/IconButtonEdit";
import CheckboxDefault from "../../../../components/UI/General/Inputs/CheckboxDefault";
import DateDefaultInput from "../../../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../../../components/UI/General/Inputs/NumberInput";
import TextAreaInput from "../../../../components/UI/General/Inputs/TextAreaInput";
import TextInput from "../../../../components/UI/General/Inputs/TextInput";
import IconButtonWatch from "../../../../components/UI/General/Buttons/IconButtonWatch";
import DefaultModalNarrow from "../../../../components/UI/General/Modal/DefaultModalNarrow";
import SelectCustom from "../../../../components/UI/General/Inputs/Select";
import ButtonsSecondary from "../../../../components/UI/General/Buttons/ButtonsSecondary";
import ButtonGreen from "../../../../components/UI/General/Buttons/ButtonGreen";

export default function ModalIconEditDocument(props: {
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
        <IconButtonEdit title={"Посмотреть документ"} />
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
                <Dialog.Panel className="w-full max-w-150 rounded-lg bg-white dark:bg-boxdark">
                  <ModalHeader>
                    Просмотр документа
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
                    {" "}
                    <form action="#">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 flex flex-row gap-4">
                          <span className="text-black"> Тип документа:</span>
                          <span className=""> [Данные]</span>
                        </div>
                        <div className="col-span-8">
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
                              throw new Error("Function not implemented.");
                            }}
                          />
                        </div>
                        <div className="col-span-4">
                          <DateDefaultInput
                            label={"Дата документа"}
                            onChange={undefined}
                            selected={""}></DateDefaultInput>
                        </div>
                        <div className="col-span-8">
                          <TextInput
                            label={"Код ЦХЭД"}
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
                              throw new Error("Function not implemented.");
                            }}
                          />
                        </div>
                        <div className="col-span-4">
                          <DateDefaultInput
                            label={"Дата контроля/вступления в силу"}
                            onChange={undefined}
                            selected={""}></DateDefaultInput>
                        </div>

                        <div className="col-span-12">
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
                        <div className="col-span-5 border border-stroke rounded-md p-2 flex flex-col gap-4 text-left">
                          {" "}
                          <div className="flex flex-col">
                            <CheckboxDefault
                              label={"Оригинал"}
                              name={""}
                              id={""}
                              value={false}
                              onChange={undefined}
                            />
                            <CheckboxDefault
                              label={"Копия/эл. образ"}
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
                        <div className="col-span-12">
                          <TabGroup>
                            <TabList className="flex flex-row gap-4">
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Содежимое
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Исполнитель
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Даты уведомлений
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                                Подписание
                              </Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel className="text-black mt-4 text-sm mt-5.5">
                                <div className="flex flex-row gap-2">
                                  <span>Просмотр текста:</span>
                                  <DefaultModalNarrow
                                    title={"Формирование текста"}
                                    textbutton={"Загрузить"}
                                    children={
                                      <>
                                        <div className="flex flex-col gap-2">
                                          <div className="flex flex-row gap-2">
                                            <CheckboxDefault
                                              label={
                                                "Документ на основе шаблона"
                                              }
                                              name={""}
                                              id={""}
                                              value={false}
                                              onChange={undefined}
                                            />
                                            <CheckboxDefault
                                              label={"Текстовый документ"}
                                              name={""}
                                              id={""}
                                              value={false}
                                              onChange={undefined}
                                            />
                                          </div>
                                          <SelectCustom />
                                          <div className="flex-none">
                                            <ButtonsSecondary
                                              children={undefined}>
                                              Выбрать файл
                                            </ButtonsSecondary>
                                          </div>
                                        </div>
                                      </>
                                    }
                                    onClick={function (
                                      event: MouseEvent<
                                        HTMLButtonElement,
                                        MouseEvent
                                      >
                                    ): void {
                                      throw new Error(
                                        "Function not implemented."
                                      );
                                    }}
                                    onClickText={""}
                                    onClickClassName={""}
                                  />
                                  <span>Выгрузить</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                  <span>Просмотр образа:</span>
                                  <DefaultModalNarrow
                                    title={"Загрузка образа"}
                                    textbutton={"Загрузить"}
                                    children={
                                      <>
                                        <div className="flex flex-col gap-2">
                                          <div className="flex flex-row gap-2">
                                            <CheckboxDefault
                                              label={"Сформировать из текста"}
                                              name={""}
                                              id={""}
                                              value={false}
                                              onChange={undefined}
                                            />
                                            <CheckboxDefault
                                              label={"Загрузить"}
                                              name={""}
                                              id={""}
                                              value={false}
                                              onChange={undefined}
                                            />
                                          </div>
                                          <SelectCustom />
                                          <div className="flex-none">
                                            <ButtonsSecondary
                                              children={undefined}>
                                              Выбрать файл
                                            </ButtonsSecondary>
                                          </div>
                                        </div>
                                      </>
                                    }
                                    onClick={function (
                                      event: MouseEvent<
                                        HTMLButtonElement,
                                        MouseEvent
                                      >
                                    ): void {
                                      throw new Error(
                                        "Function not implemented."
                                      );
                                    }}
                                    onClickText={""}
                                    onClickClassName={""}
                                  />
                                  <span>Выгрузить</span>
                                </div>
                                <IconButtonWatch
                                  title={"Просмотр образа документа"}
                                />
                              </TabPanel>
                              <TabPanel className="text-black text-sm mt-4 text-left text-sm mt-5.5">
                                <div className="flex flex-col gap-2">
                                  <TextInput
                                    label={"ФИО"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}
                                  />
                                  <SelectCustom />
                                  <TextInput
                                    label={"Должность"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}
                                  />
                                  <div className="flex flex-row gap-2">
                                    <ButtonsSecondary>
                                      Стать исполнителем
                                    </ButtonsSecondary>
                                    <ButtonGreen>Сохранить</ButtonGreen>
                                  </div>
                                </div>
                              </TabPanel>
                              <TabPanel>
                                <div className="flex flex-row gap-2 text-sm mt-5.5">
                                  <div>
                                    <DateDefaultInput
                                      label={"По почте"}
                                      onChange={undefined}
                                      selected={""}
                                    />
                                  </div>
                                  <div>
                                    <DateDefaultInput
                                      label={"Через управу"}
                                      onChange={undefined}
                                      selected={""}
                                    />
                                  </div>
                                  <div>
                                    <DateDefaultInput
                                      label={"По e-mail"}
                                      onChange={undefined}
                                      selected={""}
                                    />
                                  </div>
                                </div>
                              </TabPanel>
                              <TabPanel>
                                <div className="text-sm flex flex-col gap-2 mt-5.5">
                                  <div className="flex flex-row gap-2">
                                    <span>Подписал:</span>
                                    <span className="text-black">[Данные]</span>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                    <span>Дата подписания:</span>
                                    <span className="text-black">[Дата]</span>
                                  </div>
                                </div>
                              </TabPanel>
                            </TabPanels>
                          </TabGroup>
                        </div>
                      </div>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <>
                      <ButtonPrimary id={"LIC_VIEW"} onClick={handeClick}>
                        {props.onClickText}
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
