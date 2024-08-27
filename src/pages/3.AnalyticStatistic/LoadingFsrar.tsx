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
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import TextInput from "../../components/UI/General/Inputs/TextInput";
import DocumentsInput from "../../components/UI/General/Inputs/DocumentsInput";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

//Модальное окно
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";

import {
  variables,
  showDate,
  AG_GRID_LOCALE_RU,
  getCurrentYear,
  getCurrentQuarter,
} from "../../variables";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

const LoadingFsrar = () => {
  const gridRef = useRef<AgGridReact>(null);
  const fileInput = createRef();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [is_open_filters, setFilters] = useState(true);

  // списки
  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);
  const [doc_types, setTypes] = useState([]);

  // значения по фильтрам
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);
  const [saveDateStart, setSaveDateStart] = useState("");
  const [docType, setDocType] = useState(null);
  const [saveDateEnd, setSaveDateEnd] = useState("");

  const [createDoc, setCreateDoc] = useState(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setcolumnDefs] = useState([
    {
      headerName: "Операции",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true, //перенос на несолько строк
      width: 120,
      minWidth: 50,
      maxWidth: 150,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        if (
          params.data.fsrar_files_id === null ||
          params.data.is_fsrar_file_exists !== 1
        )
          return <div></div>;
        return (
          <div className="p-1">
            <IconButtonDownload
              onClick={() => DownloadFile(params.data.fsrar_files_id)}
              title={"Выгрузка"}
              key={"Выгрузка"}></IconButtonDownload>
          </div>
        );
      },
    },
    {
      field: "doc_type",
      headerName: "Вид сведений",
      sortable: true,
      filter: "agSetColumnFilter",
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true, //перенос на несолько строк
      width: 600, //, minWidth: 100, maxWidth: 120
    },
    {
      field: "create_date",
      headerName: "Дата загрузки",
      sortable: true,
      filter: "agDateColumnFilter",
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true, //перенос на несолько строк
      width: 200, //, minWidth: 100, maxWidth: 120
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      field: "period_ucode",
      headerName: "Отчетный период",
      sortable: true,
      filter: "agSetColumnFilter",
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true, //перенос на несолько строк
      width: 200, //, minWidth: 100, maxWidth: 120
    },
      {
      field: "error_msg",
      headerName: "Статус",
      sortable: true,
      filter: "agSetColumnFilter",
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true, //перенос на несолько строк
      width: 200, //, minWidth: 100, maxWidth: 120
    },
  ]);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const getTypes = async () => {
    try {
      const result = await axios.get(variables.DOC_API_URL + `/fsrar_types`, {
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

  const DownloadFile = async (id) => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.DOC_API_URL + `/rar-objects-download`,
        {
          ID: id,
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
      else link.setAttribute("download", "document.xlsx"); //or any other extension
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
    try {
      const result = await axios.post(
        variables.DOC_API_URL + `/import-fsrar-file`,
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
      alert(
        "Отчет загружен в систему, производится его обработка. Для просмотра загруженного отчета дождитесь его обработки."
      );
    } catch (e) {
      console.log(e);
      setError(e);
      result = false;
    }
    setLoad(false);
    return true;
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

  //экспорт в Excel
  const Download = useCallback(() => {
    setLoad(true);
    gridRef.current!.api.exportDataAsExcel({
      processCellCallback: function (cell) {
        var cellVal = cell.value;
        switch (cell.column.colId) {
          case "OGRN":
            cellVal = " " + String(cellVal);
            break;
          case "LICBEGDATE":
          case "LICENDDATE":
          case "LICPUTDATE":
            cellVal = showDate(cellVal);
            break;
          default:
            break;
        }
        return cellVal;
      },
    });
    setLoad(false);
  }, []);

  const onSearch = async () => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.DOC_API_URL + `/rar-objects`,
        {
          PERIOD_CODE: quarter === null ? null : quarter.value,
          PERIOD_YEAR: year === null ? null : year.value,
          CREATEDATESTART:
            saveDateStart === "" || saveDateStart === null
              ? null
              : saveDateStart.toISOString().replace("000Z", "300Z"),
          CREATEDATEEND:
            saveDateEnd === "" || saveDateEnd === null
              ? null
              : saveDateEnd.toISOString().replace("000Z", "300Z"),
          ActDocType: docType === null ? null : docType.value,
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
      setRowData(result.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  useEffect(() => {
    getQuarters();
    getYears();
    getTypes();
  }, []);

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
      <Breadcrumb pageName="Загрузка файлов с отчетами РАТК" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12">
            <Card name="Фильтры">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/5">
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
                  <div className="w-full sm:w-1/5">
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
                  <div className="w-full sm:w-1/5">
                    <DateDefaultInput
                      label={"Дата загрузки (С)"}
                      selected={saveDateStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setSaveDateStart(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/5">
                    <DateDefaultInput
                      label={"Дата загрузки (По)"}
                      selected={saveDateEnd}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) =>
                        setSaveDateEnd(date)
                      }></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/5">
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
            name="Список отчетов"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs}
                    rowData={rowData}
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
                            suppressValues: true,
                            suppressPivots: true,
                            suppressPivotMode: true,
                          },
                        },
                        {
                          id: "filters",
                          labelDefault: "Filters",
                          labelKey: "filters",
                          iconKey: "filter",
                          toolPanel: "agFiltersToolPanel",
                          minWidth: 180,
                          maxWidth: 400,
                          width: 250,
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
                <DefaultIconModalWide
                  icon={
                    <>
                      <DocumentArrowDownIcon className="h-6 w-6 stroke-[#637381] hover:stroke-primary cursor-pointer" />
                    </>
                  }
                  title={"Загрузка файла"}
                  name={"Загрузка файла"}
                  textbutton={"Загрузка файла"}
                  onClickText={"Загрузить"}
                  onClickClassName={
                    "m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                  }
                  children={
                    <>
                      <form action="#">
                        <div className="mb-5.5 flex flex-col gap-5.5 text-left">
                          <div className="w-full">
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
                      </form>
                    </>
                  }
                  onClick={() => uploadDocFile()}></DefaultIconModalWide>
                <button
                  type="button"
                  onClick={onSearch}
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
export default LoadingFsrar;
