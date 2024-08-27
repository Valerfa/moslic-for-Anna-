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

let activeDataFilters = {};


const RRO = ({token, personlog_id, resources}) => {
  const gridRef1 = useRef<AgGridReact>(null);
  const gridRef2 = useRef<AgGridReact>(null);

  const current_date = new Date();
  const last_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0);
  const [DataColumns1] = useState([
      {
          enableValue: true,
          field: "detail",
          headerName: "",
          resizable: true,
          sortable: true,
          filter: "agTextColumnFilter",
          cellRenderer: (params) => {
              if (params.data.license_regnum === null || params.data.license_regnum === undefined)
                  return null;
              return <button onClick={() => onSearchClick2(params.data.license_regnum)}>
                  +
              </button>
          }
      },
      {
          enableValue: true,
          field: "numberinreestr",
          headerName: "Номер лицензии",
          resizable: true,
          sortable: true,
          filter: "agTextColumnFilter",
      },
      {
          enableValue: true,
          field: "licence",
          headerName: "Срок действия лицензии",
          resizable: true,
          sortable: false,
          filter: null,
          children: [
              {
                  enableValue: true,
                  field: "lic_start",
                  headerName: "С",
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
                  field: "lic_stop",
                  headerName: "По",
                  resizable: true,
                  sortable: true,
                  cellRenderer: (params) => {
                      if (params.getValue() === null || params.getValue() === undefined)
                          return <div></div>;
                      return showDate(params.getValue());
                  },
                  filter: "agDateColumnFilter",
              },
          ]
      },
      {
          enableValue: true,
          field: "recnum",
          headerName: "Кол-во вариантов сведений",
          resizable: true,
          sortable: true,
          filter: "agNumberColumnFilter",
      },
      {
          enableValue: true,
          field: "rro_request_date",
          headerName: "Дата обращения",
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
          field: "license_regnum",
          headerName: "Номер РРО",
          resizable: true,
          sortable: true,
          filter: "agTextColumnFilter",
      },
      {
          enableValue: true,
          field: "createdate",
          headerName: "Дата формирования записи",
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
          field: "rro",
          headerName: "Срок действия РРО",
          resizable: true,
          sortable: false,
          filter: null,
          children: [
              {
                  enableValue: true,
                  field: "date_from",
                  headerName: "С",
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
                  field: "date_to",
                  headerName: "По",
                  resizable: true,
                  sortable: true,
                  cellRenderer: (params) => {
                      if (params.getValue() === null || params.getValue() === undefined)
                          return <div></div>;
                      return showDate(params.getValue());
                  },
                  filter: "agDateColumnFilter",
              },
          ]
      },
      {
          enableValue: true,
          field: "licensee",
          headerName: "Лицензиат",
          resizable: true,
          sortable: false,
          filter: null,
          children: [
              {
                  enableValue: true,
                  field: "unit_full",
                  headerName: "Полное наименование",
                  resizable: true,
                  sortable: true,
                  filter: "agTextColumnFilter",
              },
              {
                  enableValue: true,
                  field: "unit_brief",
                  headerName: "Краткое наименование",
                  resizable: true,
                  sortable: true,
                  filter: "agTextColumnFilter",
              },
              {
                  enableValue: true,
                  field: "unit_inn",
                  headerName: "ИНН",
                  resizable: true,
                  sortable: true,
                  filter: "agTextColumnFilter",
              },
              {
                  enableValue: true,
                  field: "unit_kpp",
                  headerName: "КПП",
                  resizable: true,
                  sortable: true,
                  filter: "agTextColumnFilter",
              },
          ]
      },
  ]);
  const [DataColumns2] = useState([
      {
          enableValue: true,
          field: "unit_full",
          headerName: "Полное наименование",
          resizable: true,
          sortable: true,
          ilter: "agTextColumnFilter",
      },
      {
          enableValue: true,
          field: "unit_brief",
          headerName: "Краткое наименование",
          resizable: true,
          sortable: true,
          ilter: "agTextColumnFilter",
      },
      {
          enableValue: true,
          field: "unit_inn",
          headerName: "ИНН",
          resizable: true,
          sortable: true,
          ilter: "agTextColumnFilter",
      },
      {
          enableValue: true,
          field: "unit_kpp",
          headerName: "КПП",
          resizable: true,
          sortable: true,
          ilter: "agTextColumnFilter",
      },
      {
          enableValue: true,
          field: "addressf",
          headerName: "Адрес",
          resizable: true,
          sortable: true,
          ilter: "agTextColumnFilter",
      },
  ]);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    setLoad(false);
  }, []);

  useEffect(() => {
    if(gridRef1 && 'current' in gridRef1) {
      disableFilters();
    }
  }, [count])

  const disableFilters = async () => {
    disableFiltersList(DataColumns1, gridRef1);
  }

  const getFiltersData = async() => {
    const filters = await getJsonData(DataColumns1, gridRef1)
    return {
      ...filters
    }
  }

  const onSearchClick = async() => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData()
    console.log(activeDataFilters)
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/RROList/count?personlog_id=${personlog_id}`,
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
      gridRef1.current.api.setGridOption("serverSideDatasource", datasource);
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
        setLoad(true);
        setError(null);

        try {
          const result = await axios.post(
            variables.API_URL + `/Api/RROList/export?personlog_id=${personlog_id}`,
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
    for (const row of gridRef1.current.api.getColumnState()) {
      if (row.sortIndex !== null) {
        sort_info = row;
        break;
      }
    }
    console.log(sort_info);
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/RROList/export_to_excel?personlog_id=${personlog_id}`,
        {
          ...activeDataFilters,
          sort: sort_info === null ? undefined : sort_info.colId,
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
      link.setAttribute("download", "Заявки.xlsx"); //or any other extension
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

  // места обсуживания
  const onSearchClick2 = (reg_num) => {
      var datasource = getServerSideDatasource2(reg_num);
      gridRef2.current.api.setGridOption("serverSideDatasource", datasource);
  }

  const getServerSideDatasource2 = (reg_num) => {
    return {
      getRows: async (params) => {
        setLoad(true);
        setError(null);

        try {
          const result = await axios.post(
            variables.API_URL + `/Api/RROList/export_obj?personlog_id=${personlog_id}`,
            await getFullJsonData(params.request, {reg_num: reg_num, table: 'RRO'}),
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          if (result.status !== 200) throw Error(result);
          params.success({
            rowData: result.data,
            rowCount: result.data.count,
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
      <Breadcrumb pageName="Список оформленных РРО" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            name="Заявки"
            buttons={
              <>
                <IconButtonDownload
                    onClick={() => Download()}
                    title={"Выгрузить"}
                />
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
                    ref={gridRef1}
                    columnDefs={DataColumns1}
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
            name="Список мест деятельности"
          >
            <>
              <div className="flex flex-row ag-grid-h">
                <div
                  className="flex flex-col ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: "100%", width: "100%" }}
                >
                  <AgGridReact
                    ref={gridRef2}
                    columnDefs={DataColumns2}
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

export default RRO;
