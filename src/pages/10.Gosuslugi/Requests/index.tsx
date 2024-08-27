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

import IntegerCheckboxCard from "../../../components/UI/General/Inputs/Filters/IntegerCheckboxCard.tsx";
import SelectCard from "../../../components/UI/General/Inputs/Filters/SelectCard.tsx";
import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx"
import DateRangeCheckBoxCard from "../../../components/UI/General/Inputs/Filters/DateRangeCheckBoxCard.tsx"


const typesInArchive = [
    {'value': 1, 'name': 'Все'},
    {'value': 2, 'name': 'За период'},
    {'value': 3, 'name': 'Не передавались'}
]

const typesInGPU = [
    {'value': 1, 'name': 'Все'},
    {'value': 2, 'name': 'За период'}
]

const typesOutGPU = [
    {'value': 1, 'name': 'Все'},
    {'value': 2, 'name': 'За период'},
    {'value': 3, 'name': 'Не возвращены'}
]

const typesInUGK = [
    {'value': 1, 'name': 'Все'},
    {'value': 2, 'name': 'За период'},
    {'value': 3, 'name': 'Не передавались'}
]

const limitations = [
    {'value': -1, 'name': 'Не важно'},
    {'value': 1, 'name': 'Возможно ограничение'},
    {'value': 2, 'name': 'Установлено ограничение'}
]

let activeDataFilters = {};


