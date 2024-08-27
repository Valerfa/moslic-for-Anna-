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
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import {
  variables,
  AG_GRID_LOCALE_RU,
  VIO_API_URL,
  showDate,
  getCurrentQuarter,
  getCurrentYear,
} from "../../variables";

registerLocale("ru", ru);

const forms = {
  "11": "Форма 7",
  "07": "Форма 7",
  "7": "Форма 7",
  "37": "Форма 7",
  "12": "Форма 8",
  "08": "Форма 8",
  "8": "Форма 8",
  "38": "Форма 8",
};

const filter_use = false;

const ExceptionCorrection = () => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);
  const [reestrs, setReestrs] = useState([
    { value: null, name: "Не важно" },
    { value: 1, name: "Лицензиаты" },
    { value: 2, name: "Торговцы пивом" },
    { value: 3, name: "Торговцы спиртосодержащей продукции" },
  ]);
  const [operations, setOpers] = useState([
    { value: null, name: "Не важно" },
    { value: 0, name: "Удаление" },
    { value: 1, name: "Добавление" },
  ]);

  const [is_open_filters, setFilters] = useState(true);
  const [limit] = useState(1);

  const [inn, setInn] = useState("");
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);
  const [date_start, setStart] = useState("");
  const [date_end, setEnd] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [kindOper, setOper] = useState(operations[0]);
  const [kindReest, setReestr] = useState(reestrs[0]);
  const [infReest, setInf] = useState(null);

  const [data, setData] = useState([]);
  const [selRows, setSelectedRows] = useState([]);
  const [dataCount, setCount] = useState(0);
  const [dataColumns] = useState([
    {
      enableValue: true,
      field: "id",
      headerName: "Операция",
      resizable: true,
      sortable: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (
          params.data.del_flg_name === null ||
          params.data.del_flg_name === undefined
        )
          return <div></div>;
        if (params.data.del_flg_name == "Удаление")
          return (
            <div>
              <button
                onClick={() => addViolation(params.data)}
                className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Удалить
              </button>
            </div>
          );
        else if (params.data.del_flg_name == "Добавление")
          return (
            <div>
              <button
                onClick={() => deleteViolation(params.data)}
                className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Удалить
              </button>
            </div>
          );

        return <div></div>;
      },
    },
    {
      enableValue: true,
      field: "del_flg_name",
      headerName: "Вид операции",
      resizable: true,
      sortable: true,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "createdate",
      headerName: "Дата операции",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return showDate(params.getValue());
      },
      filter: filter_use ? "agDateColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "form_code",
      headerName: "Форма",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return forms[params.getValue()];
      },
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "period_ucode",
      headerName: "Период",
      resizable: true,
      sortable: true,
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
      field: "inn",
      headerName: "ИНН",
      resizable: true,
      sortable: true,
      filter: filter_use ? "agTextColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "full_subject_name",
      headerName: "Субъект",
      resizable: true,
      sortable: true,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "note",
      headerName: "Комментарий",
      resizable: true,
      sortable: true,
      filter: filter_use ? "agTextColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "del_reason_name",
      headerName: "Вид нарушения",
      resizable: true,
      sortable: true,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
  ]);

  useEffect(() => {
    getQuarters();
    getYears();
  }, []);

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

  const onSearchClick = async () => {
    if (quarter === null && year === null) return;

    if (inn !== "")
      if (inn.length < 10 || inn.length > 12) {
        alert("ИНН должен содержать от 10 до 12 цифр!");
        return;
      }
    setLoad(true);

    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/get-exception-correction-count`,
        {
          period_code: quarter === null ? null : quarter.value,
          period_year: year === null ? null : year.value,
          inn: inn === "" ? null : inn,
          date_start:
            date_start === "" || date_start === null
              ? null
              : date_start.toISOString().replace("000Z", "300Z"),
          date_end:
            date_end === "" || date_end === null
              ? null
              : date_end.toISOString().replace("000Z", "300Z"),
          reestr: kindReest === null ? null : kindReest.value,
          operation: kindOper === null ? null : kindOper.value,
          is_inf: infReest,
          note: note === "" ? null : note,
          title: title === "" ? null : title,
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
            variables.VIO_API_URL + `/get-exception-correction-list`,
            {
              period_code: quarter === null ? null : quarter.value,
              period_year: year === null ? null : year.value,
              inn: inn === "" ? null : inn,
              ddate_start:
                date_start === "" || date_start === null
                  ? null
                  : date_start.toISOString().replace("000Z", "300Z"),
              date_end:
                date_end === "" || date_end === null
                  ? null
                  : date_end.toISOString().replace("000Z", "300Z"),
              reestr: kindReest === null ? null : kindReest.value,
              operation: kindOper === null ? null : kindOper.value,
              is_inf: infReest,
              note: note === "" ? null : note,
              title: title === "" ? null : title,

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

  const deleteViolation = async (violater) => {
    console.log(violater);

    setLoad(true);
    let result = true;
    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/delete-declarant-correction`,
        {
          p_REESTR_TYPE: violater.reestr,
          p_PERIOD_UCODE: violater.period_ucode,
          p_INN: violater.inn,
          p_MODE: violater.del_reason === null ? 0 : violater.del_reason,
          p_NOTE: violater.note,
          p_FORM_CODE: violater.form_code,
          p_USER_NAME: user,
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
      onSearchClick();
    } catch (e) {
      console.log(e);
      setError(e);
      result = false;
    }
    setLoad(false);
    return result;
  };

  const addViolation = async (violater) => {
    console.log(violater);

    setLoad(true);
    let result = true;
    try {
      const result = await axios.post(
        variables.VIO_API_URL + `/add-declarant-correction`,
        {
          p_REESTR_TYPE: violater.reestr,
          p_PERIOD_UCODE: violater.period_ucode,
          p_INN: violater.inn,
          p_MODE: violater.del_reason === null ? 0 : violater.del_reason,
          p_NOTE: violater.note,
          p_FORM_CODE: violater.form_code,
          p_USER_NAME: user,
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
      onSearchClick();
    } catch (e) {
      console.log(e);
      setError(e);
      result = false;
    }
    setLoad(false);
    return result;
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
      <Breadcrumb pageName="Исключения из реестра нарушителей" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-5">
            <Card name="Период">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
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
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <DateDefaultInput
                      label={"Дата операции (С)"}
                      selected={date_start}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setStart(date)}></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <DateDefaultInput
                      label={"Дата операции (По)"}
                      selected={date_end}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setEnd(date)}></DateDefaultInput>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          <div className="col-span-7">
            <Card name="Основные сведения">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <TextInput
                      label={"ИНН"}
                      value={inn}
                      name={"INN"}
                      id={"INN"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseInn(e)}
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <TextInput
                      label={"Наименование субъекта"}
                      value={title}
                      name={"TITLE"}
                      id={"TITLE"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setTitle(e)}
                    />
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Вид реестра
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={reestrs}
                        value={kindReest}
                        onChange={(e) => setReestr(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Вид операции
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={operations}
                        value={kindOper}
                        onChange={(e) => setOper(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <TextInput
                      label={"Комментарий"}
                      value={note}
                      name={"NOTE"}
                      id={"NOTE"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setNote(e)}
                    />
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
            name="Список исключений"
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
                    cacheBlockSize={100}
                    onGridReady={onGridReady}
                    autosize={true}
                    rowSelection={"single"}
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

export default ExceptionCorrection;
