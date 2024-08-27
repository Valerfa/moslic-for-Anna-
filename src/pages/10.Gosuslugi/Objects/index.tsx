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
  AG_GRID_LOCALE_RU, showDate,
} from "../../../variables.tsx";

import {
    getJsonData,
    getFiltersLists,
    getFullJsonData,
    disableFiltersList
} from "../../../utils/gridUtils.tsx";

import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx"

let activeDataFilters = {};

const Objects = ({token, personlog_id, resources}) => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const last_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0)
    const [DataColumns] = useState(
      [
          {
            enableValue: true,
            field: "fulladdress",
            headerName: "Адрес объекта",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "coord",
            headerName: "Коррдинаты",
            resizable: true,
            sortable: true,
            cellRenderer: (params) => {
              if (params.data.lat && params.data.lng) {
                return `${params.data.lat}, ${params.data.lng}`;
              } else {
                return <div></div>
              }
            },
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "fulldutypersonname",
            headerName: "Исполнитель",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "fullsubjectname",
            headerName: "Cубъект",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "arcrequestnum",
            headerName: "Номер дела",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "processdatetime",
            headerName: "Дата заявки",
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
            field: "requestnum",
            headerName: "Номер заявки",
            resizable: true,
            sortable: true,
            filter: "agNumberColumnFilter",
            filterParams: {
              allowedCharPattern: '\\d'
            }
          },
          {
            enableValue: true,
            field: "processresulttypename",
            headerName: "Состояние исполнения",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
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
            field: "kppobj",
            headerName: "КПП",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "fullobjectname",
            headerName: "Объект",
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
          },
          {
            enableValue: true,
            field: "id_licensetype",
            headerName: "Результат",
            resizable: true,
            sortable: true,
            filter: "agSetColumnFilter",
            cellRenderer: (params) => {
              if (params.getValue() === null || params.getValue() === undefined)
                return <div></div>;
              switch (Number(params.getValue())) {
                case -1:
                  return "Приложение к лицензии";
                case -2:
                  return "Отказ в выдаче приложения к лицензии";
                case 1:
                  return "Лицензия";
                case 2:
                  return "Отказ";
                case 3:
                  return "*Лицензия";
                case 4:
                  return "*Отказ";
                case 5:
                  return "Продление";
                case 6:
                  return "*Продление";
                case 7:
                  return "Отказ в продлении";
                case 8:
                  return "*Отказ в продлении";
              }
            },
            filterParams: {
              values: async (params) => {
                const values = await getFiltersLists('options', 'LicenseType', '');
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
          {
            enableValue: true,
            field: "licensedecisiondate",
            headerName: "Дата решения",
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
            field: "requestputdate",
            headerName: "Дата выдачи в одно окно",
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
            headerName: "Лицензия",
            filter: null,
            children: [
              {
                enableValue: true,
                field: "licenseputdate",
                headerName: "Выдана",
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
                field: "numberinreestr",
                headerName: "Номер ФСРАР",
                resizable: true,
                sortable: true,
                filter: "agTextColumnFilter",
              },
              {
                enableValue: true,
                field: "licensenumber",
                headerName: "Номер",
                resizable: true,
                sortable: true,
                filter: "agTextColumnFilter",
              },
              {
                enableValue: true,
                field: "licenseseria",
                headerName: "Серия",
                resizable: true,
                sortable: true,
                filter: "agSetColumnFilter",
                filterParams: {
                  values: async (params) => {
                    const values = await getFiltersLists('options', 'LicenseSeria', '');
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
                headerName: "До",
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
                field: "licensestatetypename",
                filterField: "id_licensestatetype",
                headerName: "Состояние",
                resizable: true,
                sortable: true,
                filter: "agSetColumnFilter",
                filterParams: {
                  values: async (params) => {
                    const values = await getFiltersLists('options', 'LicenseStateType', '');
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
              }
            ]
          }
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
    setLoad(false);
  }, []);

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
      ...filters
    }
  }

  const onSearchClick = async() => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData()
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/Objects/count?personlog_id=${personlog_id}`,
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
        try {
          const result = await axios.post(
            variables.API_URL + `/Api/Objects/export?personlog_id=${personlog_id}`,
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
        variables.API_URL + `/Api/Objects/export_to_excel?personlog_id=${personlog_id}`,
        {
          ... activeDataFilters,
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
      link.setAttribute("download", "Объекты.xlsx"); //or any other extension
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
      <Breadcrumb pageName="Объекты" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Объекты"
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

export default Objects;
