import ModalHeader from "../../../../components/UI/General/Modal/ModalHeader";
import ModalBody from "../../../../components/UI/General/Modal/ModalBody";
import ModalFooter from "../../../../components/UI/General/Modal/ModalFooter";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, MouseEvent, ReactNode, useState } from "react";

import ButtonPrimary from "../../../../components/UI/General/Buttons/ButtonPrimary";
import CheckboxDefault from "../../../../components/UI/General/Inputs/CheckboxDefault";
import DateDefaultInput from "../../../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../../../components/UI/General/Inputs/NumberInput";
import IconButtonEdit from "../../../../components/UI/General/Buttons/IconButtonEdit";
import IconButtonX from "../../../../components/UI/General/Buttons/IconButtonX";
import DefaultModalNarrow from "../../../../components/UI/General/Modal/DefaultModalNarrow";

export default function ModalPaymentList(props: {
  title: string;
  textbutton: string;
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
        type="button"
        onClick={openModal}
        className={
          props.onClickClassName !== null ||
          props.onClickClassName !== undefined
            ? props.onClickClassName
            : "rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary bg-primary text-white"
        }>
        {props.textbutton} Список привязанных платежей
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
                    {props.title}
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
                    {props.children}{" "}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 flex flex-row gap-4">
                        {/* ---------- Модальное окно "Добавление платежа" ---------- */}
                        <ButtonPrimary
                          children={
                            <DefaultModalNarrow
                              title={"Добавление платежа"}
                              textbutton={"Добавить"}
                              children={
                                <>
                                  {" "}
                                  <div className="grid grid-cols-8 gap-4">
                                    <div className="col-span-3">
                                      <NumberInput
                                        label={"Номер"}
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
                                          throw new Error(
                                            "Function not implemented."
                                          );
                                        }}
                                      />
                                    </div>

                                    <div className="col-span-3">
                                      <DateDefaultInput
                                        label={"Дата"}
                                        onChange={undefined}
                                        selected={""}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      {" "}
                                      <NumberInput
                                        label={"Сумма платежа"}
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
                                          throw new Error(
                                            "Function not implemented."
                                          );
                                        }}
                                      />
                                    </div>

                                    <div className="col-span-4">
                                      {" "}
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
                                          throw new Error(
                                            "Function not implemented."
                                          );
                                        }}
                                      />
                                    </div>

                                    <div className="col-span-4">
                                      {" "}
                                      <NumberInput
                                        label={"КПП"}
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
                                          throw new Error(
                                            "Function not implemented."
                                          );
                                        }}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      {" "}
                                      <NumberInput
                                        label={"Сумма привязки"}
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
                                          throw new Error(
                                            "Function not implemented."
                                          );
                                        }}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      {" "}
                                      <NumberInput
                                        label={"Кол-во страниц"}
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
                                          throw new Error(
                                            "Function not implemented."
                                          );
                                        }}
                                      />
                                    </div>
                                    <div className="col-span-3 flex flex-col border border-stroke p-2 rounded-md">
                                      <label className="text-left text-black mb-2">
                                        Тип документа
                                      </label>
                                      <CheckboxDefault
                                        label={"Оригинал"}
                                        name={""}
                                        id={""}
                                        value={false}
                                        onChange={undefined}></CheckboxDefault>
                                      <CheckboxDefault
                                        label={"Копия/эл. образец"}
                                        name={""}
                                        id={""}
                                        value={false}
                                        onChange={undefined}></CheckboxDefault>
                                      <CheckboxDefault
                                        label={"Заверенная копия"}
                                        name={""}
                                        id={""}
                                        value={false}
                                        onChange={undefined}></CheckboxDefault>
                                    </div>
                                  </div>
                                </>
                              }
                              onClick={function (
                                event: MouseEvent<
                                  HTMLButtonElement,
                                  globalThis.MouseEvent
                                >
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                              onClickText={"Сохранить"}
                              onClickClassName={""}></DefaultModalNarrow>
                          }
                          onClick={function (
                            event: MouseEvent<
                              HTMLButtonElement,
                              globalThis.MouseEvent
                            >
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          id={undefined}></ButtonPrimary>{" "}
                        <IconButtonEdit title={"Редактировать строку"} />{" "}
                        <IconButtonX />{" "}
                      </div>
                      <div className="col-span-12 flex flex-row gap-4">
                        {" "}
                        <div className="w-full border border-stroke rounded-md p-2">
                          {" "}
                          * место для таблицы *
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <>
                      <ButtonPrimary id={"LIC_VIEW"} onClick={handeClick}>
                        Сохранить
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
