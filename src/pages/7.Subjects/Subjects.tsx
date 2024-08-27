import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
  useCallback,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";

import Tabs from "../../components/Tabs/1.Tabs";
import { Tab } from "@headlessui/react";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import AsyncSelectCustom from "../../components/UI/General/Inputs/AsyncSelect";
import PhoneInput from "../../components/UI/General/Inputs/PhoneInput";
import EmailInput from "../../components/UI/General/Inputs/EmailInput";
import TextInput from "../../components/UI/General/Inputs/TextInput";
import TextAreaInput from "../../components/UI/General/Inputs/TextAreaInput.tsx";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../variables";

import ModalFetch from "./ModalSubject.tsx";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";
import IconButtonTrash from "../../components/UI/General/Buttons/IconButtonTrash.tsx";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const filter_use = false;

const Subjects = () => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [is_open_filters, setFilters] = useState(true);
  const [limit] = useState(1);

  const [risks, setRisks] = useState([]);
  const [businessTypes, setBusTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [okopfs, setOkopfs] = useState([]);
  const [innTypes] = useState([
    { value: null, name: "Не важно" },
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
  const [typesProd] = useState([
    { value: -1, name: "Не важно" },
    { value: 1, name: "Алкоголь" },
    { value: 2, name: "Спиртосодержащая непищевая продукция" },
    { value: 4, name: "Пиво и пивная продукция" },
  ]);
  const [prodTypesDict] = useState({
    1: "Алкоголь",
    2: "Спиртосодержащая непищевая продукция",
    4: "Пиво и пивная продукция",
  });

  // data columns
  const [dataColumns] = useState([
    {
      enableValue: true,
      field: "operations",
      headerName: "Операции",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agNumberColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        return (
          <div className="flex py-2">
            <Link
              to={`subject?id=${params.data.id}`}
              target="_blank"
              title="Редактировать">
              <PencilSquareIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
            </Link>{" "}
            <IconButtonTrash
              onClick={() => onDeleteClick(params.data.id)}
              title={"Удалить"}
            />
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "egrul_date",
      headerName: "Выписка ФНС",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agNumberColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        let d = new Date(params.getValue());
        let now = Date.now();
        if (d.getTime() >= now) {
          return (
            <div style={{ color: "green" }}>{showDate(params.getValue())}</div>
          );
        } else {
          return (
            <div style={{ color: "red" }}>{showDate(params.getValue())}</div>
          );
        }
      },
    },
    {
      enableValue: true,
      field: "full_subject_name",
      headerName: "Полное наименование",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "brief_subject_name",
      headerName: "Сокращенное наименование",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "inn_length",
      headerName: "Тип",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        if (params.getValue() == 12) {
          return <div>ФЛ</div>;
        } else {
          return <div>ЮЛ</div>;
        }
      },
    },
    {
      enableValue: true,
      field: "inn",
      headerName: "ИНН/\nКПП/\nОГРН",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        return (
          <div>
            {params.data.inn}/<br />
            {params.data.kpp}/<br />
            {params.data.ogrn}
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "region_code",
      headerName: "Регион",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "boss",
      headerName: "Руководитель",
      resizable: true,
      sortable: false,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        return (
          <div>
            {params.data.boss_lastname + " "}
            {params.data.boss_firstname + " "}
            {params.data.boss_patronymic}
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "full_address_ur",
      headerName: "Юр. адрес",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "full_subject_name",
      headerName: "Адрес места реализации",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "email",
      headerName: "Адрес электронной почты",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "tel",
      headerName: "Телефон",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "workstart_date",
      headerName: "Дата начала деятельности",
      filter: filter_use ? "agDateColumnFilter" : null,
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "id_rsmpsource",
      headerName: "Метод создания",
      resizable: true,
      sortable: false,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{methodsTypesDict[params.getValue()]}</div>;
      },
    },
    {
      enableValue: true,
      field: "create_date",
      headerName: "Дата внесения в реестр",
      resizable: true,
      sortable: false,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "ogrn_date",
      headerName: "Дата регистрации в ЕГРЮЛ/ЕГРИП",
      resizable: true,
      sortable: false,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "productgroupmask",
      headerName: "Тип реализуемой продукции",
      resizable: true,
      sortable: false,
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
      field: "smallbusinesstypename",
      headerName: "Категории МСП",
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "riskcategoryname",
      headerName: "Категория риска",
      resizable: true,
      sortable: false,
    },
  ]);

  const [inn, setInn] = useState("");
  const [innType, setInnType] = useState(innTypes[0]);
  const [kpp, setKpp] = useState("");
  const [ogrn, setOgrn] = useState("");
  const [region, setRegion] = useState(null);
  const [title, setTitle] = useState("");
  const [titleBrief, setTitleBrief] = useState("");
  const [manager, setManager] = useState("");
  const [addressUr, setAddressUr] = useState("");
  const [addressAct, setAddressAct] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [method, setMethod] = useState(typeMethods[0]);
  const [isLic, setIsLic] = useState(null);
  const [dateReestr, setDateReestr] = useState("");
  const [dateRegist, setDateRegist] = useState("");
  const [typeProd, setTypeProd] = useState(typesProd[0]);
  const [isValid, setIsValid] = useState(null);
  const [risk, setRisk] = useState(null);
  const [category, setCategory] = useState(null);

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);

  //create subject
  const [canCreate, setCanCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createTitleBrief, setCreateTitleBrief] = useState("");
  const [createInn, setCreateInn] = useState("");
  const [createKpp, setCreateKpp] = useState("");
  const [createOgrn, setCreateOgrn] = useState("");
  const [createRegion, setCreateRegion] = useState(null);

  const [createRIAS, setCreateRIAS] = useState("");
  const [createIndex, setCreateIndex] = useState("");
  const [createAddressUr, setCreateAddressUr] = useState("");
  const [createAddressUrAdd, setCreateAddressUrAdd] = useState("");
  const [createAddressUrFull, setCreateAddressUrFull] = useState("");
  const [createOKATO, setCreateOKATO] = useState("");

  const [createEmail, setCreateEmail] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createLast, setCreateLast] = useState("");
  const [createFirst, setCreateFirst] = useState("");
  const [createDad, setCreateDad] = useState("");
  const [createStatus, setCreateStatus] = useState("");
  const [createContacts, setCreateContacts] = useState("");
  const [createRisk, setCreateRisk] = useState(null);
  const [createCat, setCreateCat] = useState(null);
  const [createValid, setCreateValid] = useState(0);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    getRegions();
    getBusinessTypes();
    getOkopfs();
    getRisks();
  }, []);

  const getCheckInn = async () => {
    if (createInn.length !== 10 && createInn.length !== 12) {
      alert("ИНН должен быть или 10 или 12 цифр");
      return false;
    }
    setLoad(true);
    try {
      const result = await axios.post(
        variables.SUB_API_URL + `/subjects-check`,
        {
          INN: createInn,
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
      setCanCreate(true);
    } catch (e) {
      if (e.response.request.status === 400) {
        alert("Данный ИНН уже присутвует в системе");
        const link = document.createElement("a");
        link.href = `Subjects/subject?id=${e.response.data.id}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
      setCreateInn("");
      setCanCreate(false);
    }
    setLoad(false);
    return false;
  };

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
      setRegions([
        { value: null, name: "Не важно" },
        ...result.data.map((i) => ({
          value: i.region_code,
          name: i.region_name,
        })),
      ]);
      setRegion({ value: null, name: "Не важно" });
    } catch (e) {
      console.log(e);
      setError(e);
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
      setRisks([
        { value: null, name: "Не важно" },
        ...result.data.map((i) => ({
          value: i.id_riskcategory,
          name: i.riskcategoryname,
        })),
      ]);
      setRisk({ value: null, name: "Не важно" });
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
      setBusTypes([
        { value: null, name: "Не важно" },
        ...result.data.map((i) => ({
          value: i.id_smallbusinesstype,
          name: i.smallbusinesstypename,
        })),
      ]);
      setCategory({ value: null, name: "Не важно" });
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getOkopfs = async () => {
    try {
      const result = await axios.get(variables.SUB_API_URL + `/okopf`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setOkopfs(result.data.map((i) => ({ value: i.code, name: i.name })));
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const parseInn = (e, create) => {
    if (e === "") {
      switch (create) {
        case 0:
          setInn(e);
          break;
        case 1:
          setCreateInn(e);
          break;
        case 2:
          setCheckInn(e);
          break;
      }
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    e = e.length > 12 ? e.slice(0, 12) : e;
    switch (create) {
      case 0:
        setInn(e);
        break;
      case 1:
        setCreateInn(e);
        break;
      case 2:
        setCheckInn(e);
        break;
    }
  };

  const parseOgrn = (e, create) => {
    if (e === "") {
      switch (create) {
        case 0:
          setOgrn(e);
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
        setOgrn(e);
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
          setKpp(e);
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
        setKpp(e);
        break;
      case 1:
        setCreateKpp(e);
        break;
    }
  };

  const onSearchClick = async () => {
    if (inn !== "")
      if (inn.length < 10 || inn.length > 12) {
        alert("ИНН должен содержать от 10 до 12 цифр!");
        return;
      }
    setLoad(true);

    try {
      const result = await axios.post(
        variables.SUB_API_URL + `/subjects-count`,
        {
          p_INN: inn === "" ? null : inn,
          p_INN_LENGTH: innType === null ? null : innType.value,
          p_KPP: kpp === "" ? null : kpp,
          p_OGRN: ogrn === "" ? null : ogrn,
          p_REGION: region === null ? null : region.value,
          p_TITLE_MASK: title === "" ? null : title,
          p_TITLE_BRIEF_MASK: titleBrief === "" ? null : titleBrief,
          p_MANAGER: manager === "" ? null : manager,
          p_ADDRESS_UR: addressUr === "" ? null : addressUr,
          p_ADDRESS_ACT: addressAct === "" ? null : addressAct,
          p_EMAIL: email === "" ? null : email,
          p_PHONE: phone === "" ? null : phone,
          p_STARTDATE:
            dateStart === "" || dateStart === null
              ? null
              : dateStart.toISOString().replace(".000Z", "+04:00"),
          p_METHOD: method === null ? null : method.value,
          p_ISLICENSE: isLic,
          p_DATEREESTR:
            dateReestr === "" || dateReestr === null
              ? null
              : dateReestr.toISOString().replace(".000Z", "+04:00"),
          p_DATEREGISTR:
            dateRegist === "" || dateRegist === null
              ? null
              : dateRegist.toISOString().replace(".000Z", "+04:00"),
          p_ISVALID: isValid,
          p_PRODTYPE: typeProd === null ? null : typeProd.value,
          p_RISK: risk === null ? null : risk.value,
          p_CATEGORY: category === null ? null : category.value,
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
      var count = result.data.total_count;
      if (count > 0) {
        setCount(count);
      }
      console.log("this");
      var datasource = getServerSideDatasource(count);
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  const getServerSideDatasource = (count) => {
    return {
      getRows: async (params) => {
        console.log("[Datasource] - rows requested by grid: ", params.request);
        const startRow = params.request.startRow;
        const endRow = params.request.endRow;
        setLoad(true);
        try {
          const result = await axios.post(
            variables.SUB_API_URL + `/subjects`,
            {
              p_INN: inn === "" ? null : inn,
              p_INN_LENGTH: innType === null ? null : innType.value,
              p_KPP: kpp === "" ? null : kpp,
              p_OGRN: ogrn === "" ? null : ogrn,
              p_REGION: region === null ? null : region.value,
              p_TITLE_MASK: title === "" ? null : title,
              p_TITLE_BRIEF_MASK: titleBrief === "" ? null : titleBrief,
              p_MANAGER: manager === "" ? null : manager,
              p_ADDRESS_UR: addressUr === "" ? null : addressUr,
              p_ADDRESS_ACT: addressAct === "" ? null : addressAct,
              p_EMAIL: email === "" ? null : email,
              p_PHONE: phone === "" ? null : phone,
              p_STARTDATE:
                dateStart === "" || dateStart === null
                  ? null
                  : dateStart.toISOString().replace(".000Z", "+04:00"),
              p_METHOD: method === null ? null : method.value,
              p_ISLICENSE: isLic,
              p_DATEREESTR:
                dateReestr === "" || dateReestr === null
                  ? null
                  : dateReestr.toISOString().replace(".000Z", "+04:00"),
              p_DATEREGISTR:
                dateRegist === "" || dateRegist === null
                  ? null
                  : dateRegist.toISOString().replace(".000Z", "+04:00"),
              p_ISVALID: isValid,
              p_PRODTYPE: typeProd === null ? null : typeProd.value,
              p_RISK: risk === null ? null : risk.value,
              p_CATEGORY: category === null ? null : category.value,

              page: startRow / (endRow - startRow),
              limit: endRow - startRow,
              order_by:
                params.request.sortModel.length === 0
                  ? "id"
                  : params.request.sortModel[0].colId,
              order_stream:
                params.request.sortModel.length === 0
                  ? "asc"
                  : params.request.sortModel[0].sort,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
                User: "user",
              },
            }
          );
          if (result.success) throw Error(result);
          params.success({
            rowData: result.data,
            rowCount: count,
          });
        } catch (e) {
          console.log(e);
          params.fail();
        }
        setLoad(false);
      },
    };
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
        variables.SUB_API_URL + `/subjects/${doc_id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      await onSearchClick();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
  };

  const CreateSubject = async () => {
    if (createInn !== "")
      if (createInn.length < 10 || createInn.length > 12) {
        alert("ИНН должен содержать от 10 до 12 цифр!");
        return;
      }
    if (createAddressUrFull === "") {
      alert("Введите адрес!");
      return;
    }
    if (createPhone !== "")
      if (createPhone.match(/^\+7 \(\d\d\d\) \d\d\d\-\d\d\-\d\d$/) === null) {
        alert("Номер телефона не верный!");
        return;
      }
    if (createEmail !== "")
      if (
        createEmail.match(
          /^[A-Za-z0-9А-Яа-яёЁ\-.]+@([A-Za-z0-9А-Яа-яёЁ\-]+\.)+[A-Za-z0-9А-Яа-яёЁ\-]{2,4}$/g
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
          p_INN: createInn === "" ? null : createInn,
          p_KPP: createKpp === "" ? null : createKpp,
          p_OGRN: createOgrn === "" ? null : createOgrn,
          p_FULL_SUBJECT_NAME: createTitle === "" ? null : createTitle,
          p_BRIEF_SUBJECT_NAME:
            createTitleBrief === "" ? null : createTitleBrief,
          p_BOSS_FIRSTNAME: createFirst === "" ? null : createFirst,
          p_BOSS_LASTNAME: createLast === "" ? null : createLast,
          p_BOSS_PATRONYMIC: createDad === "" ? null : createDad,

          p_FULL_ADDRESS_UR:
            createAddressUrFull === "" ? null : createAddressUrFull,
          p_ADDRESS_UR_ADDITION:
            createAddressUrAdd === "" ? null : createAddressUrAdd,
          p_FIAS: createRIAS === "" ? null : createRIAS,
          p_POST_INDEX: createIndex === "" ? null : createIndex,
          p_OKATO: createOKATO === "" ? null : createOKATO,
          p_REGION_CODE: createRegion === null ? null : createRegion.value,

          p_EMAIL: createEmail === "" ? null : createEmail,
          p_TEL: createPhone === "" ? null : createPhone,
          p_BOSS_POSTNAME: createStatus === "" ? null : createStatus,
          p_CONTACTS: createContacts === "" ? null : createContacts,
          p_VALIDATE_MASK: createValid,
          p_ID_RISKCATEGORY: createRisk === null ? null : createRisk.value,
          p_ID_SMALLBUSINESSTYPE: createCat === null ? null : createCat.value,
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
      await onSearchClick();
    } catch (e) {
      console.log(e);
      setError(e);
      is_close = false;
    }
    if (is_close) {
      setLoad(false);
      setCreateInn("");
    }
    return is_close;
  };

  const onViewClick = async (doc_id) => {
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
        variables.SUB_API_URL + `/subjects/${doc_id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
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

  const Download = async (path) => {
    if (confirm("Вы уверены?")) {
      console.log("Выгрузка");
    } else {
      // Do nothing!
      return;
    }
    setLoad(true);
    let sort_info = null;
    for (const row of gridRef.current.api.getColumnState()) {
      if (row.sortIndex !== null) {
        sort_info = row;
        break;
      }
    }
    if (inn !== "")
      if (inn.length < 10 || inn.length > 12) {
        alert("ИНН должен содержать от 10 до 12 цифр!");
        return;
      }
    if (phone !== "")
      if (phone.match(/^\+7 \(\d\d\d\) \d\d\d\-\d\d\-\d\d$/) === null) {
        alert("Номер телефона не верный!");
        return;
      }
    if (email !== "")
      if (
        email.match(
          /^[A-Za-z0-9А-Яа-яёЁ\-\.]+@([A-Za-z0-9А-Яа-яёЁ\-]+\.)+[A-Za-z0-9А-Яа-яёЁ\-]{2,4}$/g
        ) === null
      ) {
        alert("Почта указана не верно!");
        return;
      }
    console.log(sort_info);
    try {
      const result = await axios.post(
        variables.SUB_API_URL + `/subjects-xlsx`,
        {
          p_INN: inn === "" ? null : inn,
          p_INN_LENGTH: innType === null ? null : innType.value,
          p_KPP: kpp === "" ? null : kpp,
          p_OGRN: ogrn === "" ? null : ogrn,
          p_REGION: region === null ? null : region.value,
          p_TITLE_MASK: title === "" ? null : title,
          p_TITLE_BRIEF_MASK: titleBrief === "" ? null : titleBrief,
          p_MANAGER: manager === "" ? null : manager,
          p_ADDRESS_UR: addressUr === "" ? null : addressUr,
          p_ADDRESS_ACT: addressAct === "" ? null : addressAct,
          p_EMAIL: email === "" ? null : email,
          p_PHONE: phone === "" ? null : phone,
          p_STARTDATE:
            dateStart === "" || dateStart === null
              ? null
              : dateStart.toISOString().replace("000Z", "300Z"),
          p_METHOD: method === null ? null : method.value,
          p_ISLICENSE: isLic,
          p_DATEREESTR:
            dateReestr === "" || dateReestr === null
              ? null
              : dateReestr.toISOString().replace("000Z", "300Z"),
          p_DATEREGISTR:
            dateRegist === "" || dateRegist === null
              ? null
              : dateRegist.toISOString().replace("000Z", "300Z"),
          p_ISVALID: isValid,
          p_PRODTYPE: typeProd === null ? null : typeProd.value,
          p_RISK: risk === null ? null : risk.value,
          p_CATEGORY: category === null ? null : category.value,

          order_by: sort_info === null ? "id" : sort_info.colId,
          order_stream: sort_info === null ? "asc" : sort_info.sort,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      const fileType = result.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      console.log(fileType);
      link.setAttribute("download", "Субъекты лицензий.xlsx"); //or any other extension
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
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
              : [
                  {
                    kladr_id: `${
                      createRegion.value < 10
                        ? "0" + String(createRegion.value)
                        : createRegion.value
                    }00000000000`,
                  },
                ],
          locations_boost:
            createRegion === null
              ? undefined
              : [
                  {
                    kladr_id: `${
                      createRegion.value < 10
                        ? "0" + String(createRegion.value)
                        : createRegion.value
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
      return data;
    } catch (e) {
      console.log(e);
    }
    return [];
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
    if (e === "") setCreateAddressUrFull(createAddressUr.value);
    else setCreateAddressUrFull(createAddressUr.value + ", " + e);
  };

  const openCreateModal = () => {
    setCreateInn("");
    setCanCreate(false);
  };

  const parsePhone = (e) => {
    if (e === "") {
      setPhone("");
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    e = e.length > 11 ? e.slice(0, 11) : e;
    setPhone(e);
  };

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
      <Breadcrumb pageName="Реестр субъектов" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          {/*Карточка 1*/}
          <div className="col-span-7">
            <Card name="Сведения о юр. лице">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Наименование
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={title}
                        name={"createTitle"}
                        id={"createTitle"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setTitle(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Краткое наименование
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={titleBrief}
                        name={"createTitleBrief"}
                        id={"createTitleBrief"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setTitleBrief(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Руководитель
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={manager}
                        name={"manager"}
                        id={"manager"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setManager(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <TextInput
                      label={"ИНН"}
                      value={inn}
                      name={"INN"}
                      id={"INN"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseInn(e, 0)}
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <TextInput
                      label={"КПП"}
                      value={kpp}
                      name={"kpp"}
                      id={"kpp"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseKpp(e, 0)}
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <TextInput
                      label={"ОГРН"}
                      value={ogrn}
                      name={"ogrn"}
                      id={"ogrn"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseOgrn(e, 0)}
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Тип
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={innTypes}
                        value={innType}
                        onChange={(e) => setInnType(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          {/*Карточка 2*/}
          <div className="col-span-5">
            <Card name="Контактные данные">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Юридический адрес
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={addressUr}
                        name={"addressUr"}
                        id={"addressUr"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setAddressUr(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Адрес места реализации
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={addressAct}
                        name={"addressAct"}
                        id={"addressAct"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setAddressAct(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Регион
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={regions}
                        value={region}
                        onChange={(e) => setRegion(e)}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Адрес электронной почты
                    </label>
                    <div className="relative">
                      <EmailInput
                        type={"email"}
                        value={email}
                        name={"Email"}
                        id={"Email"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setEmail(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Номер телефона
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={phone}
                        name={"phone"}
                        id={"phone"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => parsePhone(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          {/*Карточка 3*/}
          <div className="col-span-10">
            <Card name="Параметры документов">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата начала деятельности"}
                      selected={dateStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setDateStart(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата внесения в реестр"}
                      selected={dateReestr}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setDateReestr(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата рег-ии в ЕГРЮЛ/ЕГРИП"}
                      selected={dateRegist}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setDateRegist(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Тип реализуемой продукции
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={typesProd}
                        value={typeProd}
                        onChange={(e) => setTypeProd(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Категория МСП
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={businessTypes}
                        value={category}
                        onChange={(e) => setCategory(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Категория риска
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={risks}
                        value={risk}
                        onChange={(e) => setRisk(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Метод создания
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={typeMethods}
                        value={method}
                        onChange={(e) => setMethod(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Cписок субъектов"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={dataColumns}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    rowModelType={"serverSide"}
                    pagination={true}
                    paginationPageSize={100}
                    rowSelection={"multiple"}
                    suppressRowClickSelection={true}
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
                <IconButtonDownload
                  title={"Выгрузить в Excel"}
                  onClick={() => Download()}
                />
                <ModalFetch
                  className="w-1/8"
                  title={"Добавление субъекта"}
                  textbutton={"Добавление субъекта"}
                  onClickText={canCreate ? "Добавить" : "Найти"}
                  onOpenClick={() => openCreateModal()}
                  onClickClassName={
                    "text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  }
                  children={
                    <>
                      {!canCreate ? (
                        <form action="#">
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full" title="Введите ИНН">
                              <NumberInput
                                label={"ИНН"}
                                value={createInn}
                                name={"checkInn"}
                                id={"checkInn"}
                                placeholder={"Не заполнено"}
                                onChange={(e) => parseInn(e, 1)}
                              />
                            </div>
                          </div>
                        </form>
                      ) : (
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
                                  Юридический Адрес
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
                                        value={createTitle}
                                        name={"createTitle"}
                                        id={"createTitle"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateTitle(e)}
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
                                        value={createTitleBrief}
                                        name={"createTitleBrief"}
                                        id={"createTitleBrief"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateTitleBrief(e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/3">
                                    <TextInput
                                      label={"ИНН"}
                                      value={createInn}
                                      name={"createInn"}
                                      id={"createInn"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => parseInn(e, 1)}
                                      disabled={true}
                                    />
                                  </div>
                                  <div className="w-full sm:w-1/3">
                                    <TextInput
                                      label={"КПП"}
                                      value={createKpp}
                                      name={"createKpp"}
                                      id={"createKpp"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => parseKpp(e, 1)}
                                    />
                                  </div>
                                  <div className="w-full sm:w-1/3">
                                    <TextInput
                                      label={"ОГРН"}
                                      value={createOgrn}
                                      name={"createOgrn"}
                                      id={"createOgrn"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => parseOgrn(e, 1)}
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
                                      Телефон
                                    </label>
                                    <div className="relative">
                                      <PhoneInput
                                        type={"phone"}
                                        value={createPhone}
                                        name={"createPhone"}
                                        id={"createPhone"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreatePhone(e)}
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
                                        value={createLast}
                                        name={"createLast"}
                                        id={"createLast"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateLast(e)}
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
                                        value={createFirst}
                                        name={"createFirst"}
                                        id={"createFirst"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateFirst(e)}
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
                                        value={createDad}
                                        name={"createDad"}
                                        id={"createDad"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateDad(e)}
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
                                        value={createStatus}
                                        name={"createStatus"}
                                        id={"createStatus"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateStatus(e)}
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
                                        value={createContacts}
                                        name={"createContacts"}
                                        id={"createContacts"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => setCreateContacts(e)}
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
                                        options={
                                          risks.length === 0
                                            ? []
                                            : risks.slice(1)
                                        }
                                        value={createRisk}
                                        onChange={(e) => setCreateRisk(e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-1/2">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Категория МСП
                                    </label>
                                    <div className="relative">
                                      <SelectCustom
                                        options={
                                          businessTypes.length === 0
                                            ? []
                                            : businessTypes.slice(1)
                                        }
                                        value={createCat}
                                        onChange={(e) => setCreateCat(e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </Tab.Panel>
                            <Tab.Panel>
                              <form action="#">
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                  <div className="w-full sm:w-2/4">
                                    <label
                                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                                      htmlFor="emailAddress">
                                      Регион
                                    </label>
                                    <div className="relative">
                                      <SelectCustom
                                        options={
                                          regions.length === 0
                                            ? []
                                            : regions.slice(1)
                                        }
                                        value={createRegion}
                                        onChange={(e) => changeRegion(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-1/4">
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
                                  <div className="w-full sm:w-1/4">
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
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
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
                                        value={createAddressUrAdd}
                                        name={"createAddressUrAdd"}
                                        id={"createAddressUrAdd"}
                                        placeholder={"Не заполнено"}
                                        onChange={(e) => fillAddressAdd(e)}
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
                                        value={createAddressUrFull}
                                        name={"createAddressUrFull"}
                                        id={"createAddressUrFull"}
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
                      )}
                    </>
                  }
                  onClick={() =>
                    canCreate ? CreateSubject() : getCheckInn()
                  }></ModalFetch>
                <button
                  type="button"
                  onClick={() => onSearchClick()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Поиск
                </button>
              </>
            }></CardTable>
        </div>
      </div>
    </>
  );
};

export default Subjects;
