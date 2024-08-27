import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import { Tab } from "@headlessui/react";
import TextAreaInput from "../../components/UI/General/Inputs/TextAreaInput.tsx";
import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import AsyncSelectCustom from "../../components/UI/General/Inputs/AsyncSelect";
import EmailInput from "../../components/UI/General/Inputs/EmailInput";

//Модальное окно
import IconButtonTrash from "../../components/UI/General/Buttons/IconButtonTrash.tsx";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import ModalSvg from "../6.Admin/AdminModal2";
import IconButtonEdit from "../../components/UI/General/Buttons/IconButtonEdit.tsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

registerLocale("ru", ru);

export default function CellRender(params, onEditClick, onDeleteClick) {
  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [createTitle, setCreateTitle] = useState("");
  const [createKpp, setCreateKpp] = useState("");
  const [createUNOM, setCreateUNOM] = useState("");

  const [createRegion, setCreateRegion] = useState({
    value: 77,
    name: "77 г. Москва",
  });
  const [createRIAS, setCreateRIAS] = useState("");
  const [createIndex, setCreateIndex] = useState("");
  const [createAddressUr, setCreateAddressUr] = useState("");
  const [createAddressUrAdd, setCreateAddressUrAdd] = useState("");
  const [createAddressUrFull, setCreateAddressUrFull] = useState("");
  const [createOKATO, setCreateOKATO] = useState("");

  const [createEmail, setCreateEmail] = useState("");
  const [createStatus, setCreateStatus] = useState("");
  const [createContacts, setCreateContacts] = useState("");
  const [createProd, setCreateProd] = useState([]);
  const [createDate, setCreateDate] = useState(null);

  const setProdTypes = (value) => {
    if (createProd.includes(value)) {
      const new_data = [];
      for (let kind of createProd) {
        if (kind !== value) {
          new_data.push(kind);
        }
      }
      setCreateProd(new_data);
    } else {
      const new_data = createProd.map((kind) => {
        return kind;
      });
      new_data.push(value);
      setCreateProd(new_data);
    }
  };

  const changeRegion = (e) => {
    setCreateRegion(e);
    setCreateAddressUr(null);
    setCreateOKATO("");
    setCreateAddressUrFull("");
    setCreateAddressUrAdd("");
    setCreateIndex("");
    setCreateRIAS("");
  };

  const fillAddress = (e) => {
    if (e === null) {
      return;
    }
    setCreateAddressUr(e);
    setCreateOKATO(e.data.okato === null ? "" : e.data.okato.slice(0, 8));
    setCreateAddressUrFull(e.value);
    setCreateAddressUrAdd("");
    setCreateIndex(e.data.postal_code);
    setCreateRIAS(e.data.fias_id);
  };

  const fillAddressAdd = (e) => {
    setCreateAddressUrAdd(e);
    if (e === "") {
      setCreateAddressUrFull(createAddressUr.value);
    } else {
      setCreateAddressUrFull(createAddressUr.value + ", " + e);
    }
  };

  const openCreateModal = () => {
    setCreateInn("");
    setCanCreate(false);
  };

  const loadAddress = async (e) => {
    try {
      const result = await axios.post(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`,
        {
          query: e,
          count: 5,
          division: "",
          locations:
            createRegion === null
              ? undefined
              : [{ kladr_id: `${createRegion.value}00000000000` }],
          locations_boost:
            createRegion === null
              ? undefined
              : [{ kladr_id: `${createRegion.value}00000000000` }],
          restrict_value: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token b9cebb58e057318df4b84158a2e7323eb1c67e8d`,
          },
        }
      );
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      let data = [];
      for (let i of result.data.suggestions) {
        i.name = i.value;
        data.push(i);
      }
      return data;
    } catch (e) {
      console.log(e);
      setError(e);
    }
    return [];
  };

  useEffect(() => {
    console.log(params);
    if (params.data) {
      setCreateTitle(params.data.full_object_name);
      setCreateKpp(params.data.kpp);
      setCreateEmail(params.data.email === null ? '' : params.data.email);
      setCreateContacts(params.data.contacts);
      if (params.data.productgroupmask !== null) {
        let prod_types = params.data.productgroupmask;
        let new_types = [];
        if (prod_types - 4 >= 0) {
          new_types.push(4);
          prod_types = prod_types - 4;
        }
        if (prod_types - 2 >= 0) {
          new_types.push(2);
          prod_types = prod_types - 2;
        }
        if (prod_types - 1 >= 0) {
          new_types.push(1);
          prod_types = prod_types - 1;
        }
        setCreateProd(new_types);
      }

      setCreateAddressUrFull(params.data.full_address);
      setCreateAddressUrAdd(params.data.address_addition);
      setCreateOKATO(params.data.okato);
      setCreateRIAS(params.data.fias);
      setCreateIndex(params.data.postindex);
      setCreateUNOM(params.data.unom);
      setCreateDate(new Date(params.data.create_date));
    }
  }, [params]);

  if (params.data === null || params.data === undefined) return <div></div>;
  return (
    <div className="mb-5.5 flex gap-2 p-2">
      <IconButtonTrash
          onClick={() => onDeleteClick(params.data.id)}
          title={"Удалить"}
      />
      <ModalSvg
        title={"Редактирование объекта"}
        svgButton={
          <IconButtonEdit />
        }
        onClickText={"Сохранить"}
        onClickClassName={
          "-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
        }
        children={
          <>
            <Tab.Group>
              <Tab.List className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
                <div className="flex justify-between w-full">
                  <div className="flex flex-wrap gap-3">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                          " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                          selected
                            ? "bg-primary text-white "
                            : "bg-gray text-black dark:bg-meta-4 dark:text-white"
                        )
                      }>
                      Общая информация
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                          " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                          selected
                            ? "bg-primary text-white "
                            : "bg-gray text-black dark:bg-meta-4 dark:text-white"
                        )
                      }>
                      Местоположение
                    </Tab>
                  </div>
                </div>
              </Tab.List>
              <Tab.Panels className="leading-relaxed block">
                <Tab.Panel>
                  <form action="#">
                    <div className="mb-5.5 flex flex-row gap-5.5 text-left">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          Наименование
                        </label>
                        <div className="relative">
                          <TextInput
                            type={"text"}
                            value={createTitle}
                            name={"createTitle"}
                            id={"createTitle"}
                            placeholder={"Не заполнено"}
                            onChange={(e) => setCreateTitle(e)}
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <NumberInput
                          label={"КПП"}
                          value={createKpp}
                          name={"createKpp"}
                          id={"createKpp"}
                          placeholder={"Не заполнено"}
                          onChange={(e) => setCreateKpp(e)}
                        />
                      </div>
                    </div>
                    <div className="mb-5.5 flex flex-row gap-5.5 text-left">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          Адрес электронной почты
                        </label>
                        <div className="relative">
                          <EmailInput
                            type={"email"}
                            value={createEmail}
                            name={"createEmail"}
                            id={"createEmail"}
                            placeholder={"Не заполнено"}
                            onChange={(e) => setCreateEmail(e)}
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          Контактное лицо
                        </label>
                        <div className="relative">
                          <TextInput
                            type={"text"}
                            value={createContacts}
                            name={"createContacts"}
                            id={"createContacts"}
                            placeholder={"Не заполнено"}
                            onChange={(e) => setCreateContacts(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-5.5 flex flex-row gap-5.5 text-left">
                      <div className="w-full sm:w-1/2">
                        <DateDefaultInput
                          label={"Дата внесения в реестр"}
                          selected={createDate}
                          placeholder={"dd.MM.yyyy"}
                          onChange={(date) =>
                            setCreateDate(date)
                          }></DateDefaultInput>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          Виды продукции
                        </label>
                        <div className="relative">
                          <CheckboxDefault
                            label={"Алкоголь"}
                            name={"createValid_null"}
                            id={"createValid_null"}
                            value={createProd.includes(1)}
                            onChange={() => setProdTypes(1)}></CheckboxDefault>
                          <CheckboxDefault
                            label={"Спитосодержащая не пищевая продукция"}
                            name={"createValid_1"}
                            id={"createValid_1"}
                            value={createProd.includes(2)}
                            onChange={() => setProdTypes(2)}></CheckboxDefault>
                          <CheckboxDefault
                            label={"Пиво и пивная продукция"}
                            name={"createValid_0"}
                            id={"createValid_0"}
                            value={createProd.includes(4)}
                            onChange={() => setProdTypes(4)}></CheckboxDefault>
                        </div>
                      </div>
                    </div>
                  </form>
                </Tab.Panel>
                <Tab.Panel>
                  <form action="#">
                    <div className="mb-5.5 flex flex-col gap-5.5 text-left">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          Адрес
                        </label>
                        <div className="relative z-40">
                          <AsyncSelectCustom
                            value={createAddressUr}
                            placeholder={"Не заполнено"}
                            onChange={(e) => fillAddress(e)}
                            queryChange={loadAddress}
                            placeholder={"Введите Адрес"}
                            prepareRawInput={null}
                            displayField={"value"}
                            filterLimit={-1}
                          />
                        </div>
                      </div>{" "}
                    </div>
                    <div className="text-left mb-5.5 flex flex-row gap-5.5">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          Регион
                        </label>
                        <div className="relative">
                          <TextInput
                            type={"text"}
                            value={createRegion.name}
                            name={"createRegion"}
                            id={"createRegion"}
                            placeholder={"Не заполнено"}
                            disabled={true}
                          />
                        </div>
                      </div>{" "}
                    </div>
                    <div className="text-left mb-5.5 flex flex-row gap-5.5">
                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          Почтовый индекс
                        </label>
                        <div className="relative">
                          <TextInput
                            type={"text"}
                            value={createIndex}
                            name={"createIndex"}
                            id={"createIndex"}
                            placeholder={"Не заполнено"}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          ОКАТО
                        </label>
                        <div className="relative">
                          <TextInput
                            type={"text"}
                            value={createOKATO}
                            name={"createOKATO"}
                            id={"createOKATO"}
                            placeholder={"Не заполнено"}
                            disabled={true}
                            className="!bg-primary"
                          />
                        </div>
                      </div>

                      {/*
                                        <div className="w-full">
                                            <label
                                             className="mb-3 block text-sm font-medium text-black dark:text-white"
                                             htmlFor="emailAddress">
                                              УНОМ
                                            </label>
                                            <div className="relative">
                                              <TextInput
                                                type={"text"}
                                                value={createUNOM}
                                                name={"createUNOM"}
                                                id={"createUNOM"}
                                                placeholder={"Не заполнено"}
                                                onChange={(e) => setCreateUNOM(e)}
                                              />
                                            </div>
                                        </div>
                                        */}

                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress">
                          ФИАС
                        </label>
                        <div className="relative">
                          <TextInput
                            type={"text"}
                            value={createRIAS}
                            name={"createRIAS"}
                            id={"createRIAS"}
                            placeholder={"Не заполнено"}
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 w-full text-left">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress">
                        Дополнение к адресу
                      </label>
                      <div className="relative">
                        <TextInput
                          type={"text"}
                          value={createAddressUrAdd}
                          name={"createAddressUrAdd"}
                          id={"createAddressUrAdd"}
                          placeholder={"Не заполнено"}
                          onChange={(e) => fillAddressAdd(e)}
                        />
                      </div>
                    </div>
                    <div className="mb-5.5 w-full text-left">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress">
                        Полный адрес
                      </label>
                      <div className="relative">
                        <TextAreaInput
                          type={"text"}
                          value={createAddressUrFull}
                          name={"createAddress"}
                          id={"createAddress"}
                          placeholder={"Не заполнено"}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </form>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </>
        }
        onClick={() =>
          onEditClick(
            params.data.id,
            createKpp,
            createTitle,
            createAddressUrFull,
            setCreateAddressUrAdd,
            createIndex,
            createOKATO,
            createUNOM,
            createRIAS,
            createEmail,
            createStatus,
            createContacts,
            createProd,
            createDate
          )
        }></ModalSvg>
    </div>
  );
}
