import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import CardFilter from "../../../components/UI/General/CardFilter/CardFilter.tsx";
import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

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

import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx";
import IconButtonMinus from "../../../components/UI/General/Buttons/IconButtonMinus.tsx";
import IconButtonPlus from "../../../components/UI/General/Buttons/IconButtonPlus.tsx";
import IconButtonPrint from "../../../components/UI/General/Buttons/IconButtonPrint.tsx";
import IconButtonX from "../../../components/UI/General/Buttons/IconButtonX.tsx";

let activeDataFilters = {};

const opisTypes = [
  { value: -1, name: "Не важно" },
  { value: 0, name: "Исходящая" },
  { value: 1, name: "Входящая" },
];

const OpisList = ({ token, personlog_id, resources }) => {
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
      field: "id_docinoutlog",
      headerName: "Пакет",
      resizable: true,
      sortable: true,
      rowGroup: false,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
      cellRenderer: "agGroupCellRenderer",
    },
    {
      enableValue: true,
      field: "createdate",
      headerName: "Дата оформления",
      resizable: true,
      sortable: true,
      rowGroup: false,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return showDate(params.getValue());
      },
      filter: "agDateColumnFilter",
    },
    {
      enableValue: true,
      field: "inputflag",
      headerName: "Вид описи",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("options", "InputFlag", token);
          console.log(values);
          params.success(values);
        },
        keyCreator: (params) => {
          return params.value.name;
        },
        valueFormatter: (params) => {
          return params.value.name;
        },
      },
    },
    {
      enableValue: true,
      field: "id_listofdocinoutlog",
      headerName: "В пакете",
      resizable: true,
      sortable: true,
      rowGroup: false,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "processtypename",
      headerName: "Процесс",
      resizable: true,
      sortable: true,
      rowGroup: false,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("options", "RequestType", token);
          console.log(values);
          params.success(values);
        },
        keyCreator: (params) => {
          return params.value.name;
        },
        valueFormatter: (params) => {
          return params.value.name;
        },
      },
    },
    {
      enableValue: true,
      field: "processnum",
      headerName: "Номер",
      resizable: true,
      sortable: true,
      rowGroup: false,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "arcprocessnum",
      headerName: "Номер дела",
      resizable: true,
      sortable: true,
      rowGroup: false,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "fullsubjectname",
      headerName: "Лицензиат",
      resizable: true,
      sortable: true,
      rowGroup: false,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "fulladdressur",
      headerName: "Юридический адерс",
      resizable: true,
      sortable: true,
      rowGroup: false,
      filter: "agTextColumnFilter",
    },
  ]);

  //Filters
  // Дата регистрации
  const [useDate, onSetUseDate] = useState(false);
  const [dateStart, onSetDateStart] = useState(last_date);
  const [dateEnd, onSetDateEnd] = useState(current_date);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    setLoad(false);
  }, []);

  useEffect(() => {
    console.log(gridRef);
    if (gridRef && "current" in gridRef) {
      disableFilters();
    }
  }, [count]);

  const disableFilters = async () => {
    disableFiltersList(DataColumns, gridRef);
  };

  const getFiltersData = async () => {
    const filters = await getJsonData(DataColumns, gridRef);
    return {
      FilterExt: {
        StartDate: useDate ? dateStart.toISOString().split("T")[0] : null,
        EndDate: useDate ? dateEnd.toISOString().split("T")[0] : null,
      },
      ...filters,
    };
  };

  const onSearchClick = async () => {
    setLoad(true);
    setError(null);
    console.log("this");
    activeDataFilters = await getFiltersData();
    console.log(activeDataFilters);
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/OpisList/count?personlog_id=${personlog_id}`,
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
              `/Api/OpisList/export?personlog_id=${personlog_id}`,
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
            rowCount: result.data.length,
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

  const detailCellRendererParams = useMemo<any>(() => {
    return {
      // level 2 grid options
      detailGridOptions: {
        columnDefs: [
          {
            enableValue: true,
            field: "doctypename",
            headerName: "Тип",
            resizable: true,
            sortable: true,
            rowGroup: false,
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "docnumber",
            headerName: "Номер",
            resizable: true,
            sortable: true,
            rowGroup: false,
            filter: "agNumberColumnFilter",
          },
          {
            enableValue: true,
            field: "docdate",
            headerName: "Дата",
            resizable: true,
            sortable: true,
            rowGroup: false,
            cellRenderer: (params) => {
              if (params.getValue() === null || params.getValue() === undefined)
                return <div></div>;
              return showDate(params.getValue());
            },
            filter: "agDateColumnFilter",
          },
          {
            enableValue: true,
            field: "pagecount",
            headerName: "Листов",
            resizable: true,
            sortable: true,
            rowGroup: false,
            filter: "agNumberColumnFilter",
          },
        ],
        defaultColDef: {
          flex: 1,
        },
        groupDefaultExpanded: 0,
        masterDetail: true,
        detailRowHeight: 240,
        localeText: AG_GRID_LOCALE_RU,
      },
      getDetailRowData: async (params) => {
        setLoad(true);
        setError(null);
        console.log(params);
        try {
          const result = await axios.post(
            variables.API_URL +
              `/Api/OpisList/export_documents?personlog_id=${personlog_id}`,
            {
              ID_DOCINOUTLOG:
                params.data.id_docinoutlog === undefined
                  ? null
                  : params.data.id_docinoutlog,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          if (result === null) throw Error("Ошибка в запросе");
          if (result.status !== 200) throw Error(result);
          params.successCallback(result.data);
        } catch (e) {
          console.log(e);
          setError(e);
        }
        setLoad(false);
      },
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
      <Breadcrumb pageName="Приемо-передаточная опись" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Приемо-передаточная опись"
            buttons={
              <>
                <button
                  type="button"
                  onClick={() => onSearchClick()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Поиск
                </button>
                <IconButtonPlus />
                <IconButtonMinus />
                <IconButtonPrint />
                <IconButtonX
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  title={"Удалить"}
                />
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
                    groupDisplayType={"groupRows"}
                    detailCellRendererParams={detailCellRendererParams}
                    masterDetail={true}
                    groupDefaultExpanded={0}
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
                {!is_open_filters ? null : (
                  <div className="basis-1/3 overflow-y-auto">
                    <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                      <CardFilter>
                        <form action="#">
                          <div className="w-full">
                            <div className="mx-auto w-full max-w-lg divide-y divide-stroke rounded-xl bg-white/5">
                              <DateRangeCard
                                isChecked={useDate}
                                onChangeChecked={onSetUseDate}
                                name={"Дата регистрации"}
                                inputValueMin={dateStart}
                                inputChangeMin={onSetDateStart}
                                inputValueMax={dateEnd}
                                inputChangeMax={onSetDateEnd}
                              />
                            </div>
                          </div>
                        </form>
                      </CardFilter>
                    </div>
                  </div>
                )}
              </div>
            </>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default OpisList;
