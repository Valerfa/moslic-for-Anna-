import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
  useCallback,
} from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";

import Tabs from "../../components/Tabs/1.Tabs";

import TextInput from "../../components/UI/General/Inputs/TextInput";
import DocumentsInput from "../../components/UI/General/Inputs/DocumentsInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import { variables, showDate, AG_GRID_LOCALE_RU, getCurrentYear, getCurrentQuarter } from "../../variables";
import CellRender from "./CellRender.tsx";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

function showDateTime(dateString) {
  if (dateString === null || dateString === undefined) return null;
  let NewDate = new Date(dateString);
  NewDate = format(NewDate, "dd.MM.yyyy HH:MM", { locale: ru });
  return NewDate;
}

const filter_use = false;

const Documents = (props) => {
  const gridRef = useRef<AgGridReact>(null);
  const fileInput = createRef();

  const [is_open_filters, setFilters] = useState(true);
  const [limit] = useState(1);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [data, setData] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);
  const [doc_types, setTypes] = useState([]);
  const [dataCount, setCount] = useState(0);
  const [logs, setLogs] = useState(null);
  // data columns
  const [dataColumns] = useState([
    {
      enableValue: true,
      field: "operations",
      headerName: "Операции",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        return CellRender(
          params,
          onViewLogs,
          DownloadFile,
          uploadDocFile,
          fileInput
        );
      },
    },
    {
      enableValue: true,
      field: "inn",
      headerName: "ИНН",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agNumberColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "period_ucode1",
      headerName: "Квартал",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (
          params.data.period_ucode === null ||
          params.data.period_ucode === undefined
        )
          return <div></div>;
        return <div>{params.data.period_ucode % 10} Квартал</div>;
      },
    },
    {
      enableValue: true,
      field: "period_ucode2",
      headerName: "Год",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (
          params.data.period_ucode === null ||
          params.data.period_ucode === undefined
        )
          return <div></div>;
        return <div>{String(params.data.period_ucode).slice(0, 4)}</div>;
      },
    },
    {
      enableValue: true,
      field: "act_doc_type_name",
      headerName: "Документ",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agNumberColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "save_date",
      headerName: "Дата сохранения",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "visit_date",
      headerName: "Дата визита указанная в документе",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "doc_number",
      headerName: "Номер документа",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "doc_date",
      headerName: "Дата документа",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDateTime(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "email",
      headerName: "Адрес электронной почты указанный в документе",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
  ]);

  const [inn, setInn] = useState("");
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);
  const [docType, setDocType] = useState(null);
  const [docNumber, setDocNumber] = useState("");

  const [docDateStart, setDocDateStart] = useState("");
  const [docDateEnd, setDocDateEnd] = useState("");
  const [saveDateStart, setSaveDateStart] = useState("");
  const [saveDateEnd, setSaveDateEnd] = useState("");
  const [visitDateStart, setVisitDateStart] = useState("");
  const [visitDateEnd, setVisitDateEnd] = useState("");
  const [operDateStart, setOperDateStart] = useState("");
  const [operDateEnd, setOperDateEnd] = useState("");

  useEffect(() => {
    getYears();
    getQuarters();
    getTypes();
  }, []);

  const DownloadFile = async (doc_id) => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.DOC_API_URL + `/export-docs`,
        {
          p_ACT_DOC_IDS: [doc_id],
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

  const DownloadFiles = async () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Выберите документы для выгрузки!");
      return;
    }
    setLoad(true);
    try {
      const result = await axios.post(
        variables.DOC_API_URL + `/export-docs`,
        {
          p_ACT_DOC_IDS: selectedRows.map((row) => row.act_doc_id),
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
    }
    setLoad(false);
  };

  const uploadDocFile = async (doc_id) => {
    console.log(doc_id, fileInput);
    if (fileInput.current.files.length === 0) {
      alert("Прикрепите файл!");
      return false;
    }

    setLoad(true);
    let result = true;
    const formData = new FormData();
    formData.append(
      "file",
      fileInput.current.files[0],
      fileInput.current.files[0].name
    );
    console.log(formData.get("p_BASEDOCDATA"));
    try {
      const result = await axios.post(
        variables.DOC_API_URL +
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
      result = false;
    }
    setLoad(false);
    return true;
  };

  const onViewLogs = async (doc_id) => {
    setLoad(true);
    try {
      const result = await axios.get(
        variables.DOC_API_URL + `/document-log/${doc_id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      return result.data;
    } catch (e) {
      console.log(e);
      setError(e);
      setLogs(null);
      result = false;
    }
    setLoad(false);
    return [];
  };

  const getQuarters = async () => {
    try {
      const result = await axios.get(variables.DOC_API_URL + `/quarters`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
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
      const result = await axios.get(variables.DOC_API_URL + `/years`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
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
      const result = await axios.get(variables.DOC_API_URL + `/doc_types`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setTypes([{ value: null, name: "Не важно", code: null }, ...result.data]);
      setDocType({ value: null, name: "Не важно", code: null });
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const openFilters = () => {
    setFilters(!is_open_filters);
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

  const parseInn = (e) => {
    if (e === '') {
        setInn('');
        return ;
    }
    e = e.match(/^\d*/)[0];
    if (e === '') {
        return ;
    }
    e = e.length > 12 ? e.slice(0, 12) : e;
    setInn(e);
  };

  const onSearchClick = async () => {
    if (quarter === null || year === null) return;
    if (inn !== "")
      if (inn.length < 10 || inn.length > 12) {
        alert("ИНН должен содержать от 10 до 12 цифр!");
        return;
      }
    setLoad(true);

    try {
      const result = await axios.post(
        variables.DOC_API_URL + `/get-documents-count`,
        {
          PERIOD_CODE: quarter === "" ? null : quarter.value,
          PERIOD_YEAR: year === null ? null : year.value,
          INN: inn === "" ? null : inn,
          DOCDATESTART: docDateStart === "" || docDateStart === null ? null : docDateStart.toISOString().replace('000Z', '300Z'),
          DOCDATESTOP: docDateEnd === "" || docDateEnd === null ? null : docDateEnd.toISOString().replace('000Z', '300Z'),
          SAVEDATESTART: saveDateStart === "" || saveDateStart === null ? null : saveDateStart.toISOString().replace('000Z', '300Z'),
          SAVEDATESTOP: saveDateEnd === "" || saveDateEnd === null ? null : saveDateEnd.toISOString().replace('000Z', '300Z'),
          VISITDATESTART: visitDateStart === "" || visitDateStart === null ? null : visitDateStart.toISOString().replace('000Z', '300Z'),
          VISITDATESTOP: visitDateEnd === "" || visitDateEnd === null ? null : visitDateEnd.toISOString().replace('000Z', '300Z'),
          OPERATIONDATESTART: operDateStart === "" || operDateStart === null ? null : operDateStart.toISOString().replace('000Z', '300Z'),
          OPERATIONDATESTOP: operDateEnd === "" || operDateEnd === null ? null : operDateEnd.toISOString().replace('000Z', '300Z'),
          ActDocType: docType === null ? null : docType.value,
          DOCNUMBER: docNumber === "" ? null : docNumber,
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
      }
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
        console.log("[Datasource] - rows requested by grid: ", params.request);
        const startRow = params.request.startRow;
        const endRow = params.request.endRow;
        setLoad(true);
        try {
          const result = await axios.post(
            variables.DOC_API_URL + `/get-documents`,
            {
              PERIOD_CODE: quarter === "" ? null : quarter.value,
              PERIOD_YEAR: year === null ? null : year.value,
              INN: inn === "" ? null : inn,
              DOCDATESTART: docDateStart === "" ? null : docDateStart,
              DOCDATESTOP: docDateEnd === "" ? null : docDateEnd,
              SAVEDATESTART: saveDateStart === "" ? null : saveDateStart,
              SAVEDATESTOP: saveDateEnd === "" ? null : saveDateEnd,
              VISITDATESTART: visitDateStart === "" ? null : visitDateStart,
              VISITDATESTOP: visitDateEnd === "" ? null : visitDateEnd,
              OPERATIONDATESTART: operDateStart === "" ? null : operDateStart,
              OPERATIONDATESTOP: operDateEnd === "" ? null : operDateEnd,
              ActDocType: docType === null ? null : docType.value,
              DOCNUMBER: docNumber === "" ? null : docNumber,

              page: startRow / (endRow - startRow),
              limit: endRow - startRow,
              order_by:
                params.request.sortModel.length === 0
                  ? "SAVE_DATE"
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
        variables.DOC_API_URL + `/get-documents-excel`,
        {
          PERIOD_CODE: quarter === "" ? null : quarter.value,
          PERIOD_YEAR: year === null ? null : year.value,
          INN: inn === "" ? null : inn,
          DOCDATESTART: docDateStart === "" ? null : docDateStart,
          DOCDATESTOP: docDateEnd === "" ? null : docDateEnd,
          SAVEDATESTART: saveDateStart === "" ? null : saveDateStart,
          SAVEDATESTOP: saveDateEnd === "" ? null : saveDateEnd,
          VISITDATESTART: visitDateStart === "" ? null : visitDateStart,
          VISITDATESTOP: visitDateEnd === "" ? null : visitDateEnd,
          OPERATIONDATESTART: operDateStart === "" ? null : operDateStart,
          OPERATIONDATESTOP: operDateEnd === "" ? null : operDateEnd,
          ActDocType: docType === null ? null : docType.value,
          DOCNUMBER: docNumber === "" ? null : docNumber,

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
      link.setAttribute("download", "Документы.xlsx"); //or any other extension
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

  const onGridReady = useCallback((params) => {
    onSearchClick();
  }, []);

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
      <Breadcrumb pageName="Сформированные документы" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-3">
            <Card name="Период">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
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
          <div className="col-span-9">
            <Card name="Параметры документов">
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

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Тип документа
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={doc_types}
                        value={docType}
                        onChange={(e) => setDocType(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Номер документа
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={docNumber}
                        name={"docNumber"}
                        id={"docNumber"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setDocNumber(e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата документа (С)"}
                      selected={docDateStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setDocDateStart(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата документа (По)"}
                      selected={docDateEnd}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setDocDateEnd(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата сохранения (С)"}
                      selected={saveDateStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setSaveDateStart(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата сохранения (По)"}
                      selected={saveDateEnd}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setSaveDateEnd(date)
                      }></DateDefaultInput>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата визита (С)"}
                      selected={visitDateStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setVisitDateStart(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата визита (По)"}
                      selected={visitDateEnd}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setVisitDateEnd(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата операции (С)"}
                      selected={operDateStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setOperDateStart(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <DateDefaultInput
                      label={"Дата операции (По)"}
                      selected={operDateEnd}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setOperDateEnd(date)
                      }></DateDefaultInput>
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
            name="Cписок документов"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 1000, width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={dataColumns}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    rowModelType={"serverSide"}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
                    onGridReady={onGridReady}
                    autosize={true}
                    rowSelection={"multiple"}
                    suppressRowClickSelection={true}
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
                        }
                      ],
                      position: "left",
                    }}
                  />
                </div>
              </div>
            }
            buttons={
              <>
                {/*<IconButtonDownload onClick={() => Download()} />*/}
                <IconButtonDownload
                  onClick={() => DownloadFiles()}
                  title={"Выгрузить"}
                />
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

export default Documents;
