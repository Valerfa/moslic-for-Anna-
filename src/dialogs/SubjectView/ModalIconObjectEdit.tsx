import ModalHeader from "../../components/UI/General/Modal/ModalHeader";
import ModalBody from "../../components/UI/General/Modal/ModalBody";
import ModalFooter from "../../components/UI/General/Modal/ModalFooter";

import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import TextInput from "../../components/UI/General/Inputs/TextInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import IconButtonSearch from "../../components/UI/General/Buttons/IconButtonSearch";
import CheckboxQuarter from "../../components/UI/General/Inputs/CheckBoxQuarter";
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";

import IconButtonEdit from "../../components/UI/General/Buttons/IconButtonEdit";
import IconButtonX from "../../components/UI/General/Buttons/IconButtonX";
import IconButtonMap from "../../components/UI/General/Buttons/IconButtonMap";
import IconButtonHouse from "../../components/UI/General/Buttons/IconButtonHouse";
import ModalIconAddressEdit from "./ModalIconAddressEdit";
import { Link } from "react-router-dom";

export default function ModalSubjectEdit(props: {
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
        <IconButtonEdit />
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
                    {props.name} Объект лицензирование - редактирование
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
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Субъект
                        </label>
                        <TextInput></TextInput>
                      </div>
                      <div className="col-span-6">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Адрес местоположения
                        </label>
                        <div className="flex flex-row gap-1">
                          <div className="flex-auto">
                            <TextInput></TextInput>
                          </div>
                          <div className="self-end">
                            {/* ---------- Модальное окно "Редактирование адреса объекта" ---------- */}
                            <ModalIconAddressEdit />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6 flex gap-4 border border-stroke p-2 rounded-md">
                        <div className="w-1/2">
                          <label
                            className="text-left block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Наименование
                          </label>
                          <TextInput></TextInput>
                        </div>{" "}
                        <div className="w-1/2">
                          <label
                            className="text-left block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Тип
                          </label>
                          <SelectCustom />
                        </div>
                      </div>
                      <div className="col-span-6 border border-stroke p-2 rounded-md">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white mb-2"
                          htmlFor="emailAddress">
                          Координаты местоположения
                        </label>
                        <div className="grow flex gap-2">
                          <TextInput></TextInput> <TextInput></TextInput>{" "}
                          {/* ---------- Модальное окно "Координаты" ---------- */}
                          <DefaultIconModalWide
                            name={"Координаты"}
                            title={"Поиск координат по адресу"}
                            textbutton={""}
                            icon={<IconButtonSearch title={undefined} />}
                            children={undefined}
                            onClick={function (
                              event: React.MouseEvent<
                                HTMLButtonElement,
                                MouseEvent
                              >
                            ): void {
                              throw new Error("Function not implemented.");
                            }}
                            onClickText={"Сохранить"}
                            onClickClassName={""}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          КПП ОП
                        </label>
                        <TextInput></TextInput>
                      </div>
                      <div className="col-span-4">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Дата окончания договора аренды
                        </label>

                        <DateDefaultInput />
                      </div>
                      <div className="col-span-4">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Телефон
                        </label>
                        <NumberInput />
                      </div>
                      <div className="col-span-4">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Факс
                        </label>
                        <NumberInput />
                      </div>
                      <div className="col-span-4">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          E-mail
                        </label>
                        <TextInput />
                      </div>
                      <div className="col-span-4">
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Web
                        </label>
                        <TextInput />
                      </div>

                      <div className="col-span-12 flex">
                        <CheckboxQuarter />
                        <label
                          className="text-left block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Только обновление
                        </label>
                      </div>
                      <div className="col-span-12 border border-stroke rounded-md p-2">
                        {" "}
                        <label
                          className="text-left block text-sm mb-2 text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Кадастровые/условные номера
                        </label>
                        <div className="border border-stroke rounded-md p-2">
                          {" "}
                          * место для таблицы *<IconButtonEdit />
                          <IconButtonX />
                          <Link to="https://pkk.rosreestr.ru/?#/search/65.64951699999888,122.73014399999792/4/@5w3tqw5ca">
                            {" "}
                            <IconButtonMap
                              title={"Публичная кадастровая карта"}
                            />
                          </Link>
                          <Link to="https://lk.rosreestr.ru/eservices/real-estate-objects-online?">
                            <IconButtonHouse
                              title={"Личный кабинет Росреестра"}
                            />
                          </Link>
                        </div>
                        <div className="flex items-center mt-2">
                          <CheckboxQuarter />
                          <p className="text-black text-xs">Измененный</p>
                        </div>
                      </div>
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
