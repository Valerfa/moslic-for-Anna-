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
import ru from "date-fns/locale/ru";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";

import Tabs from "../components/Tabs/1.Tabs";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import AsyncSelectCustom from "../../components/UI/General/Inputs/AsyncSelect";
import DocumentsInput from "../../components/UI/General/Inputs/DocumentsInput";

//Модальное окно
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";

import {
  variables,
  AG_GRID_LOCALE_RU,
  VioLicDataColumns,
  getCurrentYear,
  getCurrentQuarter,
} from "../../variables";
import ButtonDanger from "../../components/UI/General/Buttons/ButtonDanger";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

registerLocale("ru", ru);

const lengths = [
  { value: null, name: "Все" },
  { value: 10, name: "ФЛ" },
  { value: 12, name: "ЮЛ" },
];

const jobs = [
  { value: null, name: "Все" },
  { value: "РПО", name: "РПО" },
  { value: "РПА", name: "РПА" },
];

const forms = [
  { value: null, name: "Все" },
  { value: "7", name: "Форма 7" },
  { value: "8", name: "Форма 8" },
];

const ReestrViolators = () => {
  const gridRef = useRef<AgGridReact>(null);
  const fileInput = createRef();

  const [reestr_type, setReestrType] = useState(1);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [is_open_filters, setFilters] = useState(true);
  const [limit] = useState(1);

  // filter lists
  const [region_list, setRegions] = useState([]);
  const [okato_list, setOkato] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [forms, setForms] = useState([]);

  // filters
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);

  const [inn, setInn] = useState("");
  const [inn_length, setLength] = useState(lengths[0]);
  const [kpp, setKpp] = useState("");
  const [addressAO, setAddressAO] = useState("");
  const [region, setRegion] = useState("");
  const [title, setTitle] = useState("");
  const [addressUR, setAddressUR] = useState("");
  const [address, setAddress] = useState("");

  const [econActiv, setEconActiv] = useState(null);
  const [kindJob, setKindJob] = useState(jobs[0]);
  const [supplies, setSupplies] = useState(null);
  const [countOStart, setCountOStart] = useState("");
  const [countOEnd, setCountOEnd] = useState("");
  const [activeLic, setActiveLic] = useState(null);
  const [activeLicMos, setActiveLicMos] = useState(null);

  const [dublVio, setDublVio] = useState(null);
  const [countDublVioStart, setCountDublVioStart] = useState(null);
  const [countDublVioEnd, setCountDublVioEnd] = useState(null);
  const [fakeInfo, setFakeInfo] = useState(null);
  const [activeAdm, setActiveAdm] = useState(null);
  const [paid, setPaid] = useState(null);

  const [form7, setForm7] = useState(null);
  const [form8, setForm8] = useState(null);
  const [kind7, setKind7] = useState([]);
  const [kind8, setKind8] = useState([]);

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);

  // append new violater
  const [createReason, setCreateReason] = useState(null);
  const [createInn, setCreateInn] = useState("");
  const [createForm, setCreateForm] = useState(null);
  const [createTitle, setCreateTitle] = useState("");
  const [createQuarter, setCreateQuarter] = useState(null);
  const [createYear, setCreateYear] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const [createId, setCreateId] = useState(null);
  const [createNote, setCreateNote] = useState(null);
  const [createDoc, setCreateDoc] = useState(null);

  // delete violater
  const [deleteReason, setDeleteReason] = useState(null);
  const [deleteException, setDeleteException] = useState(null);
  const [deleteAdminFiles, setDeleteAdminFiles] = useState(false);
  const [deleteForm, setDeleteForm] = useState(null);
  const [selRows, setSelectedRows] = useState([]);

  // create file
  const [fileReason, setFileReason] = useState(0);

  useEffect(() => {
    getOkato();
    getRegions();
    getQuarters();
    getYears();
    getExceptions();
    getForms();
  }, []);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const parseInn = (e) => {
    if (e === "") {
      setInn("");
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    e = e.length > 12 ? e.slice(0, 12) : e;
    setInn(e);
  };

  const parseKpp = (e) => {
    if (e === "") {
      setKpp("");
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    e = e.length > 9 ? e.slice(0, 9) : e;
    setKpp(e);
  };

  const parseCreateInn = (e) => {
    if (e === "") {
      return "";
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return "";
    }
    e = e.length > 12 ? e.slice(0, 12) : e;
    return e;
  };

  const setCreateInnName = (e) => {
    setCreateInn(e);
    setCreateTitle(e === null ? null : e.title);
  };

  const getRegions = async () => {
    try {
      const result = await axios.get(variables.VIO_API_URL + `/regions`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setRegions([
        { value: null, name: "Не важно", code: null },
        ...result.data.map((i) => ({
          value: i.region_code,
          name: i.region_name,
        })),
      ]);
      setRegion({ value: null, name: "Не важно", code: null });
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getOkato = async () => {
    try {
      const result = await axios.get(variables.VIO_API_URL + `/msk_okato`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setOkato([
        { value: null, name: "Не важно", code: null },
        ...result.data.map((i) => ({ value: i.code, name: i.name })),
      ]);
      setAddressAO({ value: null, name: "Не важно", code: null });
      setAddressUR({ value: null, name: "Не важно", code: null });
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getQuarters = async () => {
    try {
      const result = await axios.get(variables.VIO_API_URL + `/quarters`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setQuarters([
        { value: null, name: "Не важно", code: null },
        ...result.data?.map((i) => ({
          value: i.quarter,
          name: i.period_name,
          code: i.period_code,
        })),
      ]);
      setQuarter(getCurrentQuarter());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getYears = async () => {
    try {
      const result = await axios.get(variables.VIO_API_URL + `/years`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setYears([
        { value: null, name: "Не важно" },
        ...result.data?.map((i) => ({ value: i.year, name: i.year })),
      ]);
      setYear(getCurrentYear());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getForms = async () => {
    try {
      const result = await axios.get(
        variables.VIO_API_URL + `/declarants-filters`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setForms(result.data.forms.slice(0, 2));
      setCreateForm(result.data.forms[0]);
      setDeleteForm(result.data.forms[0]);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getExceptions = async () => {
    try {
      const result = await axios.get(
        variables.VIO_API_URL + `/deletion-reasons`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setExceptions(
        result.data.map((i) => ({
          code: i.exception_name,
          name: i.exception_name,
        }))
      );
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getInnName = async (e) => {
    try {
      const result = await axios.get(
        variables.VIO_API_URL + `/subject-name/${e}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      return result.data;
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  const filteredExceptions = (query) => {
    console.log(query === "" || query === null);
    if (query === "" || query === null) return exceptions;
    else
      return exceptions.filter((exception) => {
        return exception.name.toLowerCase().includes(query.toLowerCase());
      });
  };

  const onSearchClick = async () => {
    if (quarter === null && year === null) return;
    setLoad(true);

    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/get-violators-count`,
        {
          table_number: reestr_type,
          p_INN: inn === "" ? null : inn,
          p_INN_LENGTH: inn_length === null ? null : inn_length.value,
          p_KPP: kpp === "" ? null : kpp,
          p_REGION_CODE: region === null ? null : region.value,
          p_TITLE_MASK: title === "" ? null : title,
          p_ADDRESS_MASK: address === "" ? null : address,
          p_PERIOD_CODE: quarter === null ? null : quarter.code,
          p_PERIOD_YEAR: year === null ? null : year.value,
          p_FORM_CODE: { "11": form7, "12": form8 },
          p_NOTINTIME: {
            "11": kind7.length !== 0 ? Number(kind7.includes(2)) : null,
            "12": kind8.length !== 0 ? Number(kind8.includes(2)) : null,
          },
          p_ISNOTEXISTS: {
            "11": kind7.length !== 0 ? Number(kind7.includes(3)) : null,
            "12": kind8.length !== 0 ? Number(kind8.includes(3)) : null,
          },
          p_ISWRONG: {
            "11": kind7.length !== 0 ? Number(kind7.includes(1)) : null,
            "12": kind8.length !== 0 ? Number(kind8.includes(1)) : null,
          },
          p_ISEXISTSREALLIC: activeLic === null ? null : Number(activeLic),
          p_AO_OKATO_IDUr: addressUR === null ? null : addressUR.value,
          p_AO_OKATO_IDObj: addressAO === null ? null : addressAO.value,
          p_KIND_NAME: kindJob === null ? null : kindJob.value,
          p_OBJCNT_FROM: countOStart === "" ? null : countOStart,
          p_OBJCNT_TO: countOEnd === "" ? null : countOEnd,
          p_ISEXISTSADMINFILE: activeAdm === null ? null : Number(activeAdm),
          p_ISEXISTSPOST: supplies === null ? null : Number(supplies),
          p_ISECONOMYACTIVITY: econActiv === null ? null : Number(econActiv),
          p_ADMINFILEEARLIER: dublVio === null ? null : Number(dublVio),
          p_ADMINEAR_FROM: countDublVioStart,
          p_ADMINEAR_TO: countDublVioEnd,
          p_ISHAVEMSKLICENSE:
            activeLicMos === null ? null : Number(activeLicMos),
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
  };

  const getServerSideDatasource = (count) => {
    return {
      getRows: async (params) => {
        if (count === 0) {
          params.success({
            rowData: [],
            rowCount: 0,
          });
          setLoad(false);
          return;
        }
        console.log("[Datasource] - rows requested by grid: ", params.request);
        const startRow = params.request.startRow;
        const endRow = params.request.endRow;
        setLoad(true);
        try {
          const result = await axios.post(
            variables.VIO_API_URL + `/get-violators-list`,
            {
              table_number: reestr_type,
              p_INN: inn === "" ? null : inn,
              p_INN_LENGTH: inn_length === null ? null : inn_length.value,
              p_KPP: kpp === "" ? null : kpp,
              p_REGION_CODE: region === null ? null : region.value,
              p_TITLE_MASK: title === "" ? null : title,
              p_ADDRESS_MASK: address === "" ? null : address,
              p_PERIOD_CODE: quarter === null ? null : quarter.code,
              p_PERIOD_YEAR: year === null ? null : year.value,
              p_FORM_CODE: { "11": form7, "12": form8 },
              p_NOTINTIME: {
                "11": kind7.length !== 0 ? Number(kind7.includes(2)) : null,
                "12": kind8.length !== 0 ? Number(kind8.includes(2)) : null,
              },
              p_ISNOTEXISTS: {
                "11": kind7.length !== 0 ? Number(kind7.includes(3)) : null,
                "12": kind8.length !== 0 ? Number(kind8.includes(3)) : null,
              },
              p_ISWRONG: {
                "11": kind7.length !== 0 ? Number(kind7.includes(1)) : null,
                "12": kind8.length !== 0 ? Number(kind8.includes(1)) : null,
              },
              p_ISEXISTSREALLIC: activeLic === null ? null : Number(activeLic),
              p_AO_OKATO_IDUr: addressUR === null ? null : addressUR.value,
              p_AO_OKATO_IDObj: addressAO === null ? null : addressAO.value,
              p_KIND_NAME: kindJob === null ? null : kindJob.value,
              p_OBJCNT_FROM: countOStart === "" ? null : countOStart,
              p_OBJCNT_TO: countOEnd === "" ? null : countOEnd,
              p_ISEXISTSADMINFILE:
                activeAdm === null ? null : Number(activeAdm),
              p_ISEXISTSPOST: supplies === null ? null : Number(supplies),
              p_ISECONOMYACTIVITY:
                econActiv === null ? null : Number(econActiv),
              p_ADMINFILEEARLIER: dublVio === null ? null : Number(dublVio),
              p_ADMINEAR_FROM: countDublVioStart,
              p_ADMINEAR_TO: countDublVioEnd,
              p_ISHAVEMSKLICENSE:
                activeLicMos === null ? null : Number(activeLicMos),

              page: startRow / (endRow - startRow),
              limit: endRow - startRow,
              order_by:
                params.request.sortModel.length === 0
                  ? null
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
          setError(e);
          params.fail();
        }
        setLoad(false);
      },
    };
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

  const onGridReady = useCallback((params) => {
    onSearchClick();
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
    console.log(sort_info);
    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/get-violators-list-xlsx`,
        {
          table_number: reestr_type,
          p_INN: inn === "" ? null : inn,
          p_INN_LENGTH: inn_length === null ? null : inn_length.value,
          p_KPP: kpp === "" ? null : kpp,
          p_REGION_CODE: region === null ? null : region.value,
          p_TITLE_MASK: title === "" ? null : title,
          p_ADDRESS_MASK: address === "" ? null : address,
          p_PERIOD_CODE: quarter === null ? null : quarter.code,
          p_PERIOD_YEAR: year === null ? null : year.value,
          p_FORM_CODE: { "11": form7, "12": form8 },
          p_NOTINTIME: {
            "11": kind7.length !== 0 ? Number(kind7.includes(2)) : null,
            "12": kind8.length !== 0 ? Number(kind8.includes(2)) : null,
          },
          p_ISNOTEXISTS: {
            "11": kind7.length !== 0 ? Number(kind7.includes(3)) : null,
            "12": kind8.length !== 0 ? Number(kind8.includes(3)) : null,
          },
          p_ISWRONG: {
            "11": kind7.length !== 0 ? Number(kind7.includes(1)) : null,
            "12": kind8.length !== 0 ? Number(kind8.includes(1)) : null,
          },
          p_ISEXISTSREALLIC: activeLic === null ? null : Number(activeLic),
          p_AO_OKATO_IDUr: addressUR === null ? null : addressUR.value,
          p_AO_OKATO_IDObj: addressAO === null ? null : addressAO.value,
          p_KIND_NAME: kindJob === null ? null : kindJob.value,
          p_OBJCNT_FROM: countOStart === "" ? null : countOStart,
          p_OBJCNT_TO: countOEnd === "" ? null : countOEnd,
          p_ISEXISTSADMINFILE: activeAdm === null ? null : Number(activeAdm),
          p_ISEXISTSPOST: supplies === null ? null : Number(supplies),
          p_ISECONOMYACTIVITY: econActiv === null ? null : Number(econActiv),
          p_ADMINFILEEARLIER: dublVio === null ? null : Number(dublVio),
          p_ADMINEAR_FROM: countDublVioStart,
          p_ADMINEAR_TO: countDublVioEnd,
          p_ISHAVEMSKLICENSE:
            activeLicMos === null ? null : Number(activeLicMos),

          order_by: sort_info === null ? null : sort_info.colId,
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
      link.setAttribute("download", "Нарушители.xlsx"); //or any other extension
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

  const setForm = (form_num, value) => {
    let param = null;
    let func = null;
    if (form_num === 7) {
      func = setKind7;
      param = kind7;
    } else {
      func = setKind8;
      param = kind8;
    }
    if (param === null || func === null) return;

    if (value === null) {
      func([]);
      return;
    }
    if (param.includes(value)) {
      const new_data = param.map((kind) => {
        if (kind !== value) {
          return kind;
        }
      });
      func(new_data);
    } else {
      const new_data = param.map((kind) => {
        return kind;
      });
      new_data.push(value);
      func(new_data);
    }
  };

  const addViolation = async () => {
    if (createInn === "" || createInn == null) {
      alert("Заполните ИНН!");
      return false;
    }
    if (createForm === "" || createForm == null) {
      alert("Выберите форму декларции!");
      return false;
    }
    if (createReason === "" || createReason == null) {
      alert("Выберите причину!");
      return false;
    }
    if (createQuarter === "" || createQuarter == null) {
      alert("Выберите квартал!");
      return;
    }
    if (createYear === "" || createYear == null) {
      alert("Выберите Год!");
      return;
    }
    if (createDate === "" || createDate == null) {
      alert("Заполните Дату!");
      return false;
    }
    if (createNote === "" || createNote == null) {
      alert("Заполните Комментарий!");
      return false;
    }
    if (createDoc === "" || createDoc == null) {
      alert("Прикрепите файл!");
      return false;
    }

    setLoad(true);
    let res = true;
    const formData = new FormData();
    formData.append("file", createDoc, createDoc.name);
    console.log(formData.get("p_BASEDOCDATA"));
    console.log(createInn);
    try {
      const result = await axios.post(
        variables.VIO_API_URL +
          `/add-declarant-violation?p_REESTR_TYPE=${reestr_type}&p_BASEDOCNUMBER=${createId}&p_INN=${
            createInn.inn
          }&p_NAME=${createInn.title}&p_KPP=${
            createInn.kpp
          }&p_MODE=${createReason}&p_PERIOD_UCODE=${createYear.value}${
            createQuarter.value
          }&p_BASEDOCDATE=${
            createDate === "" || createDate === null
              ? null
              : createDate.toISOString().replace("000Z", "300Z")
          }
          &p_NOTE=${createNote}&p_USER_NAME=${user}&p_FORM_CODE=${
            createForm.value
          }`,
        formData,
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

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    console.log(selectedRows);
    setSelectedRows(
      selectedRows?.map((i) => [
        i.inn,
        i.period_code,
        i.period_year,
        i.violatormask,
      ])
    );
  }, []);

  const deleteViolation = async () => {
    console.log(selRows);
    if (deleteReason === "" || deleteReason == null) {
      alert("Выберите причину!");
      return false;
    }
    if (deleteForm === "" || deleteForm == null) {
      alert("Выберите форму декларации!");
      return false;
    }
    if (deleteException === "" || deleteException == null) {
      alert("Заполните основание!");
      return false;
    }
    if (selRows.length === 0) {
      alert("Выберите нарушителей!");
      return false;
    }

    setLoad(true);
    let result = true;
    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/delete-declarant-violation`,
        {
          p_REESTR_TYPE: reestr_type,
          p_FORM_CODE: deleteForm.value,
          p_DEL_REASON: deleteReason,
          p_DEL_ADMINS: deleteAdminFiles,
          p_NOTE: deleteException.code,
          violaters: selRows,
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
    } catch (e) {
      console.log(e);
      setError(e);
      result = false;
    }
    setLoad(false);
    return result;
  };

  const createFile = async () => {
    if (fileReason === "" || fileReason == null) {
      alert("Выберите причину!");
      return false;
    }
    if (selRows.length === 0) {
      alert("Выберите нарушителей!");
      return false;
    }

    setLoad(true);
    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/insert-admin-case`,
        {
          p_REESTR_TYPE: reestr_type,
          IsWrong: fileReason,
          violaters: selRows,
          user: user,
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
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
    return true;
  };

  const updateReestrType = async (number) => {
    setReestrType(number);
    setCount(0);
    setData([]);
    console.log(gridRef.current);
    var datasource = getServerSideDatasource(0);
    gridRef.current.api.setGridOption("serverSideDatasource", datasource);
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
      <Breadcrumb pageName="Реестр нарушителей" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12">
            <nav>
              <ol className="flex items-center gap-2">
                <li
                  className={
                    reestr_type === 1
                      ? "inline-flex items-center justify-center rounded-md border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-opacity-90"
                      : "inline-flex items-center justify-center rounded-md border border-black py-3 px-6 text-center font-medium text-black hover:bg-opacity-90"
                  }>
                  <a href="#" onClick={() => updateReestrType(1)}>
                    Нарушители лицензиаты
                  </a>
                </li>
                <li
                  className={
                    reestr_type === 2
                      ? "inline-flex items-center justify-center rounded-md border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-opacity-90"
                      : "inline-flex items-center justify-center rounded-md border border-black py-3 px-6 text-center font-medium text-black hover:bg-opacity-90"
                  }>
                  <a href="#" onClick={() => updateReestrType(2)}>
                    Нарушители торговцы пивом
                  </a>
                </li>
                <li
                  className={
                    reestr_type === 3
                      ? "inline-flex items-center justify-center rounded-md border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-opacity-90"
                      : "inline-flex items-center justify-center rounded-md border border-black py-3 px-6 text-center font-medium text-black hover:bg-opacity-90"
                  }>
                  <a href="#" onClick={() => updateReestrType(3)}>
                    Нарушители торговцы спиртосодержащей продукции
                  </a>
                </li>
              </ol>
            </nav>
          </div>
          {/*Карточка 1*/}
          <div className="col-span-3">
            <Card name="Период">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Квартал
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={quarters}
                        value={quarter}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setQuarter(e)}
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber">
                      Год
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={years}
                        value={year}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setYear(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          {/*Карточка 2*/}
          <div className="col-span-9">
            <Card name="Сведения о юр.лице">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <NumberInput
                      label={"ИНН"}
                      value={inn}
                      name={"INN"}
                      id={"INN"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseInn(e)}
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Длина ИНН
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={lengths}
                        value={inn_length}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setLength(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <TextInput
                      label={"КПП"}
                      type={"text"}
                      value={kpp}
                      name={"KPP"}
                      id={"KPP"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseKpp(e)}
                    />
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      АО Москвы (адрес объекта)
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={okato_list}
                        value={addressAO}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setAddressAO(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      АО Москвы (юр. адрес)
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={okato_list}
                        value={addressUR}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setAddressUR(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Регион
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={region_list}
                        value={region}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setRegion(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <TextInput
                      label={"Наименование"}
                      type={"text"}
                      value={title}
                      name={"Title"}
                      id={"Title"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setTitle(e)}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <TextInput
                      label={"Юридический адрес"}
                      type={"text"}
                      value={address}
                      name={"address"}
                      id={"address"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setAddress(e)}
                    />
                  </div>
                </div>
              </form>
            </Card>
          </div>
          {/*Карточка 3*/}
          <div className="col-span-12">
            <Card name="Сведения об экономической деятельности">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Экономическая деятельность
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"econActiv_null"}
                        id={"econActiv_null"}
                        value={econActiv === null}
                        onChange={() => setEconActiv(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"econActiv_true"}
                        id={"econActiv_true"}
                        value={econActiv === true}
                        onChange={() => setEconActiv(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"econActiv_false"}
                        id={"econActiv_false"}
                        value={econActiv === false}
                        onChange={() => setEconActiv(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Тип работ
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={jobs}
                        value={kindJob}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setKindJob(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/6">
                    <NumberInput
                      label={"Кол-во объектов с"}
                      type={"number"}
                      value={countOStart}
                      name={"countOStart"}
                      id={"countOStart"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setCountOStart(e)}
                    />
                  </div>
                  <div className="w-full sm:w-1/6">
                    <NumberInput
                      label={"по"}
                      type={"number"}
                      value={countOEnd}
                      name={"countOEnd"}
                      id={"countOEnd"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setCountOEnd(e)}
                    />
                  </div>

                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Действующие лицензии
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"activeLic_null"}
                        id={"activeLic_null"}
                        value={activeLic === null}
                        onChange={() => setActiveLic(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"activeLic_true"}
                        id={"activeLic_true"}
                        value={activeLic === true}
                        onChange={() => setActiveLic(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"activeLic_false"}
                        id={"activeLic_false"}
                        value={activeLic === false}
                        onChange={() => setActiveLic(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Действующие московские лицензии
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"activeLicMos_null"}
                        id={"activeLicMos_null"}
                        value={activeLicMos === null}
                        onChange={() =>
                          setActiveLicMos(null)
                        }></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"activeLicMos_true"}
                        id={"activeLicMos_true"}
                        value={activeLicMos === true}
                        onChange={() =>
                          setActiveLicMos(true)
                        }></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"activeLicMos_false"}
                        id={"activeLicMos_false"}
                        value={activeLicMos === false}
                        onChange={() =>
                          setActiveLicMos(false)
                        }></CheckboxDefault>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          {/*Карточка 4*/}
          <div className="col-span-12">
            <Card
              name="Общие сведения о нарушениях
">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Повторные нарушения
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"dublVio_null"}
                        id={"dublVio_null"}
                        value={dublVio === null}
                        onChange={() => setDublVio(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"dublVio_true"}
                        id={"dublVio_true"}
                        value={dublVio === true}
                        onChange={() => setDublVio(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"dublVio_false"}
                        id={"dublVio_false"}
                        value={dublVio === false}
                        onChange={() => setDublVio(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full w-1/10">
                    <NumberInput
                      label={"Кол-во повторных нарушений с"}
                      type={"number"}
                      value={countDublVioStart}
                      name={"countDublVioStart"}
                      id={"countDublVioStart"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setCountDublVioStart(e)}
                    />
                  </div>
                  <div className="w-full w-1/10">
                    <NumberInput
                      label={"по"}
                      type={"number"}
                      value={countDublVioEnd}
                      name={"countDublVioEnd"}
                      id={"countDublVioEnd"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setCountDublVioEnd(e)}
                    />
                  </div>
                  {/*
                  <div className="w-full w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Недостоверные сведения
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"fakeInfo_null"}
                        id={"fakeInfo_null"}
                        value={fakeInfo === null}
                        onChange={() => setFakeInfo(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"fakeInfo_true"}
                        id={"fakeInfo_true"}
                        value={fakeInfo === true}
                        onChange={() => setFakeInfo(true)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"fakeInfo_false"}
                        id={"fakeInfo_false"}
                        value={fakeInfo === false}
                        onChange={() => setFakeInfo(false)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  */}
                  <div className="w-full w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Активные адм. дела
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"activeAdm_null"}
                        id={"activeAdm_null"}
                        value={activeAdm === null}
                        onChange={() => setActiveAdm(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"activeAdm_true"}
                        id={"activeAdm_true"}
                        value={activeAdm === true}
                        onChange={() => setActiveAdm(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"activeAdm_false"}
                        id={"activeAdm_false"}
                        value={activeAdm === false}
                        onChange={() => setActiveAdm(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Задолженность по оплате штрафов
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"paid_null"}
                        id={"paid_null"}
                        value={paid === null}
                        onChange={() => setPaid(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Частичная задолженность"}
                        name={"paid_null_1"}
                        id={"paid_null_1"}
                        value={paid === 1}
                        onChange={() => setPaid(1)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"paid_true"}
                        id={"paid_true"}
                        value={paid === 2}
                        onChange={() => setPaid(2)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"paid_false"}
                        id={"paid_false"}
                        value={paid === 3}
                        onChange={() => setPaid(3)}></CheckboxDefault>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>

          {/*Карточка 5*/}
          <div className="col-span-12">
            <Card name="Нарушения по декларациям">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Декларация по форме 7
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"form7_null"}
                        id={"form7_null"}
                        value={form7 === null}
                        onChange={() => setForm7(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"form7_true"}
                        id={"form7_true"}
                        value={form7 === true}
                        onChange={() => setForm7(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"form7_false"}
                        id={"form7_false"}
                        value={form7 === false}
                        onChange={() => setForm7(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Вид нарушения по форме 7
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"kind7_null"}
                        id={"kind7_null"}
                        value={kind7.length === 0}
                        onChange={() => setForm(7, null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Представлена с недостоверными данными"}
                        name={"kind7_2"}
                        id={"kind7_2"}
                        value={kind7.includes(1)}
                        onChange={() => setForm(7, 1)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Представлена с нарушением сроков"}
                        name={"kind7_3"}
                        id={"kind7_3"}
                        value={kind7.includes(2)}
                        onChange={() => setForm(7, 2)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Не представлена"}
                        name={"kind7_4"}
                        id={"kind7_4"}
                        value={kind7.includes(3)}
                        onChange={() => setForm(7, 3)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Декларация по форме 8
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"form8_null"}
                        id={"form8_null"}
                        value={form8 === null}
                        onChange={() => setForm8(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"form8_true"}
                        id={"form8_true"}
                        value={form8 === true}
                        onChange={() => setForm8(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"form8_false"}
                        id={"form8_false"}
                        value={form8 === false}
                        onChange={() => setForm8(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Вид нарушения по форме 8
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"kind8_null"}
                        id={"kind8_null"}
                        value={kind8.length === 0}
                        onChange={() => setForm(8, null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Представлена с недостоверным данным"}
                        name={"kind8_2"}
                        id={"kind8_2"}
                        value={kind8.includes(1)}
                        onChange={() => setForm(8, 1)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Представлена с нарушением сроков"}
                        name={"kind8_3"}
                        id={"kind8_3"}
                        value={kind8.includes(2)}
                        onChange={() => setForm(8, 2)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Не представлена"}
                        name={"kind8_4"}
                        id={"kind8_4"}
                        value={kind8.includes(3)}
                        onChange={() => setForm(8, 3)}></CheckboxDefault>
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
            name="Список нарушителей"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={VioLicDataColumns}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    rowModelType={"serverSide"}
                    rowSelection={"multiple"}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
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
                <button type="button" title="Выгрузить в Excel">
                  <IconButtonDownload onClick={() => Download()} />
                </button>
                <button
                  type="button"
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  {" "}
                  <DefaultModal
                    title={"Удаление из списка нарушителей"}
                    textbutton={"Удаление нарушителя"}
                    onClickText={"Удалить"}
                    children={
                      <>
                        <form action="#">
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                Основание удаления
                              </label>
                              <div className="relative z-40">
                                <AsyncSelectCustom
                                  value={deleteException}
                                  placeholder={"Не заполнено"}
                                  onChange={(e) => setDeleteException(e)}
                                  queryChange={filteredExceptions}
                                  placeholder={"Введите Основание"}
                                  prepareRawInput={null}
                                  displayField={"name"}
                                  filterLimit={-1}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                Форма
                              </label>
                              <div className="relative">
                                <SelectCustom
                                  options={forms}
                                  value={deleteForm}
                                  placeholder={"Не заполнено"}
                                  onChange={(e) => setDeleteForm(e)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full">
                              <CheckboxDefault
                                label={
                                  "Удалить сформированные административные дела"
                                }
                                name={"deleteAdmin"}
                                id={"deleteAdmin"}
                                value={deleteAdminFiles}
                                onChange={() =>
                                  setDeleteAdminFiles(!deleteAdminFiles)
                                }></CheckboxDefault>
                            </div>
                          </div>
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full">
                              <CheckboxDefault
                                label={"Оба вида нарушения"}
                                name={"deleteReason0"}
                                id={"deleteReason0"}
                                value={deleteReason === 2}
                                onChange={() =>
                                  setDeleteReason(2)
                                }></CheckboxDefault>
                              <CheckboxDefault
                                label={"Нарушение по срокам/Не предоставлена"}
                                name={"deleteReason1"}
                                id={"deleteReason1"}
                                value={deleteReason === 0}
                                onChange={() =>
                                  setDeleteReason(0)
                                }></CheckboxDefault>
                              <CheckboxDefault
                                label={"Недостоверные сведения"}
                                name={"deleteReason2"}
                                id={"deleteReason2"}
                                value={deleteReason === 1}
                                onChange={() =>
                                  setDeleteReason(1)
                                }></CheckboxDefault>
                            </div>
                          </div>
                        </form>
                      </>
                    }
                    onClick={() => deleteViolation()}></DefaultModal>
                </button>
                <button
                  type="button"
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  <DefaultModal
                    title={"Формирование дела"}
                    textbutton={"Формирование дела"}
                    onClickText={"Сформировать"}
                    children={
                      <>
                        <form action="#">
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full">
                              <CheckboxDefault
                                label={"Нарушение по срокам"}
                                name={"fileReason1"}
                                id={"fileReason1"}
                                value={fileReason === 0}
                                onChange={() =>
                                  setFileReason(0)
                                }></CheckboxDefault>
                              <CheckboxDefault
                                label={"Недостоверные сведения"}
                                name={"fileReason2"}
                                id={"fileReason2"}
                                value={fileReason === 1}
                                onChange={() =>
                                  setFileReason(1)
                                }></CheckboxDefault>
                            </div>
                          </div>
                        </form>
                      </>
                    }
                    onClick={() => createFile()}></DefaultModal>{" "}
                </button>
                {/* <ButtonPrimary>Сформировать предостережение</ButtonPrimary> */}
                <button
                  type="button"
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  <DefaultModal
                    title={"Добавление нарушителя"}
                    textbutton={"Добавление нарушителя"}
                    onClickText={"Добавить"}
                    children={
                      <>
                        <form action="#">
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full sm:w-1/2">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                ИНН
                              </label>
                              <div className="relative z-40">
                                <AsyncSelectCustom
                                  value={createInn}
                                  placeholder={"Не заполнено"}
                                  onChange={(e) => setCreateInnName(e)}
                                  queryChange={getInnName}
                                  placeholder={"Введите ИНН"}
                                  prepareRawInput={parseCreateInn}
                                  displayField={"title"}
                                  filterLimit={3}
                                />
                              </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                              {createTitle ? (
                                <>
                                  <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="fullName">
                                    Наименование
                                  </label>
                                  <TextInput
                                    type={"text"}
                                    value={createTitle}
                                    name={"createTitle"}
                                    id={"createTitle"}
                                    placeholder={"Не заполнено"}
                                    disabled={true}
                                  />
                                </>
                              ) : null}
                            </div>
                          </div>

                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full sm:w-1/2">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                Форма
                              </label>
                              <div className="relative">
                                <SelectCustom
                                  options={forms}
                                  value={createForm}
                                  placeholder={"Не заполнено"}
                                  onChange={(e) => setCreateForm(e)}
                                />
                              </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                Квартал
                              </label>
                              <div className="relative">
                                <SelectCustom
                                  options={quarters.slice(1)}
                                  value={createQuarter}
                                  placeholder={"Не заполнено"}
                                  onChange={(e) => setCreateQuarter(e)}
                                />
                              </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                Год
                              </label>
                              <div className="relative">
                                <SelectCustom
                                  options={years.slice(1)}
                                  value={createYear}
                                  placeholder={"Не заполнено"}
                                  onChange={(e) => setCreateYear(e)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full sm:w-1/3">
                              <DateDefaultInput
                                label={"Дата документа"}
                                selected={createDate}
                                placeholder={"dd.MM.yyyy"}
                                onChange={(date) =>
                                  setCreateDate(date)
                                }></DateDefaultInput>
                            </div>
                            <div className="w-full sm:w-1/3">
                              <NumberInput
                                label={"Номер документа"}
                                type={"number"}
                                value={createId}
                                name={"createId"}
                                id={"createId"}
                                placeholder={"Не заполнено"}
                                onChange={(e) => setCreateId(e)}
                              />
                            </div>
                            <div className="w-full sm:w-1/3">
                              <TextInput
                                label={"Комментарий"}
                                type={"text"}
                                value={createNote}
                                name={"createNote"}
                                id={"createNote"}
                                placeholder={"Не заполнено"}
                                onChange={(e) => setCreateNote(e)}
                              />
                            </div>
                          </div>
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full sm:w-1/3">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                Документ
                              </label>
                              <DocumentsInput
                                onChange={setCreateDoc}
                                fileInput={fileInput}
                              />
                            </div>
                          </div>
                          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                            <div className="w-full">
                              <CheckboxDefault
                                label={"Не предоставлена"}
                                name={"createReason0"}
                                id={"createReason0"}
                                value={createReason === 0}
                                onChange={() =>
                                  setCreateReason(0)
                                }></CheckboxDefault>
                              <CheckboxDefault
                                label={"Нарушение по срокам"}
                                name={"createReason1"}
                                id={"createReason1"}
                                value={createReason === -1}
                                onChange={() =>
                                  setCreateReason(-1)
                                }></CheckboxDefault>
                              <CheckboxDefault
                                label={"Недостоверные сведения"}
                                name={"createReason2"}
                                id={"createReason2"}
                                value={createReason === 1}
                                onChange={() =>
                                  setCreateReason(1)
                                }></CheckboxDefault>
                            </div>
                          </div>
                        </form>
                      </>
                    }
                    onClick={() => addViolation()}></DefaultModal>{" "}
                </button>
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

export default ReestrViolators;