const Gosuslugi = ({token, personlog_id, resources}) => {
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
                    field: "kindname",
                    filterField: "kind_id",
                    headerName: "Вид заявки",
                    resizable: true,
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                      values: async (params) => {
                        const values = await getFiltersLists('options', 'FsrarKindTypeAll', token);
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
                    field: "arcrequestnum",
                    headerName: "Номер дела",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "servicenumber1",
                    headerName: "Форма подачи",
                    filterField: "servicenumber",
                    filterUpdate: true,
                    filterValue: (value) => {
                      if (value === null)
                        return null;
                      if (value === 'Э')
                        return {filterType: 'text', type: 'startWith', filter: '0001'};
                      else
                        return {filterType: 'text', type: 'notStartsWith', filter: '0001'};
                    },
                    resizable: true,
                    sortable: true,
                    cellRenderer: (params) => {
                      if (params.data.servicenumber === null || params.data.servicenumber === undefined)
                        return <div></div>;
                      if (params.data.servicenumber.slice(0, 4) === '0001')
                        return 'Э';
                      return 'Б';
                    },
                    filter: "agSetColumnFilter",
                    filterParams: {
                      values: async (params) => {
                        const values = await getFiltersLists('dicts', 'TypesDocs', token);
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
                    field: "fulldutypersonname",
                    headerName: "Ответственный исполнитель",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "processtypename",
                    filterField: "id_processtype",
                    headerName: "Тип заявки",
                    resizable: true,
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                      values: async (params) => {
                        const values = await getFiltersLists('options', 'RequestType', token);
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
                    field: "fullsubjectname",
                    headerName: "Заявитель",
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
                    realFilterType: 'text',
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "flocdecdocnumber",
                    headerName: "Номер решения без выезда",
                    resizable: true,
                    sortable: true,
                    filter: "agNumberColumnFilter",
                    filterParams: {
                      allowedCharPattern: '\\d',
                    }
                  },
                  {
                    enableValue: true,
                    field: "flocdecdocdate",
                    headerName: "Дата решения без выезда",
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
                    field: "orderdocnumber",
                    headerName: "Номер распоряжения",
                    resizable: true,
                    sortable: true,
                    filter: "agNumberColumnFilter",
                    filterParams: {
                      allowedCharPattern: '\\d',
                    }
                  },
                  {
                    enableValue: true,
                    field: "orderdocdate",
                    headerName: "Дата распоряжения",
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
                    field: "startdate",
                    headerName: "Требуемое начало лицензии",
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
                    field: "duration",
                    headerName: "Длительность",
                    resizable: true,
                    sortable: true,
                    cellRenderer: (params) => {
                      if (params.getValue() === null || params.getValue() === undefined)
                        return <div></div>;
                      return <div>{Number(params.getValue()) / 12}</div>;
                    },
                    filter: "agNumberColumnFilter",
                    filterParams: {
                      allowedCharPattern: '\\d',
                      numberParser: (text_value) => {
                        if (text_value === null || text_value === undefined || text_value === "")
                          return null;
                        return Number(text_value) * 12
                      }
                    },
                  },
                  {
                    enableValue: true,
                    field: "processdatetime",
                    headerName: "Дата регистрации",
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
                    field: "processresulttypename",
                    filterField: "id_processresulttype",
                    headerName: "Текущее состояние",
                    resizable: true,
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                      values: async (params) => {
                        const values = await getFiltersLists('options', 'RequestResultType', token);
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
                    field: "dopexpertdocdate",
                    headerName: "Допэкспертиза",
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
                    field: "objectcountall",
                    headerName: "Приложений (объектов)",
                    resizable: true,
                    sortable: true,
                    filter: null,
                  },
                  {
                    enableValue: true,
                    field: "decisiondate",
                    headerName: "Дата решения",
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
                        const values = await getFiltersLists('options', 'LicenseType', token);
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
                    field: "servicenumber",
                    headerName: "ЕНО",
                    resizable: true,
                    sortable: true,
                    filter: "agNumberColumnFilter",
                    filterParams: {
                      allowedCharPattern: '\\d',
                    }
                  },
                  {
                    headerName: "Лицензия",
                    filter: null,
                    children: [
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
                            const values = await getFiltersLists('options', 'LicenseSeria', token);
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
                        headerName: "Начало действия",
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

  // По номеру заявки
  const [useNumberRequest, onSetUseNumberRequest] = useState(false);
  const [numberRequestType, onSetNumberRequestType] = useState(mathOperations[0]);
  const [numberRequest, onSetNumberRequest] = useState(null);

  // По номеру дела
  const [useNumberCase, onSetUseNumberCase] = useState(false);
  const [numberCaseType, onSetNumberCaseType] = useState(mathOperations[0]);
  const [numberCase, onSetNumberCase] = useState(null);

  // По номеру лицензии
  const [useNumberLicense, onSetUseNumberLicense] = useState(false);
  const [numberLicenseType, onSetNumberLicenseType] = useState(mathOperations[0]);
  const [numberLicense, onSetNumberLicense] = useState(null);

  // По установленному ограничению
  const [limitation, onSetLimitation] = useState(limitations[0]);

  // По виду решения
  const [decisionType, onSetDecisionType] = useState([]);
  const [decisionTypes, onSetDecisionTypes] = useState([]);

  // Переданы в архив
  const [useInArchive, onSetUseInArchive] = useState(false);
  const [typeInArchive, onSetTypeInArchive] = useState(typesInArchive[0]);
  const [inArchiveStart, onSetInArchiveStart] = useState(null);
  const [inArchiveEnd, onSetInArchiveEnd] = useState(null);

  // Переданы в ГПУ
  const [useInGPU, onSetUseInGPU] = useState(false);
  const [typeInGPU, onSetTypeInGPU] = useState(typesInGPU[0]);
  const [inGPUStart, onSetInGPUStart] = useState(null);
  const [inGPUEnd, onSetInGPUEnd] = useState(null);

  // Возвращены из ГПУ
  const [useOutGPU, onSetUseOutGPU] = useState(false);
  const [typeOutGPU, onSetTypeOutGPU] = useState(typesOutGPU[0]);
  const [outGPUStart, onSetOutGPUStart] = useState(null);
  const [outGPUEnd, onSetOutGPUEnd] = useState(null);

  // Переданы в УГК
  const [useInUGK, onSetUseInUGK] = useState(false);
  const [typeInUGK, onSetTypeInUGK] = useState(typesInUGK[0]);
  const [inUGKStart, onSetInUGKStart] = useState(null);
  const [inUGKEnd, onSetInUGKEnd] = useState(null);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    getFiltersResults()
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

  const getFiltersResults = async () => {
    const data = await getFiltersLists('options', 'RequestDecisionDocType', token)
    onSetDecisionTypes(data.map(el => ({value: el.id, name: el.name})))
  }

  const getFiltersData = async() => {
    const filters = await getJsonData(DataColumns, gridRef)
    return {
      Filter: [
        {'ElementID': "REQUESTNUM", "Use": Number(useNumberRequest), "Value": [numberRequestType.value, numberRequest]},
        {'ElementID': "ARCREQUESTNUM", "Use": Number(useNumberCase), "Value": [numberCaseType.value, numberCase]},
        {'ElementID': "NUMBERINREESTR", "Use": Number(useNumberLicense), "Value": [numberLicenseType.value, numberLicense]},
      ],
      FilterExt: {
        "StartDate": useDateReg ? dateRegStart.toISOString().split('T')[0] : null, "EndDate": useDateReg ? dateRegEnd.toISOString().split('T')[0] : null
      },
      LIMITS: limitation.value,
      DEC_TYPES: decisionType.length === 0 ? [-1] : decisionType.map(el => el.value),
      CF: {
        "bARC": Number(useInArchive), "ARCV": typeInArchive.value, "ARCFROM": inArchiveStart, "ARCTO": inArchiveEnd,
        "bGPU": Number(useInGPU), "GPUV": typeInGPU.value, "GPUFROM": inGPUStart, "GPUTO": inGPUEnd,
        "bRET": Number(useOutGPU), "RETV": typeOutGPU.value, "RETFROM": outGPUStart, "RETTO": outGPUEnd,
        "bUGK": Number(useInUGK), "UGKV": typeInUGK.value, "UGKFROM": inUGKStart, "UGKTO": inUGKEnd,
      },
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
        variables.API_URL + `/Api/Requests/count?personlog_id=${personlog_id}`,
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
            variables.API_URL + `/Api/Requests/export?personlog_id=${personlog_id}`,
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
        variables.API_URL + `/Api/Requests/export_to_excel?personlog_id=${personlog_id}`,
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
            onFiltersClick={openFilters}
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
                            <IntegerCheckboxCard
                                isChecked={useNumberRequest}
                                onChangeChecked={onSetUseNumberRequest}
                                name={'По номеру заявки'}
                                selectValue={numberRequestType}
                                selectChange={onSetNumberRequestType}
                                selectOptions={mathOperations}
                                inputValue={numberRequest}
                                inputChange={onSetNumberRequest}
                            />
                            <IntegerCheckboxCard
                                isChecked={useNumberCase}
                                onChangeChecked={onSetUseNumberCase}
                                name={'По номеру дела'}
                                selectValue={numberCaseType}
                                selectChange={onSetNumberCaseType}
                                selectOptions={mathOperations}
                                inputValue={numberCase}
                                inputChange={onSetNumberCase}
                            />
                            <IntegerCheckboxCard
                                isChecked={useNumberLicense}
                                onChangeChecked={onSetUseNumberLicense}
                                name={'По номеру лицензии'}
                                selectValue={numberLicenseType}
                                selectChange={onSetNumberLicenseType}
                                selectOptions={mathOperations}
                                inputValue={numberLicense}
                                inputChange={onSetNumberLicense}
                            />
                            <SelectCard
                                name={'По установленному ограничению'}
                                type={'single'}
                                selectValue={limitation}
                                selectChange={onSetLimitation}
                                selectOptions={limitations}
                            />
                            <SelectCard
                                name={'По виду решения'}
                                type={'multy'}
                                selectValue={decisionType}
                                selectChange={onSetDecisionType}
                                selectOptions={decisionTypes}
                            />
                            <DateRangeCheckBoxCard
                              isChecked={useInArchive}
                              onChangeChecked={onSetUseInArchive}
                              name={'Переданы в архив'}
                              selectValue={typeInArchive}
                              selectChange={onSetTypeInArchive}
                              selectOptions={typesInArchive}
                              inputValueMin={inArchiveStart}
                              inputChangeMin={onSetInArchiveStart}
                              inputValueMax={inArchiveEnd}
                              inputChangeMax={onSetInArchiveEnd}
                            />
                            <DateRangeCheckBoxCard
                              isChecked={useInGPU}
                              onChangeChecked={onSetUseInGPU}
                              name={'Переданы в ГПУ'}
                              selectValue={typeInGPU}
                              selectChange={onSetTypeInGPU}
                              selectOptions={typesInGPU}
                              inputValueMin={inGPUStart}
                              inputChangeMin={onSetInGPUStart}
                              inputValueMax={inGPUEnd}
                              inputChangeMax={onSetInGPUEnd}
                            />
                            <DateRangeCheckBoxCard
                              isChecked={useOutGPU}
                              onChangeChecked={onSetUseOutGPU}
                              name={'Возвращены из ГПУ'}
                              selectValue={typeOutGPU}
                              selectChange={onSetTypeOutGPU}
                              selectOptions={typesOutGPU}
                              inputValueMin={outGPUStart}
                              inputChangeMin={onSetOutGPUStart}
                              inputValueMax={outGPUEnd}
                              inputChangeMax={onSetOutGPUEnd}
                            />
                            <DateRangeCheckBoxCard
                              isChecked={useInUGK}
                              onChangeChecked={onSetUseInUGK}
                              name={'Переданы в УГК'}
                              selectValue={typeInUGK}
                              selectChange={onSetTypeInUGK}
                              selectOptions={typesInUGK}
                              inputValueMin={inUGKStart}
                              inputChangeMin={onSetInUGKStart}
                              inputValueMax={inUGKEnd}
                              inputChangeMax={onSetInUGKEnd}
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

export default Gosuslugi;
