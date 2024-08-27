import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import CardFilter from "../../../components/UI/General/CardFilter/CardFilter.tsx";
import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

import IconButtonDownload from "../../../components/UI/General/Buttons/IconButtonDownload.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

// Карточки фильтров
import CheckboxCard from "../../../components/UI/General/Inputs/Filters/CheckboxCard.tsx";
import RadioCard from "../../../components/UI/General/Inputs/Filters/RadioCard.tsx";

import {
  variables,
  AG_GRID_LOCALE_RU,
  showDate,
  mathOperations,
} from "../../../variables.tsx";

import {
    getJsonData,
    getFiltersLists,
    getFullJsonData,
    disableFiltersList,
} from "../../../utils/gridUtils.tsx";
import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx";

let activeDataFilters = {};

const types = [
  {id: 0, name: 'лицензии'},
  {id: 1, name: 'объекты'}
]

const StopAndNull = ({token, personlog_id, resources}) => {
  const gridRef = useRef<AgGridReact>(null);
  const gridRef2 = useRef<AgGridReact>(null);

  const current_date = new Date();
  const last_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0);

  //filters
  const [currentType, setCurrentType] = useState(types[0]);

  const [states, setStates] = useState([]);

  // Дата решения
  const [useDate, onSetUseDate] = useState(false);
  const [dateStart, onSetDateStart] = useState(last_date);
  const [dateEnd, onSetDateEnd] = useState(current_date);


  const [DataColumns] = useState([
      {
          enableValue: true,
          field: "detail",
          headerName: "",
          resizable: true,
          sortable: true,
          filter: "agTextColumnFilter",
          cellRenderer: (params) => {
              if (params.data.id_license === null || params.data.id_license === undefined)
                  return null;
              return <button onClick={() => onSearchClick2(params.data.id_license)}>
                  +
              </button>
          }
      },
      {
        enableValue: true,
        field: "inn",
        headerName: "ИНН",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        enableValue: true,
        field: "kpp",
        headerName: "КПП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        enableValue: true,
        field: "ogrn",
        headerName: "ОГРН",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        enableValue: true,
        field: "fullsubjectname",
        headerName: "Лицензиат",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        enableValue: true,
        field: "fulladdressur",
        headerName: "Адрес лицензиата",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        enableValue: true,
        field: "numberinreestr",
        headerName: "Номер ФСРАР",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        enableValue: true,
        field: "licbegdate",
        headerName: "С",
        resizable: true,
        sortable: true,
        filter: "agDateColumnFilter",
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return showDate(params.getValue());
        },
      },
      {
        enableValue: true,
        field: "licenddate",
        headerName: "По",
        resizable: true,
        sortable: true,
        filter: "agDateColumnFilter",
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return showDate(params.getValue());
        },
      },
      {
        enableValue: true,
        field: "licensestatetypename",
        headerName: "Текущее состояние",
        resizable: true,
        sortable: true,
        filter: "agSetColumnFilter",
        filterField: "id_currentlicensestatetype",
        filterParams: {
          values: async (params) => {
            const values = await getFiltersLists('options', 'LicenseStateType', token);
            console.log(values);
            params.success(values);
          },
          keyCreator: (params) => {
            return params.value.id;
          },
          valueFormatter: (params) => {
            return params.value.name;
          }
        }
      },
  ]);

  const [DataColumnsHistory] = useState([
      {
        enableValue: true,
        field: "licensestatetypename",
        headerName: "Состояние",
        resizable: true,
        sortable: true,
        filter: null,
      },
      {
        enableValue: true,
        field: "statebegdate",
        headerName: "С",
        resizable: true,
        sortable: true,
        filter: null,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return showDate(params.getValue());
        },
      },
      {
        enableValue: true,
        field: "stateenddate",
        headerName: "По",
        resizable: true,
        sortable: true,
        filter: null,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return showDate(params.getValue());
        },
      },
      {
        enableValue: true,
        field: "fulldecdoc",
        headerName: "Основание",
        resizable: true,
        sortable: true,
        filter: null,
      },
      {
        enableValue: true,
        field: "setdate",
        headerName: "Дата",
        resizable: true,
        sortable: true,
        filter: null,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return showDate(params.getValue());
        },
      },
      {
        enableValue: true,
        field: "fullpersonname",
        headerName: "Оператор",
        resizable: true,
        sortable: true,
        filter: null,
      },
  ])

  useEffect(() => {
    console.log(gridRef)
    if(gridRef && 'current' in gridRef) {
      disableFilters();
    }
  }, [count])

  const disableFilters = async () => {
    console.log(gridRef)
    disableFiltersList(DataColumns, gridRef);
  }

  const getFiltersData = async() => {
    const filters = await getJsonData(DataColumns, gridRef)
    return {
      ...filters,
    }
  }

  const onSearchClick = async() => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData()
    console.log(activeDataFilters)
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/Active/count?personlog_id=${personlog_id}`,
        activeDataFilters,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setCount(result.data.count)
      var datasource = getServerSideDatasource(result.data.count);
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
      return 0
    }
  }

  const getServerSideDatasource = (count) => {
    return {
      getRows: async (params) => {
        if (count === 0) {
          params.success({
            rowData: [],
            rowCount: 0,
          });
          setLoad(false);
          return
        }
        setLoad(true);
        setError(null);

        try {
          const result = await axios.post(
            variables.API_URL + `/Api/Active/export?personlog_id=${personlog_id}`,
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

  // история
  const onSearchClick2 = async(id_license) => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData()
    console.log(activeDataFilters)
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/OperLicenseList/History/count?personlog_id=${personlog_id}`,
          {onlyfixed: 1, id: id_license, table: 'Active'},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setCount(result.data.count)
      var datasource = getServerSideDatasource2(result.data.count, id_license);
      gridRef2.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
      return 0
    }
  }

  const getServerSideDatasource2 = (count, id_license) => {
    return {
      getRows: async (params) => {
        if (count === 0) {
          params.success({
            rowData: [],
            rowCount: 0,
          });
          setLoad(false);
          return
        }
        setLoad(true);
        setError(null);

        try {
          const result = await axios.post(
            variables.API_URL + `/Api/OperLicenseList/History/export?personlog_id=${personlog_id}`,
            await getFullJsonData(params.request, {onlyfixed: 1, id: id_license, table: 'Active'}),
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
      <Breadcrumb pageName="Действующие" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            name="Действующие"
            buttons={
              <>
                <button
                    type="button"
                    onClick={() => onSearchClick()}
                    className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Поиск
                </button>
              </>
            }
          >
            <>
              <div className="flex flex-row ag-grid-h">
                <div
                  className="flex flex-col ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: "100%", width: "100%" }}
                >
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
          <CardTable
              name="История"
          >
              <>
                <div className="flex flex-row ag-grid-h">
                  <div
                    className="flex flex-col ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <AgGridReact
                      ref={gridRef2}
                      columnDefs={DataColumnsHistory}
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

export default StopAndNull;
