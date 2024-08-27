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

import Tabs from "../../components/Tabs/1.Tabs";
import { Tab } from "@headlessui/react";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import DocumentsInput from "../../components/UI/General/Inputs/DocumentsInput";

//Модальное окно
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";

import {
  variables,
  AG_GRID_LOCALE_RU,
  VioLicDataColumns,
  showDate,
  getCurrentYear,
  getCurrentQuarter,
} from "../../variables";
import ButtonDanger from "../../components/UI/General/Buttons/ButtonDanger";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import CustomPopover from "../../components/UI/General/Inputs/Popover";

// Иконки
import { BookmarkSlashIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/outline";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import CellRender1 from "./AdminCasesCell1.tsx";
import IconButtonX from "../../components/UI/General/Buttons/IconButtonX.tsx";
import IconButtonUpload from "../../components/UI/General/Buttons/IconButtonUpload.tsx";
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide.tsx";

registerLocale("ru", ru);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const filter_use = false;

const AdmCases = () => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  // upload file
  const fileInput = createRef();
  const [createDoc, setCreateDoc] = useState(null);

  // form admin penalty
  const [penaltyState, setPenaltyState] = useState(null);
  const [penaltyAlert, setPenaltyAlert] = useState(false);
  const [penaltyAmount, setPenaltyAmount2] = useState(null);
  const [penaltyDate, setPenaltyDate] = useState("");
  const [penaltyDate2, setPenaltyDate2] = useState("");
  const [penaltyStartDate, setPenaltyStartDate] = useState("");

  const [is_open_filters, setFilters] = useState(true);
  const [limit] = useState(1);

  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [doc_types, setTypes] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [paydoc_types, setPayDocTypes] = useState([]);
  const [doc_types_dict, setTypesDict] = useState({
    "8": "Акт",
    "1": "Извещение по ст.15.13",
    "2": "Определение",
    "3": "Определение о продлении срока административного расследования",
    "4": "Постановление о назначении административного наказания",
    "5": "Постановление о прекращении",
    "6": "Протокол об административном правонарушении по ст.15-13",
    "7": "Уведомление о сроке оплаты административного штрафа",
    "14": "Сопроводительная опись",
    "10": "Протокол об административном правонарушении по ст.20.25",
    "11": "Извещение по ст.20.25",
    "13": "Доверенность на дело об административном правонарушении",
    "12": "Сопроводительное письмо",
    "15": "Постановление о возбуждении исполнительного производства",
    "16": "Определение о замене",
    "17": "Определение об отказе в возбуждении дела по статье 20.25",
    "18": "Постановление о прекращении производства по делу",
    "19": "Решение о проведении документарной проверки",
    "20": "Акт документарной проверки по декларированию",
    "21": "Предостережение",
  });

  // data columns
  const [dataColumns] = useState([
    {
      enableValue: true,
      field: "operations",
      headerName: "Статус и функции",
      resizable: true,
      sortable: false,
      minWidth: 350,
      filter: filter_use ? "agSetColumnFilter" : null,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      autoHeight: true,
      cellRenderer: (params) => {
        return CellRender1(params, createPenalty, paidPenalty, closeCase);
      },
    },
    {
      enableValue: true,
      field: "base_number",
      headerName: "Рег. номер",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agNumberColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "period_ucode",
      headerName: "Период",
      resizable: true,
      sortable: false,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return (
          <div>
            {params.getValue() % 10} квартал{" "}
            {String(params.getValue()).slice(0, 4)} год
          </div>
        );
      },
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "full_subject_name",
      headerName: "Название",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
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
      field: "doc_1513",
      headerName: "Документы 15.13",
      resizable: true,
      sortable: false,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        if (params.data.is_penalty === 0) return <div></div>;
        const id_list = [1, 2, 3, 4, 5, 6, 8, 19, 20, 21];
        const new_data = [];
        for (let doc_id of id_list) {
          if (params.data[`doc_id${doc_id}`] !== null)
            new_data.push({
              type: doc_id,
              type_name: doc_types_dict[`${doc_id}`],
              id: params.data[`doc_id${doc_id}`],
              number: params.data[`doc_number${doc_id}`],
              date: params.data[`doc_date${doc_id}`],
            });
        }
        return (
          <div>
            <ul>
              {new_data?.map((doc, indx) => (
                <li key={`1513${indx}_doc_id${doc.type}`}>
                  {doc.type_name} {doc.number} от {showDate(doc.date)}
                </li>
              ))}
            </ul>
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "operations2",
      headerName: "Операции",
      resizable: true,
      sortable: false,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        if (params.data.is_penalty === 0) return <div></div>;
        const id_list = [1, 2, 3, 4, 5, 6, 8, 19, 20, 21];
        const new_data = [];
        for (let doc_id of id_list) {
          if (params.data[`doc_id${doc_id}`] !== null)
            new_data.push({
              type: doc_id,
              id: params.data[`doc_id${doc_id}`],
              name: "Операции",
            });
        }
        return (
          <div>
            <ul>
              {new_data?.map((doc, indx) => (
                <li key={`2025${indx}_oper_doc_id${doc.type}`}>
                  <div className="flex gap-2 py-2.5">
                    <IconButtonDownload
                      key={"Выгрузка"}
                      onClick={() =>
                        DownloadFile(doc.id, [
                          params.data.inn,
                          params.data.period_ucode,
                          params.data.iswrong,
                        ])
                      }
                      title={"Выгрузить документ"}
                    />
                    <DefaultIconModalWide
                      icon={
                        <>
                          <IconButtonUpload title={"Загрузить документ"} />
                        </>
                      }
                      name={"Загрузить документ"}
                      title={"Загрузка"}
                      textbutton={"Загрузка"}
                      onClickText={"Загрузка"}
                      onClickClassName={"flex"}
                      children={
                        <>
                          <form action="#">
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-full">
                                <label
                                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                                  htmlFor="fullName"
                                >
                                  Документ
                                </label>
                                <DocumentsInput
                                  onChange={setCreateDoc}
                                  fileInput={fileInput}
                                />
                              </div>
                            </div>
                          </form>
                        </>
                      }
                      onClick={() => uploadDocFile(doc.id)}
                    ></DefaultIconModalWide>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "operations",
      headerName: "Документы 20.25",
      resizable: true,
      sortable: false,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        if (params.data.is_penalty2025 === 0) return <div></div>;
        const id_list = [7, 10, 11, 21];
        const new_data = [];
        for (let doc_id of id_list) {
          if (params.data[`doc_id${doc_id}`] !== null)
            new_data.push({
              type: doc_id,
              type_name: doc_types_dict[`${doc_id}`],
              id: params.data[`doc_id${doc_id}`],
              number: params.data[`doc_number${doc_id}`],
              date: params.data[`doc_date${doc_id}`],
            });
        }
        return (
          <div>
            <ul>
              {new_data?.map((doc, indx) => (
                <li key={`2025${indx}_doc_id${doc.type}`}>
                  {doc.type_name} {doc.number} от {showDate(doc.date)}
                </li>
              ))}
            </ul>
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "operations3",
      headerName: "Операции",
      resizable: true,
      sortable: false,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        if (params.data.is_penalty2025 === 0) return <div></div>;
        const id_list = [7, 10, 11, 21];
        const new_data = [];
        for (let doc_id of id_list) {
          if (params.data[`doc_id${doc_id}`] !== null)
            new_data.push({
              type: doc_id,
              id: params.data[`doc_id${doc_id}`],
              name: "Операции",
            });
        }
        return (
          <div>
            <ul>
              {new_data?.map((doc, indx) => (
                <li key={`2025${indx}_oper_doc_id${doc.type}`}>
                  <div className="flex gap-2 py-2.5">
                    <IconButtonDownload
                      key={"Выгрузка"}
                      onClick={() =>
                        DownloadFile(doc.id, [
                          params.data.inn,
                          params.data.period_ucode,
                          params.data.iswrong,
                        ])
                      }
                      title={"Выгрузить"}
                    />
                    <DefaultIconModalWide
                      icon={
                        <>
                          <IconButtonUpload title={"Загрузить"} />
                        </>
                      }
                      name={"Загрузить документ"}
                      title={"Загрузка"}
                      textbutton={"Загрузка"}
                      onClickText={"Загрузка"}
                      onClickClassName={"flex"}
                      children={
                        <>
                          <form action="#">
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                              <div className="w-full">
                                <label
                                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                                  htmlFor="fullName"
                                >
                                  Документ
                                </label>
                                <DocumentsInput
                                  onChange={setCreateDoc}
                                  fileInput={fileInput}
                                />
                              </div>
                            </div>
                          </form>
                        </>
                      }
                      onClick={() => uploadDocFile(doc.id)}
                    ></DefaultIconModalWide>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "penalty",
      headerName: "Штрафы 15.13",
      resizable: true,
      minWidth: 200,
      sortable: false,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        let will_paid = "";
        if (params.data.penalty_amount !== null) {
          if (params.data.penalty_paidsum) {
            will_paid =
              params.data.penalty_amount - Number(params.data.penalty_paidsum);
            if (will_paid < 0) will_paid = 0;
          } else {
            will_paid = params.data.penalty_amount;
          }
        }
        if (params.data.ispenalty)
          return (
            <div>
              <p>Cумма: {params.data.penalty_amount} руб.</p>
              <p>Оплачено: {params.data.penalty_paidsum} руб.</p>
              <p>Долг: {will_paid} руб.</p>
              <p>Оплатить до: {showDate(params.data.penalty_limitdate2)} </p>
              {params.data.penalty_fixdate === null &&
              !params.data.ispenalty2025 ? (
                <p>
                  <button
                    key={"Удалить"}
                    onClick={() =>
                      onDeletePenalty(
                        params.data.inn,
                        params.data.period_ucode,
                        0,
                        params.data.iswrong
                      )
                    }
                    className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                  >
                    <div className="">
                      <p className="text-sm font-medium text-white bg-meta-1 px-4 py-2 rounded-md mb-2">
                        Удалить
                      </p>
                    </div>
                  </button>
                </p>
              ) : params.data.ispenalty2025 ? null : (
                <p>Оплачен: {showDate(params.data.penalty_fixdate)}</p>
              )}
            </div>
          );
        if (params.data.isalarm)
          return (
            <div className="flex gap-2">
              <div>Предупреждение</div>
              <IconButtonX
                key={"Удалить"}
                onClick={() =>
                  onDeletePenalty(
                    params.data.inn,
                    params.data.period_ucode,
                    2,
                    params.data.iswrong
                  )
                }
                title={"Удалить"}
              />
            </div>
          );
        return <div></div>;
      },
    },
    {
      enableValue: true,
      field: "penalty2025",
      headerName: "Штрафы 20.25",
      resizable: true,
      sortable: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        let will_paid = "";
        if (params.data.penalty2025_amount !== null) {
          if (params.data.penalty2025_paidsum) {
            will_paid =
              params.data.penalty2025_amount -
              Number(params.data.penalty2025_paidsum);
            if (will_paid < 0) will_paid = 0;
          } else {
            will_paid = params.data.penalty2025_amount;
          }
        }
        if (params.data.ispenalty2025)
          return (
            <div>
              <p>Cумма: {params.data.penalty2025_amount}</p>
              <p>Оплачено: {params.data.penalty2025_paidsum}</p>
              <p>Долг: {will_paid}</p>
              <p>Оплатить до: {showDate(params.data.penalty2025_limitdate2)}</p>
              {params.data.penalty2025_fixdate === null ? (
                <div className="flex gap-4">
                  <button
                    key={"Удалить"}
                    onClick={() =>
                      onDeletePenalty(
                        params.data.inn,
                        params.data.period_ucode,
                        1,
                        params.data.iswrong
                      )
                    }
                    className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                  >
                    <div className="">
                      <p className="text-sm font-medium text-white bg-meta-1 px-4 py-2 rounded-md mb-2">
                        Удалить
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <p>Оплачен: {showDate(params.data.penalty2025_fixdate)}</p>
              )}
            </div>
          );
        return <div></div>;
      },
    },
    {
      enableValue: true,
      field: "egrul_date",
      headerName: "Дата окончания лицензии",
      filter: filter_use ? "agDateColumnFilter" : null,
      resizable: true,
      sortable: true,
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
      field: "ishaveadminear",
      headerName: "Количество повторных нарушений",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        if (params.getValue() == 0)
          return (
            <button title="Повторные нарушения отстутствуют">
              <BookmarkSlashIcon className="h-5 w-5 m-2 stroke-[#637381] hover:stroke-primary cursor-pointer" />
            </button>
          );
        else return <div>{params.getValue()}</div>;
      },
    },
    {
      enableValue: true,
      field: "iswrong",
      headerName: "Недостоверные сведения",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        if (params.getValue() == 0)
          return (
            <button title="Недостоверные сведения отсутствуют">
              <BookmarkSlashIcon className="h-5 w-5 m-2 stroke-[#637381] hover:stroke-primary cursor-pointer" />
            </button>
          );
        if (params.getValue() == 1)
          return (
            <button title="Недостоверные сведения отсутствуют">
              <BookmarkIcon className="h-5 w-5 m-2 stroke-[#637381] hover:fill-danger cursor-pointer" />
            </button>
          );
      },
    },
  ]);

  const [inn, setInn] = useState("");
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);
  const [addressAO, setAddress] = useState(null);
  const [regNumber, setRegNumber] = useState("");
  const [title, setTitle] = useState("");
  const [is_reg, setReg] = useState(null);
  const [is_doc, setDoc] = useState(null);
  const [is_active, setActive] = useState(null);
  const [is_repeat, setRepeat] = useState(null);
  const [is_wrong, setWrong] = useState(null);
  const [is_closed, setClosed] = useState(null);
  const [is_ecom, setEcom] = useState(null);
  const [is_dept, setDept] = useState(null);
  const [is_alarm, setAlarm] = useState(null);
  const [penalty, setPenalty] = useState(null);
  const [penalty_amount, setAmount] = useState([]);
  const [penalty_amount_other, setOther] = useState(null);
  const [createDateStart, setDateStart] = useState(null);
  const [createDateStop, setDateStop] = useState(null);

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);

  const [formDateDoc, setFormDateDoc] = useState("");
  const [formDateRec, setFormDateRec] = useState("");
  const [formDateResHour, setFormDateResHour] = useState("");
  const [formDateResMin, setFormDateResMin] = useState("");
  const [formPurpose, setFormPurpose] = useState("");
  const [formCountQueues, setFormCountQueues] = useState(0);
  const [formAuto, setFormAuto] = useState(false);
  const [upload_doc_types1, setUploadDocTypes1] = useState([]);
  const [upload_doc_types2, setUploadDocTypes2] = useState([]);
  const [upload_doc_types, setUploadDocTypes] = useState([]);

  const [downloadAll, setDownloadAll] = useState(false);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    firstRender();
  }, []);

  const firstRender = async () => {
    setLoad(true);
    await getOkato();
    await getYears();
    await getQuarters();
    await getTypes();
    await getPayTypes();
    await getAmounts();
    setLoad(false);
  };

  const getQuarters = async () => {
    try {
      const result = await axios.get(variables.ADM_API_URL + `/quarters`, {
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
      const result = await axios.get(variables.ADM_API_URL + `/years`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setYears([
        { value: null, name: "Не важно", code: null },
        ...result.data.map((i) => ({ value: i.year, name: i.year })),
      ]);
      setYear(getCurrentYear());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getTypes = async () => {
    try {
      const result = await axios.get(variables.ADM_API_URL + `/doc_types`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setTypes(result.data);
      return result.data;
    } catch (e) {
      console.log(e);
      setError(e);
      return [];
    }
  };

  const getPayTypes = async () => {
    try {
      const result = await axios.get(variables.ADM_API_URL + `/paydoc-types`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setPayDocTypes(result.data);
      return result.data;
    } catch (e) {
      console.log(e);
      setError(e);
      return [];
    }
  };

  const getAmounts = async () => {
    try {
      const result = await axios.get(
        variables.ADM_API_URL + `/penalty-amounts`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setAmounts(result.data);
      return result.data;
    } catch (e) {
      console.log(e);
      setError(e);
      return [];
    }
  };

  const getOkato = async () => {
    try {
      const result = await axios.get(variables.ADM_API_URL + `/msk_okato`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setAddresses([
        { value: -1, name: "Не важно" },
        ...result.data.map((i) => ({ value: i.code, name: i.name })),
      ]);
      setAddress({ value: -1, name: "Не важно" });
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const uploadDocFile = async (doc_id) => {
    console.log(doc_id, createDoc, fileInput);
    if (
      (createDoc === "" || createDoc == null) &&
      fileInput.current.files.length === 0
    ) {
      alert("Прикрепите файл!");
      return false;
    }

    setLoad(true);
    let res = true;
    const formData = new FormData();
    formData.append(
      "file",
      fileInput.current.files[0],
      fileInput.current.files[0].name
    );
    console.log(formData.get("p_BASEDOCDATA"));
    try {
      const result = await axios.post(
        variables.ADM_API_URL +
          `/save-document?ACT_DOC_ID=${doc_id}&OPERATION_NOTE=some`,
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

  const ReloadPage = async () => {
    console.log("e");
    gridRef.current.api.refreshServerSide({ route: undefined, purge: false });
  };

  const onStoreRefreshed = useCallback((event: StoreRefreshedEvent) => {
    console.log("Refresh finished for store with route:", event.route);
  }, []);

  const downloadManyDocs = async () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    let needed_docs = [];
    console.log(upload_doc_types);
    for (let row of selectedRows) {
      for (let doc_type_needed of upload_doc_types) {
        console.log(row, `doc_id${doc_type_needed}`);
        if (
          row[`doc_id${doc_type_needed}`] !== null &&
          row[`doc_id${doc_type_needed}`] !== undefined
        ) {
          needed_docs.push([
            row[`doc_id${doc_type_needed}`],
            row.inn,
            row.period_ucode,
            row.iswrong,
          ]);
        }
      }
    }
    if (needed_docs.length === 0) {
      alert("Выберите дела или виды документов");
      return false;
    }
    let res = true;
    setLoad(true);
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/export-admin-doc`,
        {
          p_ACT_DOC_IDS: needed_docs,
          p_OPERATOR: user,
        },
        {
          responseType: "arraybuffer",
          headers: {
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
      if (
        fileType === "application/x-zip-compressed" ||
        fileType === "application/zip"
      )
        link.setAttribute("download", "documents.zip"); //or any other extension
      else link.setAttribute("download", "document.docx"); //or any other extension
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
  };

  const CreateDocs = async (selectedDocList) => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    let needed_docs = [];
    console.log(selectedDocList);
    for (let row of selectedRows) {
      needed_docs.push({
        INN: row.inn,
        PERIOD_UCODE: row.period_ucode,
        ISWRONG: row.iswrong,
      });
    }
    if (needed_docs.length === 0) {
      alert("Выберите дела");
      return false;
    }
    if (selectedDocList.length === 0) {
      alert("Выберите виды документов");
      return false;
    }
    if (formDateDoc === "" || formDateDoc === null) {
      alert("Заполните дату документа");
      return false;
    }
    if (formDateRec === "" || formDateRec === null) {
      alert("Заполните дату приема");
      return false;
    }
    if (formDateResHour === "" || formDateResHour === null) {
      alert("Заполните начало приема (часы)");
      return false;
    }
    if (formDateResMin === "" || formDateResMin === null) {
      alert("Заполните начало приема (минуты)");
      return false;
    }
    if (formPurpose === "" || formPurpose === null) {
      alert("Заполните назначение");
      return false;
    }
    setLoad(true);
    let res = true;
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/create-docs`,
        {
          p_ACT_DOC_TYPES: selectedDocList.map((doc_type) => ({
            ID: doc_type,
          })),
          p_OPERATOR: user,
          p_ADMIN_CASES: needed_docs,
          p_DOC_DATE: formDateDoc.toISOString().replace("000Z", "300Z"),
          p_DOC_RECEIVE: formDateRec.toISOString().replace("000Z", "300Z"),
          p_DOC_HOUR: String(formDateResHour),
          p_DOC_MINUTE: String(formDateResMin),
          p_ASSIGMENT: formPurpose,
          p_AUTO: Number(formAuto),
          p_COUNT_QUEUES: formCountQueues,
        },
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      await ReloadPage();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
  };

  const createPenalty = async (
    inn,
    period_ucode,
    iswrong,
    penaltyState,
    penaltyAmount,
    penaltyAlert,
    penaltyStartDate,
    penaltyDate,
    penaltyDate2
  ) => {
    setLoad(true);
    let res = true;
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/process-penalties`,
        {
          p_INN: inn,
          p_PERIOD_UCODE: period_ucode,
          p_ISWRONG: iswrong,
          p_PENALTY_MODE: penaltyState,
          p_OPERATOR: user,
          p_AMOUNT: penaltyAmount,
          p_LIMIT_DATE:
            penaltyDate === null
              ? null
              : penaltyDate.toISOString().replace("000Z", "300Z"),
          p_LIMIT_DATE2:
            penaltyDate2 === null
              ? null
              : penaltyDate2.toISOString().replace("000Z", "300Z"),
          p_STARTDATE:
            penaltyStartDate === null
              ? null
              : penaltyStartDate.toISOString().replace("000Z", "300Z"),
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
      await ReloadPage();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
  };

  const onDeletePenalty = async (
    p_inn,
    p_period_ucode,
    p_penalty_mode,
    p_iswrong
  ) => {
    if (confirm("Вы уверены?")) {
      console.log("");
    } else {
      // Do nothing!
      return;
    }

    setLoad(true);
    let res = true;
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/delete-penalty`,
        {
          p_INN: p_inn,
          p_PERIOD_UCODE: p_period_ucode,
          p_PENALTY_MODE: p_penalty_mode,
          p_ISWRONG: p_iswrong,
          p_OPERATOR: user,
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
      await ReloadPage();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
  };

  const paidPenalty = async (
    inn,
    period_ucode,
    iswrong,
    paidState,
    paidAmount,
    paidDate,
    paidKind,
    paidNumber,
    paidForce,
    paidClose
  ) => {
    setLoad(true);
    let res = true;
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/create-payment`,
        {
          p_INN: inn,
          p_PERIOD_UCODE: period_ucode,
          p_ISWRONG: iswrong,
          p_PENALTY_MODE: paidState.value,
          p_OPERATOR: user,
          p_PAYM_SUM: Number(paidAmount),
          p_PAYMDOC_TYPE_ID: paidKind.value,
          p_PAYMDOC_NUMBER: paidNumber,
          p_PAYM_DATE: paidDate.toISOString().replace("000Z", "300Z"),
          p_UNDERPRESSURE: Number(paidForce),
          p_CLOSE: paidClose,
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
      await ReloadPage();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
  };

  const closeCase = async (inn, period_ucode, iswrong, terminateMode) => {
    setLoad(true);
    let res = true;
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/terminate-case`,
        {
          p_INN: inn,
          p_PERIOD_UCODE: period_ucode,
          p_ISWRONG: iswrong,
          p_OPERATOR: user,
          p_TERMINATE_MODE: terminateMode,
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
      await ReloadPage();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
    }
    setLoad(false);
    return res;
  };

  const DownloadFile = async (doc_id, adminCase) => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/export-admin-doc`,
        {
          p_ACT_DOC_IDS: [[doc_id, ...adminCase]],
          p_OPERATOR: "user",
          p_PARENT_LOG_ID: 1,
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

      link.setAttribute("download", "document.docx"); //or any other extension
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

  const parseRegNumber = (e) => {
    if (e === "") {
      setRegNumber("");
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    setRegNumber(e);
  };

  const onSearchClick = async (p_doc_types, p_amounts, p_paydoc_types) => {
    if (inn !== "")
      if (inn.length < 10 || inn.length > 12) {
        alert("ИНН должен содержать от 10 до 12 цифр!");
        return;
      }
    setLoad(true);

    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/get-admin-files-count`,
        {
          p_PERIOD_CODE: quarter === null ? null : quarter.value,
          p_PERIOD_YEAR: year === null ? null : year.value,
          p_INN: inn === "" ? null : inn,
          p_TITLE_MASK: title === "" ? null : title,
          p_BASE_NUMBER: regNumber === "" ? null : regNumber,
          p_ISHAVEDOCUMENTS: is_doc === null ? null : Number(is_doc),
          p_ADMINFILEEARLIER: is_repeat === null ? -1 : Number(is_repeat),
          p_ISHAVEREGNUMBER: is_reg === null ? null : Number(is_reg),
          p_ISHAVEACTIVEJUDGMENTS:
            is_active === null ? null : Number(is_active),
          p_ISWRONG: is_wrong === null ? null : Number(is_wrong),
          p_ISECONOMYACTIVITY: is_ecom === null ? null : Number(is_ecom),
          p_AO_OKATO_IDObj: addressAO === null ? -1 : addressAO.value,
          p_ISCLOSED: is_closed === null ? null : Number(is_closed),
          p_ISALARM: is_alarm === null ? null : Number(is_alarm),
          p_ARTICLE: penalty === null ? null : Number(penalty),
          p_ISHAVEDEBTS: is_dept,
          p_PENALTY:
            (penalty_amount_other === "" || penalty_amount_other === null) &&
            penalty_amount.length === 0
              ? null
              : penalty_amount_other === "" || penalty_amount_other === null
              ? penalty_amount
              : [...penalty_amount, Number(penalty_amount_other)],
          p_CREATEDATESTART:
            createDateStart === "" || createDateStart === null
              ? null
              : createDateStart.toISOString().replace("000Z", "300Z"),
          p_CREATEDATESTOP:
            createDateStop === "" || createDateStop === null
              ? null
              : createDateStop.toISOString().replace("000Z", "300Z"),
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
      var datasource = getServerSideDatasource(
        count,
        p_doc_types,
        p_amounts,
        p_paydoc_types
      );
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getServerSideDatasource = (
    count,
    p_doc_types,
    p_amounts,
    p_paydoc_types
  ) => {
    return {
      getRows: async (params) => {
        console.log("[Datasource] - rows requested by grid: ", params.request);
        const startRow = params.request.startRow;
        const endRow = params.request.endRow;
        setLoad(true);
        try {
          const result = await axios.post(
            variables.ADM_API_URL + `/get-admin-files`,
            {
              p_PERIOD_CODE: quarter === null ? null : quarter.value,
              p_PERIOD_YEAR: year === null ? null : year.value,
              p_INN: inn === "" ? null : inn,
              p_TITLE_MASK: title === "" ? null : title,
              p_BASE_NUMBER: regNumber === "" ? null : regNumber,
              p_ISHAVEDOCUMENTS: is_doc === null ? null : Number(is_doc),
              p_ADMINFILEEARLIER: is_repeat === null ? -1 : Number(is_repeat),
              p_ISHAVEREGNUMBER: is_reg === null ? null : Number(is_reg),
              p_ISHAVEACTIVEJUDGMENTS:
                is_active === null ? null : Number(is_active),
              p_ISWRONG: is_wrong === null ? null : Number(is_wrong),
              p_ISECONOMYACTIVITY: is_ecom === null ? null : Number(is_ecom),
              p_AO_OKATO_IDObj: addressAO === null ? -1 : addressAO.value,
              p_ISCLOSED: is_closed === null ? null : Number(is_closed),
              p_ISALARM: is_alarm === null ? null : Number(is_alarm),
              p_ARTICLE: penalty === null ? null : Number(penalty),
              p_ISHAVEDEBTS: is_dept,
              p_PENALTY:
                (penalty_amount_other === "" ||
                  penalty_amount_other === null) &&
                penalty_amount.length === 0
                  ? null
                  : penalty_amount_other === "" || penalty_amount_other === null
                  ? penalty_amount
                  : [...penalty_amount, Number(penalty_amount_other)],
              p_CREATEDATESTART:
                createDateStart === "" || createDateStart === null
                  ? null
                  : createDateStart.toISOString().replace("000Z", "300Z"),
              p_CREATEDATESTOP:
                createDateStop === "" || createDateStop === null
                  ? null
                  : createDateStop.toISOString().replace("000Z", "300Z"),

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
          for (let i of result.data) {
            i.doc_types = p_doc_types;
            i.amounts = p_amounts;
            i.paydoc_types = p_paydoc_types;
          }
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
        variables.ADM_API_URL + `/get-admin-files-xlsx`,
        {
          p_PERIOD_CODE: quarter === "" ? null : quarter.value,
          p_PERIOD_YEAR: year === "" ? null : year.value,
          p_INN: inn === "" ? null : inn,
          p_TITLE_MASK: title === "" ? null : title,
          p_BASE_NUMBER: regNumber === "" ? null : regNumber,
          p_ISHAVEDOCUMENTS: is_doc === null ? null : Number(is_doc),
          p_ADMINFILEEARLIER: is_repeat === null ? -1 : Number(is_repeat),
          p_ISHAVEREGNUMBER: is_reg === null ? null : Number(is_reg),
          p_ISHAVEACTIVEJUDGMENTS:
            is_active === null ? null : Number(is_active),
          p_ISWRONG: is_wrong === null ? null : Number(is_wrong),
          p_ISECONOMYACTIVITY: is_ecom === null ? null : Number(is_ecom),
          p_AO_OKATO_IDObj: addressAO === null ? -1 : addressAO.value,
          p_ISCLOSED: is_closed === null ? null : Number(is_closed),
          p_ISALARM: is_alarm === null ? null : Number(is_alarm),
          p_ARTICLE: penalty === null ? null : Number(penalty),
          p_ISHAVEDEBTS: is_dept,
          p_PENALTY:
            (penalty_amount_other === "" || penalty_amount_other === null) &&
            penalty_amount.length === 0
              ? null
              : penalty_amount_other === "" || penalty_amount_other === null
              ? penalty_amount
              : [...penalty_amount, Number(penalty_amount_other)],
          p_CREATEDATESTART:
            createDateStart === "" || createDateStart === null
              ? null
              : createDateStart.toISOString().replace("000Z", "300Z"),
          p_CREATEDATESTOP:
            createDateStop === "" || createDateStop === null
              ? null
              : createDateStop.toISOString().replace("000Z", "300Z"),

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
      link.setAttribute("download", "Административные дела.xlsx"); //or any other extension
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

  const setPenaltyAmount = (value) => {
    if (value === null) {
      setAmount([]);
      setOther(null);
      return;
    }
    if (penalty_amount.includes(value)) {
      const new_data = [];
      for (let kind of penalty_amount) {
        if (kind !== value) {
          new_data.push(kind);
        }
      }
      setAmount(new_data);
    } else {
      const new_data = penalty_amount.map((kind) => {
        return kind;
      });
      new_data.push(value);
      setAmount(new_data);
    }
  };

  const setUploadDoctTypesList = (value) => {
    if (upload_doc_types.includes(value)) {
      const new_data = [];
      for (let kind of upload_doc_types) {
        if (kind !== value) {
          new_data.push(kind);
        }
      }
      setUploadDocTypes(new_data);
    } else {
      const new_data = upload_doc_types.map((kind) => {
        return kind;
      });
      new_data.push(value);
      setUploadDocTypes(new_data);
    }
  };

  const setUploadDoctTypesListAll = (value) => {
    console.log(value, doc_types);
    if (value) {
      const new_data = doc_types.map((kind) => {
        return kind.value;
      });
      console.log(value, new_data);
      setUploadDocTypes(new_data);
    } else {
      console.log(value, []);
      setUploadDocTypes([]);
    }
    setDownloadAll(value);
  };

  const setUploadDoctTypesList1 = (value) => {
    if (upload_doc_types1.includes(value)) {
      const new_data = [];
      for (let kind of upload_doc_types1) {
        if (kind !== value) {
          new_data.push(kind);
        }
      }
      setUploadDocTypes1(new_data);
    } else {
      const new_data = upload_doc_types1.map((kind) => {
        return kind;
      });
      new_data.push(value);
      setUploadDocTypes1(new_data);
    }
  };

  const setUploadDoctTypesList2 = (value) => {
    if (upload_doc_types2.includes(value)) {
      const new_data = [];
      for (let kind of upload_doc_types2) {
        if (kind !== value) {
          new_data.push(kind);
        }
      }
      setUploadDocTypes2(new_data);
    } else {
      const new_data = upload_doc_types2.map((kind) => {
        return kind;
      });
      new_data.push(value);
      setUploadDocTypes2(new_data);
    }
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
      <Breadcrumb pageName="Административные дела" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-4">
            <Card name="Сведения о юр. лице">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-3/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
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
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Экономическая деятельность
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"ecom_null"}
                        id={"ecom_null"}
                        value={is_ecom === null}
                        onChange={() => setEcom(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"ecom_true"}
                        id={"ecom_true"}
                        value={is_ecom === true}
                        onChange={() => setEcom(true)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"ecom_false"}
                        id={"ecom_false"}
                        value={is_ecom === false}
                        onChange={() => setEcom(false)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <TextInput
                      label={"ИНН"}
                      value={inn}
                      name={"INN"}
                      id={"INN"}
                      placeholder={"Введите 10 или 12 цифр"}
                      onChange={(e) => parseInn(e)}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      АО Москвы (адрес)
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={addresses}
                        value={addressAO}
                        onChange={(e) => setAddress(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
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

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Год
                    </label>
                    <SelectCustom
                      options={years}
                      value={year}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setYear(e)}
                    />
                  </div>
                </div>
              </form>
            </Card>
          </div>
          <div className="col-span-8">
            <Card name="Сведения о нарушениях">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Регистрационный номер?
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"reg_null"}
                        id={"reg_null"}
                        value={is_reg === null}
                        onChange={() => {
                          setReg(null);
                          setRegNumber("");
                        }}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"reg_true"}
                        id={"reg_true"}
                        value={is_reg === true}
                        onChange={() => {
                          setReg(true);
                        }}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"reg_false"}
                        id={"reg_false"}
                        value={is_reg === false}
                        onChange={() => {
                          setReg(false);
                          setRegNumber("");
                        }}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <TextInput
                      label={"Регистрационный номер"}
                      value={regNumber}
                      name={"regNumber"}
                      id={"regNumber"}
                      placeholder={"Не заполнено"}
                      disabled={is_reg === null || !is_reg}
                      onChange={(e) => parseRegNumber(e)}
                    />
                  </div>

                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата документа (с)"}
                      selected={createDateStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setDateStart(date)}
                    ></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата документа (по)"}
                      selected={createDateStop}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setDateStop(date)}
                    ></DateDefaultInput>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Документы
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"doc_null"}
                        id={"doc_null"}
                        value={is_doc === null}
                        onChange={() => setDoc(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"doc_true"}
                        id={"doc_true"}
                        value={is_doc === true}
                        onChange={() => setDoc(true)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"doc_false"}
                        id={"doc_false"}
                        value={is_doc === false}
                        onChange={() => setDoc(false)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Активные судебные дела
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"active_null"}
                        id={"active_null"}
                        value={is_active === null}
                        onChange={() => setActive(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"active_true"}
                        id={"active_true"}
                        value={is_active === true}
                        onChange={() => setActive(true)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"active_false"}
                        id={"active_false"}
                        value={is_active === false}
                        onChange={() => setActive(false)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Дело закрыто?
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"close_null"}
                        id={"close_null"}
                        value={is_closed === null}
                        onChange={() => setClosed(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Дело активно"}
                        name={"close_false"}
                        id={"close_false"}
                        value={is_closed === -1}
                        onChange={() => setClosed(-1)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Дело закрыто"}
                        name={"close_true"}
                        id={"close_true"}
                        value={is_closed === 0}
                        onChange={() => setClosed(0)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Дело прекращено"}
                        name={"close_true"}
                        id={"close_true"}
                        value={is_closed === 1}
                        onChange={() => setClosed(1)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Дело прекращено приставами (временно)"}
                        name={"close_true"}
                        id={"close_true"}
                        value={is_closed === 2}
                        onChange={() => setClosed(2)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Дело прекращено приставами (окончательно)"}
                        name={"close_true"}
                        id={"close_true"}
                        value={is_closed === 3}
                        onChange={() => setClosed(3)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Повторные нарушения
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"repeat_null"}
                        id={"repeat_null"}
                        value={is_repeat === null}
                        onChange={() => setRepeat(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"repeat_true"}
                        id={"repeat_true"}
                        value={is_repeat === true}
                        onChange={() => setRepeat(true)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"repeat_false"}
                        id={"repeat_false"}
                        value={is_repeat === false}
                        onChange={() => setRepeat(false)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Недостоверные сведения
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"wrong_null"}
                        id={"wrong_null"}
                        value={is_wrong === null}
                        onChange={() => setWrong(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"wrong_true"}
                        id={"wrong_true"}
                        value={is_wrong === true}
                        onChange={() => setWrong(true)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"wrong_false"}
                        id={"wrong_false"}
                        value={is_wrong === false}
                        onChange={() => setWrong(false)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          <div className="col-span-6">
            <Card name="Сведения о штрафах">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Задолженность по оплате
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"dept_null"}
                        id={"dept_null"}
                        value={is_dept === null}
                        onChange={() => setDept(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Частичная задолженность"}
                        name={"dept_1"}
                        id={"dept_1"}
                        value={is_dept === 1}
                        onChange={() => setDept(1)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Да"}
                        name={"dept_2"}
                        id={"dept_2"}
                        value={is_dept === 2}
                        onChange={() => setDept(2)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"dept_3"}
                        id={"dept_3"}
                        value={is_dept === 3}
                        onChange={() => setDept(3)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Предупреждения
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"alarm_null"}
                        id={"alarm_null"}
                        value={is_alarm === null}
                        onChange={() => setAlarm(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Есть"}
                        name={"alarm_true"}
                        id={"alarm_true"}
                        value={is_alarm === true}
                        onChange={() => setAlarm(true)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Нет"}
                        name={"alarm_false"}
                        id={"alarm_false"}
                        value={is_alarm === false}
                        onChange={() => setAlarm(false)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Штраф по статье
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"penalty_null"}
                        id={"penalty_null"}
                        value={penalty === null}
                        onChange={() => setPenalty(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"15.13"}
                        name={"penalty_true"}
                        id={"penalty_true"}
                        value={penalty === 1}
                        onChange={() => setPenalty(1)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"20.25"}
                        name={"penalty_false"}
                        id={"penalty_false"}
                        value={penalty === 0}
                        onChange={() => setPenalty(0)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Сумма штрафа (тыс. рублей)
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        label={"Не важно"}
                        name={"penalty_amount_null"}
                        id={"penalty_amount_null"}
                        value={
                          penalty_amount.length === 0 &&
                          penalty_amount_other === null
                        }
                        onChange={() => setPenaltyAmount(null)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"5"}
                        name={"penalty_amount_1"}
                        id={"penalty_amount_1"}
                        value={penalty_amount.includes(5)}
                        onChange={() => setPenaltyAmount(5)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"10"}
                        name={"penalty_amount_2"}
                        id={"penalty_amount_2"}
                        value={penalty_amount.includes(10)}
                        onChange={() => setPenaltyAmount(10)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"20"}
                        name={"penalty_amount_3"}
                        id={"penalty_amount_3"}
                        value={penalty_amount.includes(20)}
                        onChange={() => setPenaltyAmount(20)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"50"}
                        name={"penalty_amount_4"}
                        id={"penalty_amount_4"}
                        value={penalty_amount.includes(50)}
                        onChange={() => setPenaltyAmount(50)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"100"}
                        name={"penalty_amount_5"}
                        id={"penalty_amount_5"}
                        value={penalty_amount.includes(100)}
                        onChange={() => setPenaltyAmount(100)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"200"}
                        name={"penalty_amount_6"}
                        id={"penalty_amount_6"}
                        value={penalty_amount.includes(200)}
                        onChange={() => setPenaltyAmount(200)}
                      ></CheckboxDefault>
                      <CheckboxDefault
                        label={"Иная"}
                        name={"penalty_amount_7"}
                        id={"penalty_amount_7"}
                        value={penalty_amount_other !== null}
                        onChange={() =>
                          setOther(penalty_amount_other === null ? "" : null)
                        }
                      ></CheckboxDefault>
                      {penalty_amount_other !== null ? (
                        <div className="relative">
                          <NumberInput
                            value={penalty_amount_other}
                            name={"penalty_amount_other"}
                            id={"penalty_amount_other"}
                            placeholder={"Не заполнено"}
                            onChange={(e) => setOther(e)}
                          />
                        </div>
                      ) : null}
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
            name="Список административных дел"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}
                >
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
                    onStoreRefreshed={onStoreRefreshed}
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
                <DefaultModal
                  title={"Формирование комплекта документов"}
                  textbutton={"Формирование комплекта документов"}
                  onClickText={"Сформировать"}
                  onClickClassName={
                    "text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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
                                }
                              >
                                Общие данные
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
                                }
                              >
                                Типы документов
                              </Tab>
                            </div>
                          </div>
                        </Tab.List>
                        <Tab.Panels className="leading-relaxed block">
                          <Tab.Panel>
                            <form action="#">
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <DateDefaultInput
                                    label={"Дата документа"}
                                    selected={formDateDoc}
                                    placeholder={"dd.MM.yyyy"}
                                    onChange={(date) => setFormDateDoc(date)}
                                  ></DateDefaultInput>
                                </div>
                                <div className="w-full sm:w-1/2">
                                  <DateDefaultInput
                                    label={"Дата приема"}
                                    selected={formDateRec}
                                    placeholder={"dd.MM.yyyy"}
                                    onChange={(date) => setFormDateRec(date)}
                                  ></DateDefaultInput>
                                </div>
                              </div>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <NumberInput
                                    label={"Начало приема в ч."}
                                    value={formDateResHour}
                                    name={"formDateResHour"}
                                    id={"formDateResHour"}
                                    min={"0"}
                                    max={"24"}
                                    placeholder={"Не заполнено"}
                                    onChange={(e) =>
                                      setFormDateResHour(
                                        e > 23 ? 23 : e < 0 ? 0 : e
                                      )
                                    }
                                  />
                                </div>

                                <div className="w-full sm:w-1/2">
                                  <NumberInput
                                    label={"м."}
                                    value={formDateResMin}
                                    name={"formDateResMin"}
                                    id={"formDateResMin"}
                                    min={"0"}
                                    max={"60"}
                                    placeholder={"Не заполнено"}
                                    onChange={(e) =>
                                      setFormDateResMin(
                                        e > 60 ? 60 : e < 0 ? 0 : e
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="emailAddress"
                                  >
                                    Назначение
                                  </label>
                                  <div className="relative">
                                    <TextInput
                                      type={"text"}
                                      value={formPurpose}
                                      name={"formPurpose"}
                                      id={"formPurpose"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => setFormPurpose(e)}
                                    />
                                  </div>
                                </div>
                                <div className="w-full sm:w-1/2">
                                  <NumberInput
                                    label={"Кол-во очередей"}
                                    value={formCountQueues}
                                    name={"formCountQueues"}
                                    id={"formCountQueues"}
                                    placeholder={"Не заполнено"}
                                    onChange={(e) => setFormCountQueues(e)}
                                  />
                                </div>
                              </div>
                              {/*<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <CheckboxDefault
                                    label={"Отправить по почте"}
                                    name={"formAuto"}
                                    id={"formAuto"}
                                    value={formAuto}
                                    onChange={() => setFormAuto(!formAuto)}
                                  ></CheckboxDefault>
                                </div>
                              </div>
                              */}
                            </form>
                          </Tab.Panel>
                          <Tab.Panel>
                            <form action="#">
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full">
                                  {doc_types?.map((doc_type) =>
                                    [1, 2, 3, 4, 6, 20, 19].includes(
                                      doc_type.value
                                    ) ? (
                                      <CheckboxDefault
                                        label={doc_type.name}
                                        name={`doc_type_${doc_type.value}`}
                                        id={"penalty_amount_6"}
                                        value={upload_doc_types1.includes(
                                          doc_type.value
                                        )}
                                        onChange={() =>
                                          setUploadDoctTypesList1(
                                            doc_type.value
                                          )
                                        }
                                      ></CheckboxDefault>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            </form>
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </>
                  }
                  onClick={() => CreateDocs(upload_doc_types1)}
                ></DefaultModal>
                <DefaultModal
                  title={
                    "Формирование комплекта документов об уклонении от оплаты штрафа"
                  }
                  textbutton={
                    "Формирование комплекта документов об уклонении от оплаты штрафа"
                  }
                  onClickText={"Сформировать"}
                  onClickClassName={
                    "text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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
                                }
                              >
                                Общие данные
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
                                }
                              >
                                Типы документов
                              </Tab>
                            </div>
                          </div>
                        </Tab.List>
                        <Tab.Panels className="leading-relaxed block">
                          <Tab.Panel>
                            <form action="#">
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <DateDefaultInput
                                    label={"Дата документа"}
                                    selected={formDateDoc}
                                    placeholder={"dd.MM.yyyy"}
                                    onChange={(date) => setFormDateDoc(date)}
                                  ></DateDefaultInput>
                                </div>
                                <div className="w-full sm:w-1/2">
                                  <DateDefaultInput
                                    label={"Дата приема"}
                                    selected={formDateRec}
                                    placeholder={"dd.MM.yyyy"}
                                    onChange={(date) => setFormDateRec(date)}
                                  ></DateDefaultInput>
                                </div>
                              </div>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <NumberInput
                                    label={"Начало приема в ч."}
                                    value={formDateResHour}
                                    name={"formDateResHour"}
                                    id={"formDateResHour"}
                                    min={"0"}
                                    max={"24"}
                                    placeholder={"Не заполнено"}
                                    onChange={(e) =>
                                      setFormDateResHour(
                                        e > 23 ? 23 : e < 0 ? 0 : e
                                      )
                                    }
                                  />
                                </div>
                                <div className="w-full sm:w-1/2">
                                  <NumberInput
                                    label={"м."}
                                    value={formDateResMin}
                                    name={"formDateResMin"}
                                    id={"formDateResMin"}
                                    min={"0"}
                                    max={"60"}
                                    placeholder={"Не заполнено"}
                                    onChange={(e) =>
                                      setFormDateResMin(
                                        e > 60 ? 60 : e < 0 ? 0 : e
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="emailAddress"
                                  >
                                    Назначение
                                  </label>
                                  <div className="relative">
                                    <TextInput
                                      type={"text"}
                                      value={formPurpose}
                                      name={"formPurpose"}
                                      id={"formPurpose"}
                                      placeholder={"Не заполнено"}
                                      onChange={(e) => setFormPurpose(e)}
                                    />
                                  </div>
                                </div>
                                <div className="w-full sm:w-1/2">
                                  <NumberInput
                                    label={"Кол-во очередей"}
                                    value={formCountQueues}
                                    name={"formCountQueues"}
                                    id={"formCountQueues"}
                                    placeholder={"Не заполнено"}
                                    onChange={(e) => setFormCountQueues(e)}
                                  />
                                </div>
                              </div>
                              {/*<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <CheckboxDefault
                                    label={"Отправить по почте"}
                                    name={"formAuto"}
                                    id={"formAuto"}
                                    value={formAuto}
                                    onChange={() => setFormAuto(!formAuto)}
                                  ></CheckboxDefault>
                                </div>
                              </div>*/}
                            </form>
                          </Tab.Panel>
                          <Tab.Panel>
                            <form action="#">
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full">
                                  {doc_types?.map((doc_type) =>
                                    [10, 11, 7].includes(doc_type.value) ? (
                                      <CheckboxDefault
                                        label={doc_type.name}
                                        name={`doc_type_${doc_type.value}`}
                                        id={"penalty_amount_6"}
                                        value={upload_doc_types2.includes(
                                          doc_type.value
                                        )}
                                        onChange={() =>
                                          setUploadDoctTypesList2(
                                            doc_type.value
                                          )
                                        }
                                      ></CheckboxDefault>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            </form>
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </>
                  }
                  onClick={() => CreateDocs(upload_doc_types2)}
                ></DefaultModal>
                <DefaultModal
                  title={"Выгрузка документов"}
                  textbutton={"Выгрузка документов"}
                  onClickText={"Выгрузить"}
                  onClickClassName={
                    "text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  }
                  children={
                    <>
                      <form action="#">
                        <div className="mb-5.5 flex flex-col gap-5.5">
                          <div className="w-full">
                            <CheckboxDefault
                              label={"Все"}
                              name={`doc_type_all`}
                              id={"penalty_amount_6"}
                              value={downloadAll}
                              onChange={() =>
                                setUploadDoctTypesListAll(!downloadAll)
                              }
                            ></CheckboxDefault>
                            {doc_types?.map((doc_type) => (
                              <CheckboxDefault
                                label={doc_type.name}
                                name={`doc_type_${doc_type.value}`}
                                id={"penalty_amount_6"}
                                value={upload_doc_types.includes(
                                  doc_type.value
                                )}
                                onChange={() =>
                                  setUploadDoctTypesList(doc_type.value)
                                }
                              ></CheckboxDefault>
                            ))}
                          </div>
                        </div>
                      </form>
                    </>
                  }
                  onClick={() => downloadManyDocs()}
                ></DefaultModal>

                <button
                  type="button"
                  onClick={() =>
                    onSearchClick(doc_types, amounts, paydoc_types)
                  }
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Поиск
                </button>
              </>
            }
          ></CardTable>
        </div>
      </div>
    </>
  );
};

export default AdmCases;
