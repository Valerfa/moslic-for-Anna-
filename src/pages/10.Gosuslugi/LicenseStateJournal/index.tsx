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


const LicenseStateJournal = ({token, personlog_id, resources}) => {
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
                    field: "fullsubjectname",
                    headerName: "Лицензат",
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
                    field: "numberinreestr",
                    headerName: "Номер лицензии",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "lic_stop",
                    headerName: "Срок действия",
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
                    field: "checkdate",
                    headerName: "Дата контроля",
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
                    field: "source",
                    headerName: "Источник",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "state",
                    headerName: "Состояние",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "decision",
                    headerName: "Решение",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "court",
                    headerName: "Суд",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    headerName: "Примечание",
                    filter: null,
                    children: [
                      {
                        enableValue: true,
                        field: "sourcedoctypename",
                        headerName: "Тип",
                        resizable: true,
                        sortable: true,
                        filter: "agTextColumnFilter",
                      },
                      {
                        enableValue: true,
                        field: "sourcedocnumber",
                        headerName: "Номер",
                        resizable: true,
                        sortable: true,
                        filter: "agNumberColumnFilter",
                        filterParams: {
                          allowedCharPattern: '\\d',
                        }
                      },
                      {
                        enableValue: true,
                        field: "sourcedocdate",
                        headerName: "Дата",
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
                        headerName: "Наименование",
                        resizable: true,
                        sortable: true,
                        filter: "agTextColumnFilter",
                      },
                      {
                        enableValue: true,
                        field: "statebegdate",
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
                        field: "stateenddate",
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
                        field: "setdate",
                        headerName: "Дата фиксации",
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
                        field: "fullpersonname",
                        headerName: "Оператор",
                        resizable: true,
                        sortable: true,
                        filter: "agTextColumnFilter",
                      },
                      {
                        enableValue: true,
                        field: "decisiondoctypename",
                        headerName: "Тип",
                        resizable: true,
                        sortable: true,
                        filter: "agTextColumnFilter",
                      },
                      {
                        enableValue: true,
                        field: "decisiondocnumber",
                        headerName: "Номер",
                        resizable: true,
                        sortable: true,
                        filter: "agNumberColumnFilter",
                        filterParams: {
                          allowedCharPattern: '\\d',
                        }
                      },
                      {
                        enableValue: true,
                        field: "decisiondocdate",
                        headerName: "Дата документа",
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
                        field: "confirmdate",
                        headerName: "Дата согласования в ГПУ",
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
                        field: "courtprocessnum",
                        headerName: "Номер дела",
                        resizable: true,
                        sortable: true,
                        filter: "agNumberColumnFilter",
                        filterParams: {
                          allowedCharPattern: '\\d',
                        }
                      },
                      {
                        enableValue: true,
                        field: "courtdate",
                        headerName: "Дата заседания",
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
                        field: "resultdocnumber",
                        headerName: "Номер решения суда",
                        resizable: true,
                        sortable: true,
                        filter: "agNumberColumnFilter",
                        filterParams: {
                          allowedCharPattern: '\\d',
                        }
                      },
                      {
                        enableValue: true,
                        field: "resultdocdate",
                        headerName: "Дата решения суда",
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
                  }
                ]
  )

  //Filters
  // Дата регистрации
  const [useDateReg, onSetUseDateReg] = useState(false);
  const [dateRegStart, onSetDateRegStart] = useState(last_date);
  const [dateRegEnd, onSetDateRegEnd] = useState(current_date);

  // По нмоеру лицензиата
  const [useLicensee, onSetUseLicensee] = useState(false);
  const [licenseeType, onSetLicenseeType] = useState(mathOperations[0]);
  const [licensee, onSetLicensee] = useState(null);

  // По ИНН
  const [useNumberINN, onSetUseNumberINN] = useState(false);
  const [numberINNType, onSetNumberINNType] = useState(mathOperations[0]);
  const [numberINN, onSetNumberINN] = useState(null);

  // По номеру лицензии
  const [useNumberLicense, onSetUseNumberLicense] = useState(false);
  const [numberLicenseType, onSetNumberLicenseType] = useState(mathOperations[0]);
  const [numberLicense, onSetNumberLicense] = useState(null);

  // Дата контроля
  const [useCheckDate, onSetUseCheckDate] = useState(false);
  const [checkDateStart, onSetCheckDateStart] = useState(last_date);
  const [checkDateEnd, onSetCheckDateEnd] = useState(current_date);

  // По номеру источника
  const [useSourceDocNumber, onSetUseSourceDocNumber] = useState(false);
  const [sourceDocNumberType, onSetSourceDocNumberType] = useState(mathOperations[0]);
  const [sourceDocNumber, onSetSourceDocNumber] = useState(null);

  // По установленному ограничению
  const [limitation, onSetLimitation] = useState(limitations[0]);

  // По виду решения
  const [decisionType, onSetDecisionType] = useState([]);
  const [decisionTypes, onSetDecisionTypes] = useState([]);

  // Дата контроля
  const [useDecisionDate, onSetUseDecisionDate] = useState(false);
  const [decisionDateStart, onSetDecisionDateStart] = useState(last_date);
  const [decisionDateEnd, onSetDecisionDateEnd] = useState(current_date);

  // По виду решения
  const [docType, onSetDocType] = useState([]);
  const [docTypes, onSetDocTypes] = useState([]);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    console.log(token, personlog_id)
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
        {'ElementID': "FULLSUBJECTNAME", "Use": Number(useLicensee), "Value": [licenseeType.value, licensee]},
        {'ElementID': "INN", "Use": Number(useNumberINN), "Value": [numberINNType.value, numberINN]},
        {'ElementID': "NUMBERINREESTR", "Use": Number(useNumberLicense), "Value": [numberLicenseType.value, numberLicense]},
        {'ElementID': "CHECKDATE", "Use": Number(useCheckDate), "Value": [checkDateStart.toISOString().split('T')[0], checkDateEnd.toISOString().split('T')[0]]},
        {'ElementID': "SOURCEDOCNUMBER", "Use": Number(useSourceDocNumber), "Value": [sourceDocNumberType.value, sourceDocNumber]},
        {'ElementID': "DECISIONDOCDATE", "Use": Number(useDecisionDate), "Value": [decisionDateStart.toISOString().split('T')[0], decisionDateEnd.toISOString().split('T')[0]]},
      ],
      FilterExt: {
        "StartDate": useDateReg ? dateRegStart.toISOString().split('T')[0] : null, "EndDate": useDateReg ? dateRegEnd.toISOString().split('T')[0] : null
      },
      LIMITS: limitation.value,
      DEC_TYPES: decisionType.length === 0 ? [-1] : decisionType.map(el => el.value),
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
        variables.API_URL + `/Api/LicenseStateJournal/count?personlog_id=${personlog_id}`,
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
            variables.API_URL + `/Api/LicenseStateJournal/export?personlog_id=${personlog_id}`,
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
        variables.API_URL + `/Api/LicenseStateJournal/export_to_excel?personlog_id=${personlog_id}`,
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
      <Breadcrumb pageName="Журнал состояний лицензий" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Журнал состояний лицензий"
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
                                isChecked={useLicensee}
                                onChangeChecked={onSetUseLicensee}
                                name={'Лицензиат'}
                                selectValue={licenseeType}
                                selectChange={onSetLicenseeType}
                                selectOptions={mathOperations}
                                inputValue={licensee}
                                inputChange={onSetLicensee}
                            />
                            <IntegerCheckboxCard
                                isChecked={useNumberINN}
                                onChangeChecked={onSetUseNumberINN}
                                name={'ИНН'}
                                selectValue={numberINNType}
                                selectChange={onSetNumberINNType}
                                selectOptions={mathOperations}
                                inputValue={numberINN}
                                inputChange={onSetNumberINN}
                            />
                            <IntegerCheckboxCard
                                isChecked={useNumberLicense}
                                onChangeChecked={onSetUseNumberLicense}
                                name={'Номер ФСРАР'}
                                selectValue={numberLicenseType}
                                selectChange={onSetNumberLicenseType}
                                selectOptions={mathOperations}
                                inputValue={numberLicense}
                                inputChange={onSetNumberLicense}
                            />
                            <DateRangeCard
                              isChecked={useCheckDate}
                              onChangeChecked={onSetUseCheckDate}
                              name={'Дата контроля'}
                              inputValueMin={checkDateStart}
                              inputChangeMin={onSetCheckDateStart}
                              inputValueMax={checkDateEnd}
                              inputChangeMax={onSetCheckDateEnd}
                            />
                            <IntegerCheckboxCard
                                isChecked={useSourceDocNumber}
                                onChangeChecked={onSetUseSourceDocNumber}
                                name={'Номер источника'}
                                selectValue={sourceDocNumberType}
                                selectChange={onSetSourceDocNumberType}
                                selectOptions={mathOperations}
                                inputValue={sourceDocNumber}
                                inputChange={onSetSourceDocNumber}
                            />
                            <SelectCard
                                name={'Вид решения'}
                                type={'multy'}
                                selectValue={decisionType}
                                selectChange={onSetDecisionType}
                                selectOptions={decisionTypes}
                            />
                            <DateRangeCard
                              isChecked={useDecisionDate}
                              onChangeChecked={onSetUseDecisionDate}
                              name={'Дата решения'}
                              inputValueMin={decisionDateStart}
                              inputChangeMin={onSetDecisionDateStart}
                              inputValueMax={decisionDateEnd}
                              inputChangeMax={onSetDecisionDateEnd}
                            />
                            <SelectCard
                                name={'Тип документа'}
                                type={'multy'}
                                selectValue={docType}
                                selectChange={onSetDocType}
                                selectOptions={docTypes}
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

export default LicenseStateJournal;
