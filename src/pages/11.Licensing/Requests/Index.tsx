import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

// Контент - По типам

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../../variables.tsx";

import {
  getJsonData,
  getFullJsonData,
  disableFiltersList,
  getFiltersLists,
} from "../../../utils/gridUtils.tsx";

import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";
import IconButtonDownload from "../../../components/UI/General/Buttons/IconButtonDownload.tsx";
import SelectCard from "../../../components/UI/General/Inputs/Filters/SelectCard.tsx";
import IconButtonList from "../../../components/UI/General/Buttons/IconButtonList.tsx";
import { Link } from "react-router-dom";
import IconButtonCheck from "../../../components/UI/General/Buttons/IconButtonCheck.tsx";
import IconButtonTest from "../../../components/UI/General/Buttons/IconButtonTest.tsx";
import IconButtonQuestion from "../../../components/UI/General/Buttons/IconButtonQuestion.tsx";
import ButtonDropdownTransferRequest from "./UI/ButtonDropdownTransferRequest.tsx";
import IconButtonWatch from "../../../components/UI/General/Buttons/IconButtonWatch.tsx";
import IconButtonEdit from "../../../components/UI/General/Buttons/IconButtonEdit.tsx";

let activeDataFilters = {};

const timeLimits = [
  { value: 1, name: "Сегодняшние" },
  { value: 2, name: "За текущую неделю" },
  { value: 3, name: "За последние 10 дней" },
  { value: 4, name: "За последний месяц" },
  { value: 5, name: "За последний год" },
];

const states = [
  { value: 0, name: "Не отправлялось" },
  { value: 1, name: "Успех" },
  { value: 2, name: "Прикладная ошибка" },
  { value: -2, name: "Ошибка коммуникации" },
  { value: -1, name: "Системная ошибка" },
];

const Requests = ({ token, personlog_id, resources }) => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const last_date = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0);
  const [DataColumns] = useState([
    {
      enableValue: true,
      field: "resultcode",
      headerName: "Результат",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        for (const state of states) {
          if (state.value === params.getValue()) return state.name;
        }
      },
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "abonentname",
      headerName: "Запрос/Документ",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "createdate",
      headerName: "Дата создания",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return showDate(params.getValue());
      },
      filter: "agDateColumnFilter",
    },
    {
      enableValue: true,
      field: "senddate",
      headerName: "Дата отправки",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return showDate(params.getValue());
      },
      filter: "agDateColumnFilter",
    },
    {
      enableValue: true,
      field: "webrequestguid",
      headerName: "GUID запроса",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "fullpersonname",
      headerName: "Кто создал",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
  ]);

  const [timeLimits, setTimeLimits] = useState([]);
  const [timeLimitation, onSetTimeLimitation] = useState(null);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    getFiltersResults();
  }, []);

  const getFiltersResults = async () => {
    setLoad(true);
    const data = await getFiltersLists("dicts", "times", token);
    setTimeLimits(data.map((el) => ({ value: el.id, name: el.name })));
    onSetTimeLimitation({ value: data[0].id, name: data[0].name });
    setLoad(false);
  };

  useEffect(() => {
    console.log(gridRef);
    if (gridRef && "current" in gridRef) {
      disableFilters();
    }
  }, [count]);

  useEffect(() => {
    console.log(timeLimitation);
  }, [timeLimitation]);

  const disableFilters = async () => {
    console.log(gridRef);
    disableFiltersList(DataColumns, gridRef);
  };

  const getFiltersData = async () => {
    const filters = await getJsonData(DataColumns, gridRef);

    return {
      TimeVal: Number(timeLimitation !== null ? timeLimitation.value : "0"),
      ...filters,
    };
  };

  const onSearchClick = async () => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData();
    try {
      console.log(timeLimitation.value);
      const result = await axios.post(
        variables.API_URL +
          `/Api/RequestsList/count?personlog_id=${personlog_id}`,
        activeDataFilters,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setCount(result.data.count);
      var datasource = getServerSideDatasource(result.data.count);
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
      return 0;
    }
  };

  const getServerSideDatasource = (count) => {
    return {
      getRows: async (params) => {
        setLoad(true);
        setError(null);

        try {
          const result = await axios.post(
            variables.API_URL +
              `/Api/RequestsList/export?personlog_id=${personlog_id}`,
            await getFullJsonData(params.request, activeDataFilters),
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          if (result.status !== 200) throw Error(result);
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

  const Download = async () => {
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
        variables.API_URL +
          `/Api/RequestsList/export_to_excel?personlog_id=${personlog_id}`,
        {
          ...activeDataFilters,
          sort: sort_info === null ? "id_license" : sort_info.colId,
          order: sort_info === null ? "asc" : sort_info.sort,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      const fileType = result.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      console.log(fileType);
      link.setAttribute("download", "Список лицензий.xlsx"); //or any other extension
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
      <Breadcrumb pageName="Заявки" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            name={
              <>
                Список заявок для оперативной работы
                <ButtonDropdownTransferRequest />
                <Link to="/licensing/request-view" relative="path">
                  <IconButtonWatch title="Просмотр заявки"></IconButtonWatch>
                </Link>
                <Link to="/licensing/request-expertise" relative="path">
                  <IconButtonEdit title="Редактирование заявки"></IconButtonEdit>
                </Link>
                <Link to="/okno/status-request">
                  {" "}
                  <IconButtonList title={"Просмотр статуса заявки"} />
                </Link>
                <IconButtonCheck title={"Успех"} />
                <IconButtonQuestion title={"Не отправлялось"} />
              </>
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
            }>
            <>
              <div className="flex flex-row ag-grid-h">
                <div
                  className="flex flex-col ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: "100%", width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={DataColumns}
                    defaultColDef={defaultColDef}
                    pivotMode={false}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    rowModelType={"serverSide"}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
                    suppressApplyFilter={true}
                    autosize={true}
                    rowSelection={"single"}
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
                            suppressColumnFilter: false,
                            suppressColumnSelectAll: false,
                            suppressColumnExpandAll: false,
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
            </>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default Requests;
