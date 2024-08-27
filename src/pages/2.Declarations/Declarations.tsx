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

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import {
  variables,
  DeclDataColumns,
  AG_GRID_LOCALE_RU,
  getCurrentYear,
  getCurrentQuarter,
} from "../../variables";

const codes = [
  { value: null, name: "Все" },
  { value: "1", name: "Первичная" },
  { value: "2", name: "Корректирующая" },
];

const forms = [
  { value: null, name: "Все" },
  { value: "7", name: "Форма 7" },
  { value: "8", name: "Форма 8" },
];

const is_null_list = [
  { value: null, name: "Не важно" },
  { value: 1, name: "Нулевая" },
  { value: 0, name: "Не нулевая" },
];

const is_stocks_list = [
  { value: null, name: "Все" },
  { value: 0, name: "Нет остатков" },
  { value: 1, name: "Есть остатки" },
];

const fields = [
  { table_field: "period_code", display_name: "Квартал" },
  { table_field: "period_year", display_name: "Год" },
  { table_field: "type_code", display_name: "ИНН" },
  { table_field: "is_null", display_name: "Вид декларации" },
  {
    table_field: "is_right_stocks",
    display_name: "Нулевая декларация",
  },
  { table_field: "form_code", display_name: "Номер формы" },
  { table_field: "create_date", display_name: "Дата приемки" },
];

