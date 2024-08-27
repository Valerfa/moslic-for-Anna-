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
import MultiSelectCustom from "../../components/UI/General/Inputs/MultiSelect";
import AsyncSelectCustom from "../../components/UI/General/Inputs/AsyncSelect";
import DocumentsInput from "../../components/UI/General/Inputs/DocumentsInput";

//Модальное окно
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";

import {
  variables,
  AG_GRID_LOCALE_RU,
  DecDataColumns,
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

const Declarants = () => {
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
  const [forms, setForms] = useState([]);
  const [periods_ucodes, setPeriods] = useState([]);

  // filters
  const [quarter, setQuarter] = useState(null);
  const [period_ucode, setPeriod] = useState([]);
  const [year, setYear] = useState(null);

  const [inn, setInn] = useState("");
  const [inn_length, setLength] = useState(lengths[0]);
  const [kpp, setKpp] = useState("");
  const [addressAO, setAddressAO] = useState(null);
  const [addressUr, setAddressUr] = useState(null);
  const [region, setRegion] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");

  const [econActiv, setEconActiv] = useState(null);
  const [kindJob, setKindJob] = useState(jobs[0]);
  const [countQStart, setCountQStart] = useState("");
  const [countQEnd, setCountQEnd] = useState("");
  const [supplies, setSupplies] = useState(null);
  const [countOStart, setCountOStart] = useState("");
  const [countOEnd, setCountOEnd] = useState("");
  const [activeLic, setActiveLic] = useState(null);
  const [activeLicMos, setActiveLicMos] = useState(null);

  const [form, setForm] = useState(null);
  const [isnotexists, setExists] = useState(null);
  const [notintime, setTime] = useState(null);
  const [kind, setKind] = useState(null);

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);
  const [funcId, setFuncId] = useState(null);

  useEffect(() => {
    getOkato();
    getRegions();
    getQuarters();
    getYears();
    getFilters();
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

  const getFilters = async () => {
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
      setForms(result.data.forms);
      setForm(result.data.forms[0]);
      setPeriods(result.data.periods);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getRegions = async () => {
    try {
      const result = await axios.get(variables.VIO_API_URL + `/regions`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
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
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setOkato([
        { value: null, name: "Не важно", code: null },
        ...result.data.map((i) => ({ value: i.code, name: i.name })),
      ]);
      setAddressAO({ value: null, name: "Не важно", code: null });
      setAddressUr({ value: null, name: "Не важно", code: null });
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
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setQuarters(
        result.data?.map((i) => ({
          value: i.quarter,
          name: i.period_name,
          code: i.period_code,
        }))
      );
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
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setYears(result.data?.map((i) => ({ value: i.year, name: i.year })));
      setYear(getCurrentYear());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const onSearchClick = async () => {
    if (
      (quarter.value === null || year.value === null) &&
      period_ucode.length === 0
    ) {
      alert("Выберите квартал и/или год");
      return;
    }
    if (
      (quarter.value === null || year.value === null) &&
      period_ucode.length === 0
    ) {
      alert("Выберите квартал и/или год");
      return;
    }
    setLoad(true);

    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/get-declarant-count`,
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
          p_PERIOD_UCODES: period_ucode,
          p_FORM_CODE: form === null ? null : form.value,
          p_DECLARATION_FORM: kind === null ? null : kind,
          p_INTIME: notintime === null ? null : Number(notintime),
          p_ISEXISTS: isnotexists === null ? null : Number(isnotexists),
          p_ISNOTEXISTS: isnotexists === null ? null : Number(!isnotexists),
          p_ISEXISTSREALLIC: activeLic === null ? null : Number(activeLic),
          p_LIC_MSK: activeLicMos === null ? null : Number(activeLicMos),
          p_AO_OKATO_IDUr: addressUr === null ? null : addressUr.value,
          p_AO_OKATO_IDObj: addressAO === null ? null : addressAO.value,
          p_KIND_NAME: kindJob === null ? null : kindJob.value,
          p_OBJCNT_FROM: countOStart === "" ? null : countOStart,
          p_OBJCNT_TO: countOEnd === "" ? null : countOEnd,
          p_CNT_FROM: countQStart === "" ? null : countQStart,
          p_CNT_TO: countQEnd === "" ? null : countQEnd,
          p_ISEXISTSPOST: supplies === null ? null : Number(supplies),
          p_ISECONOMYACTIVITY: econActiv === null ? null : Number(econActiv),
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
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      var count = result.data.total_count;
      if (count > 0) {
        setCount(count);
        setFuncId(result.data.funcId);
      }
      console.log("this");
      var datasource = getServerSideDatasource(count, result.data.funcId);
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getServerSideDatasource = (count, id_set) => {
    return {
      getRows: async (params) => {
        if (count === 0 && id_set === null) {
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
            variables.VIO_API_URL + `/get-declarant-list`,
            {
              table_number: reestr_type,
              id_set: id_set,
              p_OBJCNT_FROM: countOStart === "" ? null : countOStart,
              p_OBJCNT_TO: countOEnd === "" ? null : countOEnd,
              p_CNT_FROM: countQStart === "" ? null : countQStart,
              p_CNT_TO: countQEnd === "" ? null : countQEnd,
              p_PERIOD_UCODES: period_ucode,

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
          if (result.success) throw Error(result.data.error);
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
        variables.VIO_API_URL + `/get-declarant-list-xlsx`,
        {
          table_number: reestr_type,
          id_set: funcId,
          p_OBJCNT_FROM: countOStart === "" ? null : countOStart,
          p_OBJCNT_TO: countOEnd === "" ? null : countOEnd,
          p_CNT_FROM: countQStart === "" ? null : countQStart,
          p_CNT_TO: countQEnd === "" ? null : countQEnd,
          p_PERIOD_UCODES: period_ucode,

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
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      const fileType = result.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      console.log(fileType);
      link.setAttribute("download", "Декларанты.xlsx"); //or any other extension
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.log(e);
      setError(e.response.data.error);
    }
    setLoad(false);
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
      <Breadcrumb pageName="Список декларантов" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-10">
            <nav>
              <ol className="flex items-center gap-2">
                <li
                  className={
                    reestr_type === 1
                      ? "inline-flex items-center justify-center rounded-md border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-opacity-90"
                      : "inline-flex items-center justify-center rounded-md border border-black py-3 px-6 text-center font-medium text-black hover:bg-opacity-90"
                  }>
                  <a href="#" onClick={() => updateReestrType(1)}>
                    Декларанты лицензиаты
                  </a>
                </li>
                <li
                  className={
                    reestr_type === 2
                      ? "inline-flex items-center justify-center rounded-md border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-opacity-90"
                      : "inline-flex items-center justify-center rounded-md border border-black py-3 px-6 text-center font-medium text-black hover:bg-opacity-90"
                  }>
                  <a href="#" onClick={() => updateReestrType(2)}>
                    Декларанты торговцы пивом
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
                  <div className="flex flex-col gap-5.5 sm:flex-row">
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
                  </div>
                  <div className="flex flex-col gap-5.5 sm:flex-row">
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
                  <div className="flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <NumberInput
                        label={"Кол-во кварталов с"}
                        type={"number"}
                        value={countQStart}
                        name={"countOStart"}
                        id={"countOStart"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setCountQStart(e)}
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <NumberInput
                        label={"по"}
                        type={"number"}
                        value={countQEnd}
                        name={"countOEnd"}
                        id={"countOEnd"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setCountQEnd(e)}
                      />
                    </div>
                    {/*<div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Абсолютный квартал
                    </label>
                    <div className="relative">
                      <MultiSelectCustom
                        options={periods_ucodes}
                        value={period_ucode}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setPeriod(e)}
                      />
                    </div>
                  </div>*/}
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
                    <TextInput
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
                        value={addressUr}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setAddressUr(e)}
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
          <div className="col-span-6">
            <Card name="Сведения об экономической деятельности">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
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
                  <div className="w-full sm:w-1/4">
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
                  <div className="w-full sm:w-1/4">
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
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Экон-ая деятельность
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

                  <div className="w-full sm:w-1/4">
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
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Регион лизензирования
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
                        label={"Москва"}
                        name={"activeLicMos_true"}
                        id={"activeLicMos_true"}
                        value={activeLicMos === true}
                        onChange={() =>
                          setActiveLicMos(true)
                        }></CheckboxDefault>
                      <CheckboxDefault
                        label={"Иные регионы"}
                        name={"activeLicMos_false"}
                        id={"activeLicMos_false"}
                        value={activeLicMos === false}
                        onChange={() =>
                          setActiveLicMos(false)
                        }></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Поставки
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"supplies_null"}
                        id={"supplies_null"}
                        value={supplies === null}
                        onChange={() => setSupplies(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"supplies_true"}
                        id={"supplies_true"}
                        value={supplies === true}
                        onChange={() => setSupplies(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"supplies_false"}
                        id={"supplies_false"}
                        value={supplies === false}
                        onChange={() => setSupplies(false)}></CheckboxDefault>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          {/*Карточка 4*/}
          <div className="col-span-6">
            <Card name="Сведения о декларациях">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Форма
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={forms}
                        value={form}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setForm(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Представлена?
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"isnotexists_null"}
                        id={"isnotexists_null"}
                        value={isnotexists === null}
                        onChange={() => setExists(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Да"}
                        name={"isnotexists_true"}
                        id={"isnotexists_true"}
                        value={isnotexists === true}
                        onChange={() => setExists(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"isnotexists_false"}
                        id={"isnotexists_false"}
                        value={isnotexists === false}
                        onChange={() => setExists(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Представлена вовремя?
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"notintime_null"}
                        id={"notintime_null"}
                        value={notintime === null}
                        onChange={() => setTime(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Да"}
                        name={"notintime_true"}
                        id={"notintime_true"}
                        value={notintime === true}
                        onChange={() => setTime(true)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"notintime_false"}
                        id={"notintime_false"}
                        value={notintime === false}
                        onChange={() => setTime(false)}></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName">
                      Вид
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"kind_null"}
                        id={"kind_null"}
                        value={kind === null}
                        onChange={() => setKind(null)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Электронный вид"}
                        name={"kind_null_1"}
                        id={"kind_null_1"}
                        value={kind === 1}
                        onChange={() => setKind(1)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Бумажный вид"}
                        name={"kind_true"}
                        id={"kind_true"}
                        value={kind === 2}
                        onChange={() => setKind(2)}></CheckboxDefault>
                      <CheckboxDefault
                        label={"Эл. и бум. вид"}
                        name={"kind_false"}
                        id={"kind_false"}
                        value={kind === 3}
                        onChange={() => setKind(3)}></CheckboxDefault>
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
            name="Список декларантов"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={DecDataColumns}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    rowModelType={"serverSide"}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
                    onGridReady={onGridReady}
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
                <IconButtonDownload onClick={() => Download()} />
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

export default Declarants;
