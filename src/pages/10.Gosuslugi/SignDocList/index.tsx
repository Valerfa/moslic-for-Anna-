import React, {
  useEffect,
  useRef,
  useState,
  useMemo, useLayoutEffect,

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
  AG_GRID_LOCALE_RU, showDate,
} from "../../../variables.tsx";

import {
    getJsonData,
    getFiltersLists,
    getFullJsonData,
    disableFiltersList
} from "../../../utils/gridUtils.tsx";

import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx"
import {useLocation} from "react-router-dom";

let activeDataFilters = {};

const SignDocList = ({token, personlog_id, resources}) => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const location = useLocation();
  const [mode, onSetMode] = useState(0);
  const [title, onSetTitle] = useState('');
  const last_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0)
  const [DataColumns] = useState(
      [
          {
            enableValue: true,
            field: "fullsubjectname",
            headerName: "Заявитель",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
            cellRenderer: "agGroupCellRenderer",
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
                const values = await getFiltersLists('options', 'RequestType', token);
                console.log(values);
                params.success(values);
                },
              keyCreator: (params) => {
                return params.value.name;
                },
              valueFormatter: (params) => {
                return params.value.name;
              }
            }
          },
          {
            enableValue: true,
            field: "requestnum",
            headerName: "Номер",
            resizable: true,
            sortable: true,
            filter: "agNumberColumnFilter",
          },
          {
            enableValue: true,
            field: "arcrequestnum",
            headerName: "Дело",
            resizable: true,
            sortable: true,
            filter: "agNumberColumnFilter",
          },
          {
            enableValue: true,
            field: "requestform",
            headerName: "Форма подачи",
            resizable: true,
            sortable: true,
            cellRenderer: (params) => {
              if (params.getValue() === null || params.getValue() === undefined)
                return <div></div>;
              if (params.getValue() === 'Э')
                return "Электронная"
              else if (params.getValue() === 'Б')
                return "Бумажная"
              else
                return "Не важно"
            },
            filter: "agTextColumnFilter",
          },
      ]
  )

  //Filters
  // Дата регистрации
  const [useDateReg, onSetUseDateReg] = useState(false);
  const [dateRegStart, onSetDateRegStart] = useState(last_date);
  const [dateRegEnd, onSetDateRegEnd] = useState(current_date);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    console.log(location.pathname)
    if (location.pathname === '/gosuslugi/sign-doc-list') {
      onSetTitle('Находятся на подписи')
      onSetMode(1)
    }
    else {
      onSetTitle('Находятся на подписи у руководства')
      onSetMode(2)
    }
    console.log('title:', title);
    setLoad(false);
  }, [location, title]);

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
      FilterExt: {
        "StartDate": useDateReg ? dateRegStart : null, "EndDate": useDateReg ? dateRegEnd : null
      },
      mode: mode,
      ...filters
    }
  }

  const convertDateFormat = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}.${month}.${year}`;
};

  const onSearchClick = async() => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData()
    try {
      if (activeDataFilters.FilterExt && activeDataFilters.FilterExt.StartDate) {
        activeDataFilters.FilterExt.StartDate = convertDateFormat(activeDataFilters.FilterExt.StartDate)
      }
      if (activeDataFilters.FilterExt && activeDataFilters.FilterExt.EndDate) {
        activeDataFilters.FilterExt.EndDate = convertDateFormat(activeDataFilters.FilterExt.EndDate)
      }
      let apiUrl = '';
      if (title === 'Находятся на подписи')
        apiUrl = `/Api/SignDocList/count?personlog_id=${personlog_id}`;
      else
        apiUrl = `/Api/SignDocListLeader/count?personlog_id=${personlog_id}`;
      console.log(apiUrl)
      const result = await axios.post(
        variables.API_URL + apiUrl,
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
        setLoad(true);
        setError(null);
      let apiUrl = '';
      if (title === 'Находятся на подписи')
        apiUrl = `/Api/SignDocList/export?personlog_id=${personlog_id}`;
      else
        apiUrl = `/Api/SignDocListLeader/export?personlog_id=${personlog_id}`;
      console.log(apiUrl)
        try {
          const result = await axios.post(
            variables.API_URL + apiUrl,
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
            filter: "agTextColumnFilter",
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
            field: "signdate",
            headerName: "Подписан",
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
            field: "signnote",
            headerName: "Резолюция",
            resizable: true,
            sortable: true,
            rowGroup: false,
            filter: "agTextColumnFilter",
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
        console.log(params)
        let apiUrl = '';
        if (location.pathname === '/gosuslugi/sign-doc-list')
          apiUrl = `/Api/SignDocList/export?personlog_id=${personlog_id}`;
        else
          apiUrl = `/Api/SignDocListLeader/export?personlog_id=${personlog_id}`;
        console.log(apiUrl)
        try {
          const result = await axios.post(
                variables.API_URL + apiUrl,
                {REQUESTNUM: params.data.requestnum === undefined ? null : params.data.requestnum},
                {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
                }
            );
          if (result === null) throw Error('Ошибка в запросе');
          if (result.status !== 200) throw Error(result);
          params.successCallback(result.data);
        } catch (e) {
          console.log(e);
          setError(e);
        }
        setLoad(false);
      },
    }
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
    let apiUrl = '';
      if (title === 'Находятся на подписи')
        apiUrl = `/Api/SignDocList/export_to_excel?personlog_id=${personlog_id}`;
      else
        apiUrl = `/Api/SignDocListLeader/export_to_excel?personlog_id=${personlog_id}`;
    try {
      const result = await axios.post(
        variables.API_URL + apiUrl,
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
      link.setAttribute("download", "Находятся на подписи.xlsx"); //or any other extension
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
      <Breadcrumb pageName={title} />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name={title}
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
                              isChecked={useDateReg}
                              onChangeChecked={onSetUseDateReg}
                              name={'Дата регистрации'}
                              inputValueMin={dateRegStart}
                              inputChangeMin={onSetDateRegStart}
                              inputValueMax={dateRegEnd}
                              inputChangeMax={onSetDateRegEnd}
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

export default SignDocList;