const Declarations = () => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");

  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);

  const [is_open_filters, setFilters] = useState(true);
  const [limit] = useState(1);

  const [inn, setInn] = useState("");
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);
  const [date_start, setStart] = useState("");
  const [date_end, setEnd] = useState("");
  const [is_null, setNull] = useState(is_null_list[0]);
  const [is_stocks, setStocks] = useState(is_stocks_list[0]);
  const [formCode, setForm] = useState(forms[0]);
  const [typeCode, setType] = useState(codes[0]);

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    getQuarters();
    getYears();
    setLoad(false);
  }, []);

  const getQuarters = async () => {
    setError(null);
    try {
      const result = await axios.get(variables.DECL_API_URL + `/quarters`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (result.status !== 200) throw Error(result);
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
    setError(null);
    try {
      const result = await axios.get(variables.DECL_API_URL + `/years`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (result.status !== 200) throw Error(result);
      setYears([
        { value: null, name: "Не важно" },
        ...result.data.map((i) => ({ value: i.year, name: i.year })),
      ]);
      setYear(getCurrentYear());
    } catch (e) {
      console.log(e);
      setError(e);
    }
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
    //     if (quarter === null && year === null) return;
    if (inn !== "")
      if (inn.length !== 10 && inn.length !== 12) {
        alert("ИНН должен содержать 10 или 12 цифр!");
        return;
      }
    setLoad(true);
    setError(null);

    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/declarations/count`,
        {
          period_code: quarter === null ? null : quarter.code,
          period_year: year === null ? null : year.value,
          inn: inn === "" ? null : inn,
          create_date_start:
            date_start === "" || date_start === null
              ? null
              : date_start.toISOString().replace("000Z", "300Z"),
          create_date_end:
            date_end === "" || date_end === null
              ? null
              : date_end.toISOString().replace("000Z", "300Z"),
          form_code: formCode === null ? null : formCode.value,
          type_code: typeCode === null ? null : typeCode.value,
          is_null: is_null === null ? null : is_null.value,
          is_right_stocks: is_stocks === null ? null : is_stocks.value,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      var count = result.data.count;
      if (count > 0) {
        setCount(count);
      }
      console.log("this");
      var datasource = getServerSideDatasource(count);
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
    }
  };

  const getServerSideDatasource = (count) => {
    return {
      getRows: async (params) => {
        console.log("[Datasource] - rows requested by grid: ", params.request);
        const startRow = params.request.startRow;
        const endRow = params.request.endRow;
        setLoad(true);
        setError(null);
        try {
          const result = await axios.post(
            variables.DECL_API_URL + `/declarations`,
            {
              period_code: quarter === null ? null : quarter.code,
              period_year: year === null ? null : year.value,
              inn: inn === "" ? null : inn,
              create_date_start:
                date_start === "" || date_start === null
                  ? null
                  : date_start.toISOString().replace("000Z", "300Z"),
              create_date_end:
                date_end === "" || date_end === null
                  ? null
                  : date_end.toISOString().replace("000Z", "300Z"),
              form_code: formCode === null ? null : formCode.value,
              type_code: typeCode === null ? null : typeCode.value,
              is_null: is_null === null ? null : is_null.value,
              is_right_stocks: is_stocks === null ? null : is_stocks.value,

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
          setError(e);
        }
        setLoad(false);
      },
    };
  };

  const changeDecl = (decl) => {
    if (decl.id < 0) {
      return;
    }
    const link = document.createElement("a");
    link.href =
      `declaration?id=${decl.id}&inn=${decl.inn}&type_code=${decl.type_code}&corr_number=${decl.corr_number}` +
      `&form_code=${decl.form_code}&period_year=${decl.period_year}&period_code=${decl.period_code}` +
      `&decl_mode=${decl.decl_mode}&decl_date=${decl.decl_date}&is_null=${decl.is_null}&is_right_stocks=${decl.is_right_stocks}&excel_id=${decl.excel_id}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    changeDecl(selectedRows[0]);
  }, []);

  const Download = async (path) => {
    if (confirm("Вы уверены?")) {
      console.log("Выгрузка");
    } else {
      // Do nothing!
      return;
    }
    setLoad(true);
    setError(null);
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
        variables.DECL_API_URL + `/declarations_to_excel`,
        {
          period_code: quarter === "" ? null : quarter.period_code,
          period_year: year === null ? null : year.value,
          inn: inn === "" ? null : inn,
          create_date_start:
            date_start === "" || date_start === null
              ? null
              : date_start.toISOString().replace("000Z", "300Z"),
          create_date_end:
            date_end === "" || date_end === null
              ? null
              : date_end.toISOString().replace("000Z", "300Z"),
          form_code: formCode === null ? null : formCode.value,
          type_code: typeCode === null ? null : typeCode.value,
          is_null: is_null === null ? null : is_null.value,
          is_right_stocks: is_stocks === null ? null : is_stocks.value,

          order_by: sort_info === null ? "id" : sort_info.colId,
          order_stream: sort_info === null ? "asc" : sort_info.sort,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result.data.error);
      const fileType = result.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      console.log(fileType);
      link.setAttribute("download", "Декларации.xlsx"); //or any other extension
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
      <Breadcrumb pageName="Список деклараций" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-5">
            <Card name="Период">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
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
                  <div className="w-full sm:w-1/2">
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
                      label={"Дата начала (С)"}
                      selected={date_start}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setStart(date)}></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <DateDefaultInput
                      label={"Дата окончания (По)"}
                      selected={date_end}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setEnd(date)}></DateDefaultInput>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          <div className="col-span-7">
            <Card name="Параметры документов">
              <form action="#">
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
                      htmlFor="emailAddress">
                      Наличие остатков
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={is_stocks_list}
                        value={is_stocks}
                        onChange={(e) => setStocks(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="formAddress">
                      Номер Формы
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={forms}
                        value={formCode}
                        onChange={(e) => setForm(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Нулевая
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={is_null_list}
                        value={is_null}
                        onChange={(e) => setNull(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Вид декларации
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={codes}
                        value={typeCode}
                        onChange={(e) => setType(e)}
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
            name="Cписок деклараций"
            children={
              <>
                <div style={{ height: "100%", width: "100%" }}>
                  <div
                    className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{ height: 1000, width: "100%" }}>
                    <AgGridReact
                      ref={gridRef}
                      columnDefs={DeclDataColumns}
                      defaultColDef={defaultColDef}
                      pivotMode={false}
                      autoGroupColumnDef={autoGroupColumnDef}
                      localeText={AG_GRID_LOCALE_RU}
                      rowModelType={"serverSide"}
                      pagination={true}
                      paginationPageSize={100}
                      cacheBlockSize={100}
                      autosize={true}
                      rowSelection={"single"}
                      onSelectionChanged={onSelectionChanged}
                      sideBar={{
                        toolPanels: [
                          {
                            enablePivot: false,
                            id: "columns",
                            labelDefault: "Columns",
                            labelKey: "columns",
                            iconKey: "columns",
                            toolPanel: "agColumnsToolPanel",
                            minWidth: 225,
                            width: 225,
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
                          //                             {
                          //                                 id: "filters",
                          //                                 labelDefault: "Filters",
                          //                                 labelKey: "filters",
                          //                                 iconKey: "filter",
                          //                                 toolPanel: "agFiltersToolPanel",
                          //                                 minWidth: 180,
                          //                                 maxWidth: 400,
                          //                                 width: 250,
                          //                             },
                        ],
                        position: "left",
                      }}
                    />
                  </div>
                </div>
              </>
            }
            buttons={
              <>
                <IconButtonDownload
                  onClick={() => Download()}
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

export default Declarations;
