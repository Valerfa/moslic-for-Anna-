import React, { useEffect, useRef, useState, createRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput.tsx";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import AsyncSelectCustom from "../../components/UI/General/Inputs/AsyncSelect";
import PhoneInput from "../../components/UI/General/Inputs/PhoneInput";
import EmailInput from "../../components/UI/General/Inputs/EmailInput";
import TextInput from "../../components/UI/General/Inputs/TextInput";
import TextAreaInput from "../../components/UI/General/Inputs/TextAreaInput.tsx";

import { variables, showDate, AG_GRID_LOCALE_RU } from "../../variables";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import CellRender from "./SubjectCellRender.tsx";

//Модальное окно
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";
import ModalSvg from "../6.Admin/AdminModal2";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";
import IconButtonEdit from "../../components/UI/General/Buttons/IconButtonEdit.tsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const filter_use = false;

const DetailSubject = (props) => {
  const gridRef = useRef<AgGridReact>(null);
  const fileInput = createRef();

  const location = useLocation();
  const paramsURL = new URLSearchParams(location.search);
  const [is_open_filters, setFilters] = useState(true);

  const current_date = new Date();
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [data, setData] = useState([]);
  const [subject, setSubject] = useState(null);
  const [regions, setRegions] = useState([]);
  const [dataCount, setCount] = useState(0);
  const [prodTypesDict] = useState({
    1: "Алкоголь",
    2: "Спиртосодержащая непищевая продукция",
    4: "Пиво и пивная продукция",
  });
  const [risks, setRisks] = useState([]);
  const [businessTypes, setBusTypes] = useState([]);
  const [innTypes] = useState([
    { value: 10, name: "ЮЛ" },
    { value: 12, name: "ФЛ" },
  ]);
  const [innTypesDict] = useState({
    10: "ЮЛ",
    12: "ФЛ",
  });
  const [typeMethods] = useState([
    { value: -1, name: "Не важно" },
    { value: 0, name: "Вручную" },
    { value: 1, name: "Импорт из файла" },
    { value: 2, name: "Импорт из СИОПР" },
    { value: 3, name: "Импорт из подготовленного набора" },
  ]);
  const [methodsTypesDict] = useState({
    0: "Вручную",
    1: "Импорт из файла",
    2: "Импорт из СИОПР",
    3: "Импорт из подготовленного набора",
  });
  // data columns
  const [dataColumns] = useState([
    {
      enableValue: true,
      field: "operations",
      headerName: "Операции",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        return CellRender(params, onEditClick, onDeleteClick);
      },
    },
    {
      enableValue: true,
      field: "full_object_name",
      headerName: "Название",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "productgroupmask",
      headerName: "Виды продукции",
      resizable: true,
      sortable: false,
      wrapText: false,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        switch (params.getValue()) {
          case 0:
            return <div></div>;
          case 1:
            return <div>{prodTypesDict[1]}</div>;
          case 2:
            return <div>{prodTypesDict[2]}</div>;
          case 4:
            return <div>{prodTypesDict[4]}</div>;
          case 3:
            return (
              <div>
                {prodTypesDict[1]}
                <br />
                {prodTypesDict[2]}
              </div>
            );
          case 5:
            return (
              <div>
                {prodTypesDict[1]}
                <br />
                {prodTypesDict[4]}
              </div>
            );
          case 6:
            return (
              <div>
                {prodTypesDict[2]}
                <br />
                {prodTypesDict[4]}
              </div>
            );
          case 7:
            return (
              <div>
                {prodTypesDict[1]}
                <br />
                {prodTypesDict[2]}
                <br />
                {prodTypesDict[4]}
              </div>
            );
        }
        return <div>Другое</div>;
      },
    },
    {
      enableValue: true,
      field: "full_address",
      headerName: "Местоположение",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "contacts",
      headerName: "Контакты",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "email",
      headerName: "Адрес эл. почты",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "create_date",
      headerName: "Дата внесения в реестр",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "inspect_date",
      headerName: "Дата изменений",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
  ]);

  //subject
  const [createTitleS, setCreateTitleS] = useState("");
  const [createTitleBriefS, setCreateTitleBriefS] = useState("");
  const [createInnS, setCreateInnS] = useState("");
  const [createKppS, setCreateKppS] = useState("");
  const [createOgrnS, setCreateOgrnS] = useState("");
  const [createRegionS, setCreateRegionS] = useState(null);

  const [createRIASS, setCreateRIASS] = useState("");
  const [createIndexS, setCreateIndexS] = useState("");
  const [createAddressUrS, setCreateAddressUrS] = useState("");
  const [createAddressUrAddS, setCreateAddressUrAddS] = useState("");
  const [createAddressUrFullS, setCreateAddressUrFullS] = useState("");
  const [createOKATOS, setCreateOKATOS] = useState("");

  const [createEmailS, setCreateEmailS] = useState("");
  const [createPhoneS, setCreatePhoneS] = useState("");
  const [createLastS, setCreateLastS] = useState("");
  const [createFirstS, setCreateFirstS] = useState("");
  const [createDadS, setCreateDadS] = useState("");
  const [createStatusS, setCreateStatusS] = useState("");
  const [createContactsS, setCreateContactsS] = useState("");
  const [createRiskS, setCreateRiskS] = useState(null);
  const [createCatS, setCreateCatS] = useState(null);
  const [createValidS, setCreateValidS] = useState(0);

  // object
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
  const [createDate, setCreateDate] = useState("");

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

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const getFirstData = async () => {
    const regs = await getRegions();
    const subject_id = paramsURL.get("id");
    await getDetail(subject_id);
    await onSearchClick(subject_id, regs);
  };

  useEffect(() => {
    getRisks();
    getBusinessTypes();
    getFirstData();
  }, []);

  const getRegions = async () => {
    try {
      const result = await axios.get(variables.SUB_API_URL + `/regions`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setRegions(
        result.data.map((i) => ({ value: i.region_code, name: i.region_name }))
      );
      return result.data.map((i) => ({
        value: i.region_code,
        name: i.region_name,
      }));
    } catch (e) {
      console.log(e);
      setError(e);
      return [];
    }
  };

  const getRisks = async () => {
    try {
      const result = await axios.get(
        variables.SUB_API_URL + `/risk-categories`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setRisks(
        result.data.map((i) => ({
          value: i.id_riskcategory,
          name: i.riskcategoryname,
        }))
      );
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getBusinessTypes = async () => {
    try {
      const result = await axios.get(
        variables.SUB_API_URL + `/small-business-types`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setBusTypes(
        result.data.map((i) => ({
          value: i.id_smallbusinesstype,
          name: i.smallbusinesstypename,
        }))
      );
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getDetail = async (subject_id) => {
    let data = [];
    setLoad(true);
    try {
      const result = await axios.get(
        variables.SUB_API_URL + `/subjects/${subject_id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      console.log(result.data);
      setSubject(result.data);
      if (result.data !== null) {
        setCreateTitleS(result.data.full_subject_name);
        setCreateTitleBriefS(result.data.brief_subject_name);
        setCreateInnS(result.data.inn);
        setCreateKppS(result.data.kpp);
        setCreateOgrnS(result.data.ogrn);
        setCreateRegionS({
          value: result.data.region_code,
          name: result.data.region_code,
        });
        setCreateAddressUrFullS(result.data.full_address_ur);
        setCreateAddressUrAddS(result.data.address_ur_addition);
        setCreateOKATOS(result.data.okato);
        setCreateEmailS(result.data.email === null ? "" : result.data.email);
        setCreatePhoneS(result.data.tel === null ? "" : result.data.tel);
        setCreateLastS(result.data.boss_lastname);
        setCreateFirstS(result.data.boss_firstname);
        setCreateDadS(result.data.boss_patronymic);
        setCreateStatusS(result.data.boss_postname);
        setCreateContactsS(result.data.contacts);
        setCreateRiskS({
          value: Number(result.data.riskcategory),
          name: result.data.riskcategoryname,
        });
        setCreateCatS({
          value: Number(result.data.id_smallbusinesstype),
          name: result.data.smallbusinesstypename,
        });
        setCreateRIASS(result.data.fias);
        setCreateIndexS(result.data.postindex);
      }
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
    return data;
  };

  const onSearchClick = async (subject_id, regs) => {
    setLoad(true);

    try {
      const result = await axios.get(
        variables.SUB_API_URL + `/subjects/${subject_id}/objects`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      for (let i of result.data) i.regions = regs;
      setData(result.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  const CreateObject = async (object_id) => {
    if (createAddressUrFull === "") {
      alert("Введите адрес!");
      return;
    }
    if (createEmail !== "")
      if (
        createEmail.match(
          /^[A-Za-z0-9А-Яа-яёЁ\-\.]+@([A-Za-z0-9А-Яа-яёЁ\-]+\.)+[A-Za-z0-9А-Яа-яёЁ\-]{2,4}$/g
        ) === null
      ) {
        alert("Почта указана не верно!");
        return;
      }
    setLoad(true);
    let is_close = true;

    try {
      const result = await axios.post(
        variables.SUB_API_URL + `/objects-save`,
        {
          p_SUBJECT_ID: paramsURL.get("id"),
          p_ID: object_id,
          p_KPP: createKpp === "" ? null : createKpp,
          p_FULL_OBJECT_NAME: createTitle === "" ? null : createTitle,

          p_FULL_ADDRESS:
            createAddressUrFull === "" ? null : createAddressUrFull,
          p_FULL_ADDRESS_ADDITION:
            createAddressUrAdd === "" ? null : createAddressUrAdd,
          p_POST_INDEX: createIndex === "" ? null : createIndex,
          p_OKATO: createOKATO === "" ? null : createOKATO,
          p_UNOM: createUNOM === "" ? null : createUNOM,
          p_FIAS: createRIAS === "" ? null : createRIAS,

          p_EMAIL: createEmail === "" ? null : createEmail,
          p_STATUS: createStatus === "" ? "F" : createStatus,
          p_CONTACTS: createContacts === "" ? null : createContacts,
          p_PRODUCTGROUPMASK: createProd,
          p_CREATE_DATE:
            createDate === "" || createDate === null
              ? null
              : createDate.toISOString().replace("000Z", "300Z"),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      await ReloadSearch();
    } catch (e) {
      console.log(e);
      setError(e);
      is_close = false;
    }
    setLoad(false);
    return is_close;
  };

  const onEditClick = async (
    object_id,
    kpp,
    title,
    addressUrFull,
    addressUrAdd,
    index,
    OKATO,
    UNOM,
    RIAS,
    Email,
    Status,
    Contacts,
    Prod,
    CreateD
  ) => {
    if (addressUrFull === "") {
      alert("Введите адрес!");
      return;
    }
    if (Email !== "")
      if (
        Email.match(
          /^[A-Za-z0-9А-Яа-яёЁ\-\.]+@([A-Za-z0-9А-Яа-яёЁ\-]+\.)+[A-Za-z0-9А-Яа-яёЁ\-]{2,4}$/g
        ) === null
      ) {
        alert("Почта указана не верно!");
        return;
      }
    setLoad(true);
    let is_close = true;

    try {
      const result = await axios.post(
        variables.SUB_API_URL + `/objects-save`,
        {
          p_SUBJECT_ID: paramsURL.get("id"),
          p_ID: object_id,
          p_KPP: kpp === "" ? null : kpp,
          p_FULL_OBJECT_NAME: title === "" ? null : title,

          p_FULL_ADDRESS: addressUrFull === "" ? null : addressUrFull,
          p_FULL_ADDRESS_ADDITION: addressUrAdd === "" ? null : addressUrAdd,
          p_POST_INDEX: index === "" ? null : index,
          p_OKATO: OKATO === "" ? null : OKATO,
          p_UNOM: UNOM === "" ? null : UNOM,
          p_FIAS: RIAS === "" ? null : RIAS,

          p_EMAIL: Email === "" ? null : Email,
          p_STATUS: Status === "" ? "F" : Status,
          p_CONTACTS: Contacts === "" ? null : Contacts,
          p_PRODUCTGROUPMASK: Prod,
          p_CREATE_DATE:
            CreateD === "" || CreateD === null
              ? null
              : CreateD.toISOString().replace("000Z", "300Z"),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      await ReloadSearch();
    } catch (e) {
      console.log(e);
      setError(e);
      is_close = false;
    }
    setLoad(false);
    return is_close;
  };

  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 170,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const ReloadSearch = async () => {
    const subject_id = paramsURL.get("id");
    await getDetail(subject_id);
    await onSearchClick(subject_id, regions);
  };

  const changeRegion = (e, number) => {
    if (number == 1) {
      setCreateRegion(e);
      setCreateAddressUr(null);
      setCreateOKATO("");
      setCreateAddressUrFull("");
      setCreateAddressUrAdd("");
      setCreateIndex("");
      setCreateRIAS("");
    } else {
      setCreateRegionS(e);
      setCreateAddressUrS(null);
      setCreateOKATOS("");
      setCreateAddressUrFullS("");
      setCreateAddressUrAddS("");
      setCreateIndexS("");
      setCreateRIASS("");
    }
  };

  const fillAddress = (e, number) => {
    if (e === null) {
      return;
    }
    if (number == 1) {
      setCreateAddressUr(e);
      setCreateOKATO(e.data.okato === null ? "" : e.data.okato.slice(0, 8));
      setCreateAddressUrFull(e.value);
      setCreateAddressUrAdd("");
      setCreateIndex(e.data.postal_code);
      setCreateRIAS(e.data.fias_id);
    } else {
      setCreateAddressUrS(e);
      setCreateOKATOS(e.data.okato === null ? "" : e.data.okato.slice(0, 8));
      setCreateAddressUrFullS(e.value);
      setCreateAddressUrAddS("");
      setCreateIndexS(e.data.postal_code);
      setCreateRIASS(e.data.fias_id);
    }
  };

  const parseOgrn = (e, create) => {
    if (e === "") {
      switch (create) {
        case 0:
          setCreateOgrnS(e);
          break;
        case 1:
          setCreateOgrn(e);
          break;
      }
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    e = e.length > 15 ? e.slice(0, 15) : e;
    switch (create) {
      case 0:
        setCreateOgrnS(e);
        break;
      case 1:
        setCreateOgrn(e);
        break;
    }
    return;
  };

  const parseKpp = (e, create) => {
    if (e === "") {
      switch (create) {
        case 0:
          setCreateKppS(e);
          break;
        case 1:
          setCreateKpp(e);
          break;
      }
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    e = e.length > 9 ? e.slice(0, 9) : e;
    switch (create) {
      case 0:
        setCreateKppS(e);
        break;
      case 1:
        setCreateKpp(e);
        break;
    }
  };

  const fillAddressAdd = (e, number) => {
    if (number == 1) {
      setCreateAddressUrAdd(e);
      if (e === "") {
        setCreateAddressUrFull(createAddressUr.value);
      } else {
        setCreateAddressUrFull(createAddressUr.value + ", " + e);
      }
    } else {
      setCreateAddressUrAddS(e);
      if (e === "") {
        setCreateAddressUrFullS(createAddressUrS.value);
      } else {
        setCreateAddressUrFullS(createAddressUrS.value + ", " + e);
      }
    }
  };

  const onDeleteClick = async (doc_id) => {
    if (confirm("Вы уверены?")) {
      console.log("Выгрузка");
    } else {
      // Do nothing!
      return;
    }
    setLoad(true);
    let res = true;
    try {
      const result = await axios.delete(
        variables.SUB_API_URL + `/objects/${doc_id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      await ReloadSearch();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
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
      let data = [];
      for (let i of result.data.suggestions) {
        i.name = i.value;
        data.push(i);
      }
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  const loadAddressS = async (e) => {
    try {
      const result = await axios.post(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`,
        {
          query: e,
          count: 5,
          division: "",
          locations:
            createRegionS === null
              ? undefined
              : [
                  {
                    kladr_id: `${
                      createRegionS.value < 10
                        ? "0" + String(createRegionS.value)
                        : createRegionS.value
                    }00000000000`,
                  },
                ],
          locations_boost:
            createRegionS === null
              ? undefined
              : [
                  {
                    kladr_id: `${
                      createRegionS.value < 10
                        ? "0" + String(createRegionS.value)
                        : createRegionS.value
                    }00000000000`,
                  },
                ],
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
      let data = [];
      for (let i of result.data.suggestions) {
        i.name = i.value;
        data.push(i);
      }
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  const onEditSubject = async () => {
    if (createAddressUrFullS === "") {
      alert("Введите адрес!");
      return;
    }
    if (createPhoneS !== "" && createPhoneS !== null)
      if (createPhoneS.match(/^\+7 \(\d\d\d\) \d\d\d\-\d\d\-\d\d$/) === null) {
        alert("Номер телефона не верный!");
        return;
      }
    if (createEmailS !== "" && createEmailS !== null)
      if (
        createEmailS.match(
          /^[A-Za-z0-9А-Яа-яёЁ\-\.]+@([A-Za-z0-9А-Яа-яёЁ\-]+\.)+[A-Za-z0-9А-Яа-яёЁ\-]{2,4}$/g
        ) === null
      ) {
        alert("Почта указана не верно!");
        return;
      }
    setLoad(true);
    let is_close = true;

    try {
      const result = await axios.post(
        variables.SUB_API_URL + `/subjects-save`,
        {
          p_ID: Number(paramsURL.get("id")),
          p_INN: createInnS === "" ? null : createInnS,
          p_KPP: createKppS === "" ? null : createKppS,
          p_OGRN: createOgrnS === "" ? null : createOgrnS,
          p_FULL_SUBJECT_NAME: createTitleS === "" ? null : createTitleS,
          p_BRIEF_SUBJECT_NAME:
            createTitleBriefS === "" ? null : createTitleBriefS,
          p_BOSS_FIRSTNAME: createFirstS === "" ? null : createFirstS,
          p_BOSS_LASTNAME: createLastS === "" ? null : createLastS,
          p_BOSS_PATRONYMIC: createDadS === "" ? null : createDadS,

          p_FULL_ADDRESS_UR:
            createAddressUrFullS === "" ? null : createAddressUrFullS,
          p_ADDRESS_UR_ADDITION:
            createAddressUrAddS === "" ? null : createAddressUrAddS,
          p_FIAS: createRIASS === "" ? null : createRIASS,
          p_POST_INDEX: createIndexS === "" ? null : createIndexS,
          p_OKATO: createOKATOS === "" ? null : createOKATOS,
          p_REGION_CODE: createRegionS === null ? null : createRegionS.value,

          p_EMAIL: createEmailS === "" ? null : createEmailS,
          p_TEL: createPhoneS === "" ? null : createPhoneS,
          p_BOSS_POSTNAME: createStatusS === "" ? null : createStatusS,
          p_CONTACTS: createContactsS === "" ? null : createContactsS,
          p_VALIDATE_MASK: createValidS,
          p_ID_RISKCATEGORY: createRiskS === null ? null : createRiskS.value,
          p_ID_SMALLBUSINESSTYPE: createCatS === null ? null : createCatS.value,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      await ReloadSearch();
    } catch (e) {
      console.log(e);
      setError(e);
      is_close = false;
    }
    setLoad(false);
    return is_close;
  };

  if (subject === null) {
    return (
      <div>
        <ProcessNotification
          isOpen={loading}
          closeModal={() => setLoad(!loading)}
        />
        <ErrorNotification
          isOpen={error !== null}
          closeModal={() => setError(null)}
          error={error === null ? null : error}
        />
      </div>
    );
  }
  return (
    <>
      <ProcessNotification
        isOpen={loading}
        closeModal={() => setLoad(!loading)}
      />
      <ErrorNotification
        isOpen={error !== null}
        closeModal={() => setError(null)}
        error={error === null ? null : error}
      />
      <Breadcrumb pageName="Просмотр субъекта" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12">
            <Card
              name="Сведения о субъекте"
              buttons={
                <>
                  <ModalSvg
                    title={"Редактирование субъекта"}
                    svgButton={<IconButtonEdit />}
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
                                  Организация
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
                                  Руководитель
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
                                  Юридический адрес
                                </Tab>
                              </div>
                            </div>
                          </Tab.List>
                          <Tab.Panels className="leading-relaxed block">
                            <Tab.Panel>
                              <form action="#">
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Наименование
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createTitleS}
                                        name={"createTitleS"}
                                        id={"createTitleS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateTitleS(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Краткое наименование
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createTitleBriefS}
                                        name={"createTitleBriefS"}
                                        id={"createTitleBriefS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) =>
                                          setCreateTitleBriefS(e)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/2">
                                    <TextInput
                                      label={"ИНН"}
                                      value={createInnS}
                                      name={"createInnS"}
                                      id={"createInnS"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => console.log("нельзя")}
                                      disabled={true}
                                    />
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <TextInput
                                      label={"КПП"}
                                      value={createKppS}
                                      name={"createKppS"}
                                      id={"createKppS"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => parseKpp(e, 0)}
                                    />
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <TextInput
                                      label={"ОГРН"}
                                      value={createOgrnS}
                                      name={"createOgrnS"}
                                      id={"createOgrnS"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => parseOgrn(e, 0)}
                                    />
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Адрес электронной почты
                                    </label>
                                    <div className="relative">
                                      <EmailInput
                                        type={"email"}
                                        value={createEmailS}
                                        name={"createEmailS"}
                                        id={"createEmailS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateEmailS(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Телефон
                                    </label>
                                    <div className="relative">
                                      <PhoneInput
                                        type={"phone"}
                                        value={createPhoneS}
                                        name={"createPhoneS"}
                                        id={"createPhoneS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreatePhoneS(e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </Tab.Panel>
                            <Tab.Panel>
                              <form action="#">
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Фамилия
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createLastS}
                                        name={"createLastS"}
                                        id={"createLastS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateLastS(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Имя
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createFirstS}
                                        name={"createFirstS"}
                                        id={"createFirstS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateFirstS(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Отчество
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createDadS}
                                        name={"createDadS"}
                                        id={"createDadS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateDadS(e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Должность
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createStatusS}
                                        name={"createStatusS"}
                                        id={"createStatus"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateStatusS(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Контакты
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createContactsS}
                                        name={"createContactsS"}
                                        id={"createContactsS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateContactsS(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Категория риска
                                    </label>
                                    <div className="relative">
                                      <SelectCustom
                                        options={risks}
                                        value={createRiskS}
                                        onChange={(e) => setCreateRiskS(e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/3">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Категория МСП
                                    </label>
                                    <div className="relative">
                                      <SelectCustom
                                        options={businessTypes}
                                        value={createCatS}
                                        onChange={(e) => setCreateCatS(e)}
                                      />
                                    </div>
                                  </div>
                                  {/* <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Валидность
                                    </label>
                                    <div className="relative">
                                      <CheckboxDefault
                                        label={"Да"}
                                        name={"createValid_1"}
                                        id={"createValid_1"}
                                        value={createValidS === 1}
                                        onChange={() =>
                                          setCreateValidS(1)
                                        }></CheckboxDefault>
                                      <CheckboxDefault
                                        label={"Нет"}
                                        name={"createValid_0"}
                                        id={"createValid_0"}
                                        value={createValidS === 0}
                                        onChange={() =>
                                          setCreateValidS(0)
                                        }></CheckboxDefault>
                                    </div>
                                  </div> */}
                                </div>
                              </form>
                            </Tab.Panel>
                            <Tab.Panel>
                              <form action="#">
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Регион
                                    </label>
                                    <div className="relative">
                                      <SelectCustom
                                        options={regions}
                                        value={createRegionS}
                                        onChange={(e) => changeRegion(e, 0)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/3">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Почтовый индекс
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createIndexS}
                                        name={"createIndexS"}
                                        id={"createIndexS"}
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
                                        value={createOKATOS}
                                        name={"createOKATOS"}
                                        id={"createOKATOS"}
                                        placeholder={"Не заполнено"}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>{" "}
                                  <div className="w-full sm:w-1/3">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      ФИАС
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createRIASS}
                                        name={"createRIASS"}
                                        id={"createRIASS"}
                                        placeholder={"Не заполнено"}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="fullName">
                                      Адрес
                                    </label>
                                    <div className="relative">
                                      <AsyncSelectCustom
                                        value={createAddressUrS}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => fillAddress(e, 0)}
                                        queryChange={loadAddressS}
                                        placeholder={"Введите Адрес"}
                                        prepareRawInput={null}
                                        displayField={"value"}
                                        filterLimit={-1}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Дополнение к адресу
                                    </label>
                                    <div className="relative">
                                      <TextInput
                                        type={"text"}
                                        value={createAddressUrAddS}
                                        name={"createAddressUrAddS"}
                                        id={"createAddressUrAddS"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => fillAddressAdd(e, 0)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Полный адрес
                                    </label>
                                    <div className="relative">
                                      <TextAreaInput
                                        type={"text"}
                                        value={createAddressUrFullS}
                                        name={"createAddressUrFullS"}
                                        id={"createAddressUrFullS"}
                                        placeholder={"Не заполнено"}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </Tab.Panel>
                          </Tab.Panels>
                        </Tab.Group>
                      </>
                    }
                    onClick={() => onEditSubject()}></ModalSvg>
                </>
              }>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <p>Наименование : {subject.full_subject_name}</p>
                  <p>Краткое наименование : {subject.brief_subject_name}</p>
                  <p>ИНН : {subject.inn}</p>
                  <p>КПП : {subject.kpp}</p>
                  <p>ОГРН : {subject.ogrn}</p>
                  <p>Регион : {subject.region_code}</p>
                  <p>Юридический адрес : {subject.full_address_ur}</p>
                  <p>ОКАТО : {subject.okato}</p>
                  <p>Адрес электронной почты : {subject.email}</p>
                  <p>Телефон : {subject.tel}</p>
                </div>
                <div className="w-full sm:w-1/2">
                  <p>Фамилия : {subject.boss_lastname}</p>
                  <p>Имя : {subject.boss_firstname}</p>
                  <p>Отчество : {subject.boss_patronymic}</p>
                  <p>Должность : {subject.boss_postname}</p>
                  <p>Контакты : {subject.contacts}</p>
                  <p>Категория риска : {subject.riskcategoryname}</p>
                  <p>Категория МСП : {subject.smallbusinesstypename}</p>
                  <p>
                    Дата внесения в реестр декларантов:{" "}
                    {showDate(subject.create_date)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={null}
            name="Cписок объектов"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={dataColumns}
                    rowData={data}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
                    autosize={true}
                    sideBar={{
                      toolPanels: [
                        {
                          id: "columns",
                          labelDefault: "Columns",
                          labelKey: "columns",
                          iconKey: "columns",
                          toolPanel: "agColumnsToolPanel",
                          minWidth: 225,
                          width: 225,
                          maxWidth: 225,
                          toolPanelParams: {
                            suppressRowGroups: true,
                            suppressValues: true,
                            suppressPivots: true,
                            suppressPivotMode: true,
                            suppressColumnFilter: true,
                            suppressColumnSelectAll: true,
                            suppressColumnExpandAll: true,
                          },
                        },
                      ],
                      position: "left",
                    }}
                  />
                </div>
              </div>
            }
            buttons={
              <>
                <DefaultModal
                  title={"Добавление объекта"}
                  textbutton={"Добавить"}
                  onClickText={"Добавить"}
                  onClickClassName={
                    "text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  }
                  children={
                    <>
                      <TabGroup>
                        <TabList className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
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
                        </TabList>
                        <TabPanels className="leading-relaxed block">
                          <TabPanel>
                            <form action="#">
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
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
                                  <TextInput
                                    label={"КПП"}
                                    value={createKpp}
                                    name={"createKpp"}
                                    id={"createKpp"}
                                    placeholder={"Не заполнено"}
                                    onChange={(e) => parseKpp(e, 1)}
                                  />
                                </div>
                              </div>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
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
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
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
                                      onChange={() =>
                                        setProdTypes(1)
                                      }></CheckboxDefault>
                                    <CheckboxDefault
                                      label={
                                        "Спитосодержащая не пищевая продукция"
                                      }
                                      name={"createValid_1"}
                                      id={"createValid_1"}
                                      value={createProd.includes(2)}
                                      onChange={() =>
                                        setProdTypes(2)
                                      }></CheckboxDefault>
                                    <CheckboxDefault
                                      label={"Пиво и пивная продукция"}
                                      name={"createValid_0"}
                                      id={"createValid_0"}
                                      value={createProd.includes(4)}
                                      onChange={() =>
                                        setProdTypes(4)
                                      }></CheckboxDefault>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </TabPanel>
                          <Tab.Panel>
                            <form action="#">
                              <div className="mb-5.5 flex flex-col gap-5.5 text-left">
                                <div className="w-full">
                                  <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="fullName">
                                    Адрес
                                  </label>
                                  <div className="relative">
                                    <AsyncSelectCustom
                                      value={createAddressUr}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => fillAddress(e, 1)}
                                      queryChange={loadAddress}
                                      placeholder={"Введите Адрес"}
                                      prepareRawInput={null}
                                      displayField={"value"}
                                      filterLimit={-1}
                                    />
                                  </div>
                                </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                  <div className="w-full sm:w-1/2">
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
                                  </div>
                                  <div className="w-full sm:w-1/2">
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
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                  <div className="w-full">
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
                                  <div className="w-full">
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
                                      />
                                    </div>
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
                                    onChange={(e) => fillAddressAdd(e, 1)}
                                  />
                                </div>
                              </div>

                              <div className="w-full  text-left">
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
                        </TabPanels>
                      </TabGroup>
                    </>
                  }
                  onClick={() => CreateObject(null)}></DefaultModal>
                <button
                  type="button"
                  onClick={() => ReloadSearch()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Обновить
                </button>
              </>
            }></CardTable>
        </div>
      </div>
    </>
  );
};

export default DetailSubject;
