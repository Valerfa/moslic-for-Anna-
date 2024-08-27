import ModalHeader from "../../../components/UI/General/Modal/ModalHeader";
import ModalBody from "../../../components/UI/General/Modal/ModalBody";
import ModalFooter from "../../../components/UI/General/Modal/ModalFooter";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";

import ButtonPrimary from "../../../components/UI/General/Buttons/ButtonPrimary";
import TextInput from "../../../components/UI/General/Inputs/TextInput";
import IconButtonEdit from "../../../components/UI/General/Buttons/IconButtonEdit";
import IconButtonX from "../../../components/UI/General/Buttons/IconButtonX";
import DefaultModal from "../../../components/UI/General/Modal/DefaultModal";
import DefaultIconModalWide from "../../../components/UI/General/Modal/DefaultIconModalWide";

export default function ModalEditReport(props: {
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
        title={undefined}
        className={
          props.onClickClassName !== null ||
          props.onClickClassName !== undefined
            ? props.onClickClassName
            : "rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary bg-primary text-white"
        }>
        {props.icon}
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
                    {"Редактирование отчета"}
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
                    {props.children}
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                      <div className="w-1/2">
                        <TextInput
                          label={"Наименование"}
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
                      <div className="w-1/2">
                        <TextInput
                          label={"Описание"}
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
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                      <div className="w-1/3 grid grid-col gap-4">
                        <p className="text-sm text-graydark">Файл:</p>
                        <div className="text-sm text-primary">
                          ~/App_Data/Госпошлина за месяц.frx
                        </div>
                      </div>
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                      <IconButtonX />
                      {/*Модальное окно "Редактирование параметра"*/}
                      <DefaultIconModalWide
                        name={"Редактирование параметра"}
                        title={""}
                        textbutton={""}
                        icon={<IconButtonEdit />}
                        children={
                          <div>
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-1/2">
                                <TextInput
                                  label={"Наименование"}
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
                              <div className="w-1/2">
                                <TextInput
                                  label={"Тип"}
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
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-1/2">
                                <TextInput
                                  label={"Номер по порядку"}
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
                              <div className="w-1/2">
                                <TextInput
                                  label={"Значение по умолчанию"}
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
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-full">
                                <TextInput
                                  label={"Описание"}
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
                          </div>
                        }
                        onClick={function (
                          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ): void {
                          throw new Error("Function not implemented.");
                        }}
                        onClickText={"Сохранить"}
                        onClickClassName={""}></DefaultIconModalWide>
                      {/*Модальное окно "Добавление параметра"*/}
                      <ButtonPrimary>
                        <DefaultModal
                          title={"Добавление параметра"}
                          textbutton={"Добавить"}
                          children={undefined}
                          onClick={function (): void {
                            throw new Error("Function not implemented.");
                          }}
                          onClickText={"Сохранить"}
                          onClickClassName={""}>
                          {" "}
                          <div>
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-1/2">
                                <TextInput
                                  label={"Наименование"}
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
                              <div className="w-1/2">
                                <TextInput
                                  label={"Тип"}
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
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-1/2">
                                <TextInput
                                  label={"Номер по порядку"}
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
                              <div className="w-1/2">
                                <TextInput
                                  label={"Значение по умолчанию"}
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
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-full">
                                <TextInput
                                  label={"Описание"}
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
                          </div>
                        </DefaultModal>
                      </ButtonPrimary>
                    </div>
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
