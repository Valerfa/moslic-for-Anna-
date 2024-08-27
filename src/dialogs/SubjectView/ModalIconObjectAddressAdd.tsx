import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";
import IconButtonList from "../../components/UI/General/Buttons/IconButtonList";
import IconButtonPlus from "../../components/UI/General/Buttons/IconButtonPlus";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import CheckboxQuarter from "../../components/UI/General/Inputs/CheckBoxQuarter";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import TextAreaInput from "../../components/UI/General/Inputs/TextAreaInput";
import TextInput from "../../components/UI/General/Inputs/TextInput";
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";
import ModalBody from "../../components/UI/General/Modal/ModalBody";
import ModalFooter from "../../components/UI/General/Modal/ModalFooter";
import ModalHeader from "../../components/UI/General/Modal/ModalHeader";

export default function ModalIconObjectAddressAdd(props: {
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
        title={"Добавить адрес объекта"}
        className={
          props.onClickClassName !== null ||
          props.onClickClassName !== undefined
            ? props.onClickClassName
            : "rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary bg-primary text-white"
        }>
        <IconButtonPlus />
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
                    {props.name}Добавление адреса объекта
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
                      <div className="mb-5.5 grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                          {" "}
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Исходный адрес
                          </label>{" "}
                          <TextInput></TextInput>
                        </div>
                        <div className="col-span-12 flex flex-row gap-4">
                          <CheckboxDefault
                            label={"Адрес"}
                            name={""}
                            id={""}
                            value={false}
                            onChange={undefined}
                          />{" "}
                          <CheckboxDefault
                            label={"Внеадресный объект"}
                            name={""}
                            id={""}
                            value={false}
                            onChange={undefined}
                          />
                        </div>
                        <div className="col-span-6 border border-stroke rounded-md p-2">
                          {" "}
                          <TextInput
                            label={"Код ФИАС"}
                            type={""}
                            value={""}
                            name={""}
                            id={""}
                            placeholder={""}
                            defaultvalue={""}
                            onChange={undefined}
                            disable={false}></TextInput>
                          <p className="text-xs text-left text-black mt-2">
                            (улица)
                          </p>
                        </div>
                        <div className="col-span-6 border border-stroke rounded-md p-2">
                          {" "}
                          <SelectCustom
                            value={undefined}
                            options={undefined}
                            onChange={undefined}
                            label={"Адрес в ФИАС"}
                          />
                          <div className="flex items-center text-left mt-2">
                            <CheckboxQuarter />{" "}
                            <p className="text-xs text-black">
                              Адреса нет в ФИАС
                            </p>
                          </div>
                        </div>
                        <div className="col-span-6">
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
                        <div className="col-span-6">
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Город
                          </label>
                          <div className="w-full">
                            {" "}
                            <TextInput></TextInput>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Населенный пункт
                          </label>
                          <div className="w-full">
                            {" "}
                            <TextInput></TextInput>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Улица
                          </label>
                          <div className="w-full">
                            {" "}
                            <TextInput></TextInput>
                          </div>
                        </div>
                        <div className="col-span-3 border border-stroke rounded-md p-2">
                          {" "}
                          <SelectCustom
                            value={undefined}
                            options={undefined}
                            onChange={undefined}
                            label={"Здание"}
                          />
                          <div className="flex items-center text-left mt-2">
                            <CheckboxQuarter />{" "}
                            <p className="text-xs text-black">
                              Здания нет в ФИАС
                            </p>
                          </div>
                        </div>
                        <div className="col-span-3 border border-stroke p-4 rounded-md">
                          <div className="w-full">
                            {" "}
                            <SelectCustom />
                          </div>
                          <div className="w-full">
                            {" "}
                            <TextInput></TextInput>
                          </div>
                        </div>
                        <div className="col-span-3 self-center">
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Корпус
                          </label>
                          <TextInput />
                        </div>
                        <div className="col-span-3 border border-stroke p-4 rounded-md">
                          <div className="w-full">
                            {" "}
                            <SelectCustom />
                          </div>
                          <div className="w-full">
                            {" "}
                            <TextInput></TextInput>
                          </div>
                        </div>
                        <div className="col-span-8 border border-stroke p-4 rounded-md flex items-end gap-2">
                          <div className="w-3/4">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Индекс
                            </label>
                            <TextInput />
                          </div>
                          <div className="w-1/4">
                            {" "}
                            <ButtonsSecondary
                              children={undefined}
                              onClick={function (
                                event: MouseEvent<HTMLButtonElement, MouseEvent>
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                              id={undefined}>
                              <p className="text-xs">
                                {" "}
                                Определить индекс и ОКАТО
                              </p>
                            </ButtonsSecondary>
                          </div>
                        </div>
                        <div className="col-span-4 border border-stroke p-4 rounded-md flex items-end gap-2">
                          <div className="grow">
                            <label
                              className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                              htmlFor="emailAddress">
                              Окато
                            </label>
                            <TextInput />
                          </div>
                          <div className="">
                            {" "}
                            <DefaultIconModalWide
                              name={""}
                              title={""}
                              textbutton={""}
                              icon={<IconButtonList />}
                              children={<div className="">Контент</div>}
                              onClick={function (
                                event: MouseEvent<
                                  HTMLButtonElement,
                                  globalThis.MouseEvent
                                >
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                              onClickText={""}
                              onClickClassName={""}></DefaultIconModalWide>
                          </div>
                        </div>
                        <div className="col-span-12">
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Дополнение
                          </label>
                          <TextInput></TextInput>
                        </div>
                        <div className="col-span-4 border border-stroke rounded-md p-4">
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Указывать
                          </label>
                          <div className="flex flex-col gap-2">
                            {" "}
                            <div className="flex items-center text-left mt-2">
                              <CheckboxQuarter />{" "}
                              <p className="text-xs text-black">Страну</p>
                            </div>
                            <div className="flex items-center text-left mt-2">
                              <CheckboxQuarter />{" "}
                              <p className="text-xs text-black">
                                Почтовый индекс
                              </p>
                            </div>
                            <div className="flex items-center text-left mt-2">
                              <CheckboxQuarter />{" "}
                              <p className="text-xs text-black">Все запятые</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-8">
                          <label
                            className="text-left mb-2 block text-sm text-black font-medium dark:text-white"
                            htmlFor="emailAddress">
                            Полный адрес
                          </label>
                          <TextAreaInput></TextAreaInput>
                        </div>
                      </div>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <>
                      <ButtonPrimary id={"LIC_VIEW"} onClick={handeClick}>
                        {props.onClickText}Сохранить
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
