import SelectCustom from "../../../../components/UI/General/Inputs/Select";
//Поля ввода
import TextInput from "../../../../components/UI/General/Inputs/Input";

//Иконки
import IconButtonEdit from "../../../../components/UI/General/Buttons/IconButtonEdit";
import IconButtonWatch from "../../../../components/UI/General/Buttons/IconButtonWatch";
import IconButtonUpload from "../../../../components/UI/General/Buttons/IconButtonUpload";

const GeneralInformation = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-6">
          <form>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Вид заявки</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Переоформление лицензии
                    </label>
                    <div className="">
                      <SelectCustom placeholder={"Уточнение темы заявки"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Дата заявки</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col justify-between gap-5.5 sm:flex-row">
                  <div className="">11.22.2024</div>
                  <div className="">Крайняя дата исполнения: 11.22.2024 </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Номер регистрации</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col justify-between gap-5.5 sm:flex-row">
                  <div className="flex">
                    <TextInput
                      type={""}
                      value={""}
                      name={""}
                      id={""}
                      placeholder={""}
                      defaultvalue={""}
                    />
                  </div>
                  <div className="flex gap-5.5">
                    <TextInput
                      label={"Форма подачи:"}
                      type={""}
                      value={""}
                      name={""}
                      id={""}
                      placeholder={""}
                      defaultvalue={""}
                    />
                  </div>
                  <div className="flex gap-5.5">
                    <TextInput
                      label={"ЕНО:"}
                      type={""}
                      value={""}
                      name={""}
                      id={""}
                      placeholder={""}
                      defaultvalue={""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Отвественный специалист</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="">Косищева Любовь Олеговна</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Вид деятельности</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="">РПО</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">На основе лицензии</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="">1233123213123123</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Лицензиат</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="">Компания</div>
                  <IconButtonEdit />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">ИНН</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="">98379178312</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">КПП</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="">23940238</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Виды продукции</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <SelectCustom />
                  </div>
                  <IconButtonWatch />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Ограницение</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <TextInput
                      type={""}
                      value={""}
                      name={""}
                      id={""}
                      placeholder={""}
                      defaultvalue={""}
                    />
                  </div>
                  <IconButtonUpload />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Состояние</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <TextInput
                      type={""}
                      value={""}
                      name={""}
                      id={""}
                      placeholder={""}
                      defaultvalue={""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Коментарии</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <TextInput
                      type={""}
                      value={""}
                      name={""}
                      id={""}
                      placeholder={""}
                      defaultvalue={""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 md:mt-2 md:gap-6 2xl:mt-3 2xl:gap-7.5">
              <div className="col-span-4">Дата приема/передачи</div>
              <div className="col-span-8">
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full flex items-center gap-5.5">
                    <div>Передано в архив</div>
                    <div>Не указано</div>
                    <IconButtonEdit />
                  </div>
                </div>
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full flex items-center gap-5.5">
                    <div>Передано в архив</div>
                    <div>Не указано</div>
                    <IconButtonEdit />
                  </div>
                </div>
                <div className="w-full mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full flex items-center gap-5.5">
                    <div>Передано в архив</div>
                    <div>Не указано</div>
                    <IconButtonEdit />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-span-6">Таблица</div>
      </div>
    </>
  );
};

export default GeneralInformation;
