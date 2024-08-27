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
    textOperations, mathOperations
} from "../../../variables.tsx";

import {
    getJsonData,
    getFiltersLists,
    getFullJsonData,
    disableFiltersList,
} from "../../../utils/gridUtils.tsx";

import TextCheckboxCard from "../../../components/UI/General/Inputs/Filters/TextCheckboxCard.tsx";
import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx"
import IntegerCheckboxCard from "../../../components/UI/General/Inputs/Filters/IntegerCheckboxCard.tsx";
import CheckboxCard from "../../../components/UI/General/Inputs/Filters/CheckboxCard.tsx";


let activeDataFilters = {};


const ExcludedObjects = ({token, personlog_id, resources}) => {
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
                    headerName: "Лицензиат",
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
                    field: "kpp",
                    headerName: "КПП",
                    resizable: true,
                    sortable: true,
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
                      field: "licbegdate",
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
                      field: "licenddate",
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
                    field: "fulladdress",
                    headerName: "Адрес объекта",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "fullobjectname",
                    headerName: "Наименование объекта",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "kpp2",
                    headerName: "КПП ОП",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "fsrar_status_name",
                    headerName: "Cостояние",
                    resizable: true,
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                      values: async (params) => {
                        const values = await getFiltersLists('dicts', 'state_object', token);
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
                      field: "licensestatebegdate",
                      headerName: "Дата состояния",
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
                    headerName: "Остатки АП",
                    filter: null,
                    children: [
                      {
                        enableValue: true,
                        field: "processdatetime",
                        headerName: "Дата снятия",
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
                        field: "remain2",
                        headerName: "Склад",
                        resizable: true,
                        sortable: true,
                        filter: null,
                      },
                      {
                        enableValue: true,
                        field: "remain1",
                        headerName: "ТЗ",
                        resizable: true,
                        sortable: true,
                        filter: null,
                      },
                      {
                        enableValue: true,
                        field: "note",
                        headerName: "Примечание",
                        resizable: true,
                        sortable: true,
                        filter: null,
                      },
                    ]
                  }
                ]
  )

  //Filters
  // Дата регистрации
  const [useDate, onSetUseDate] = useState(false);
  const [dateStart, onSetDateStart] = useState(last_date);
  const [dateEnd, onSetDateEnd] = useState(current_date);

  const [SortCheck, setSortCheck] = useState([{id: 0, name: "", value: false}])

  // фильтры
  const [useAddress, onSetUseAddress] = useState(false);
  const [addressType, onSetAddressType] = useState(textOperations[0]);
  const [address, onSetAddress] = useState(null);

  const [useInn, onSetUseInn] = useState(false);
  const [innType, onSetInnType] = useState(textOperations[0]);
  const [inn, onSetInn] = useState(null);

  const [useLicensee, onSetUseLicensee] = useState(false);
  const [licenseeType, onSetLicenseeType] = useState(textOperations[0]);
  const [licensee, onSetLicensee] = useState(null);

  const [useNumberRequest, onSetUseNumberRequest] = useState(false);
  const [numberRequestType, onSetNumberRequestType] = useState(textOperations[0]);
  const [numberRequest, onSetNumberRequest] = useState(null);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

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
      Filter: [
        {'ElementID': "FULLADDRESS", "Use": Number(useAddress), "Value": [addressType.value, address]},
        {'ElementID': "INN", "Use": Number(useInn), "Value": [innType.value, inn]},
        {'ElementID': "FULLSUBJECTNAME", "Use": Number(useLicensee), "Value": [licenseeType.value, licensee]},
        {'ElementID': "NUBMERINREESTR", "Use": Number(useNumberRequest), "Value": [numberRequestType.value, numberRequest]},
      ],
      FilterExt: {
        "StartDate": useDate ? dateStart.toISOString().split('T')[0] : null, "EndDate": useDate ? dateEnd.toISOString().split('T')[0] : null
      },
      SortCheck: SortCheck[0].value,
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
        variables.API_URL + `/Api/ExcludedObjects/count?personlog_id=${personlog_id}`,
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
            variables.API_URL + `/Api/ExcludedObjects/export?personlog_id=${personlog_id}`,
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
        variables.API_URL + `/Api/ExcludedObjects/export_to_excel?personlog_id=${personlog_id}`,
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

  const onSortClick = (e) => {
      setSortCheck([{id: 0, name: "", value: !(SortCheck[0].value)}])
  }

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
      <Breadcrumb pageName="Остатки по исключенным из лицензий объектам" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Остатки по исключенным из лицензий объектам"
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
                              isChecked={useDate}
                              onChangeChecked={onSetUseDate}
                              name={'Дата регистрации'}
                              inputValueMin={dateStart}
                              inputChangeMin={onSetDateStart}
                              inputValueMax={dateEnd}
                              inputChangeMax={onSetDateEnd}
                            />
                            <CheckboxCard
                                values={SortCheck}
                                onChangeChecked={onSortClick}
                                name={"Дополнительно упорядочивать по ИНН и номеру лицензии"}/>
                            <TextCheckboxCard
                                isChecked={useAddress}
                                onChangeChecked={onSetUseAddress}
                                name={'По адресу объекта'}
                                selectValue={addressType}
                                selectChange={onSetAddressType}
                                selectOptions={textOperations}
                                inputValue={address}
                                inputChange={onSetAddress}
                            />
                            <TextCheckboxCard
                                isChecked={useInn}
                                onChangeChecked={onSetUseInn}
                                name={'По ИНН'}
                                selectValue={innType}
                                selectChange={onSetInnType}
                                selectOptions={textOperations}
                                inputValue={inn}
                                inputChange={onSetInn}
                            />
                            <TextCheckboxCard
                                isChecked={useLicensee}
                                onChangeChecked={onSetUseLicensee}
                                name={'По лицензиату'}
                                selectValue={licenseeType}
                                selectChange={onSetLicenseeType}
                                selectOptions={textOperations}
                                inputValue={licensee}
                                inputChange={onSetLicensee}
                            />
                            <TextCheckboxCard
                                isChecked={useNumberRequest}
                                onChangeChecked={onSetUseNumberRequest}
                                name={'По номеру заявки'}
                                selectValue={numberRequestType}
                                selectChange={onSetNumberRequestType}
                                selectOptions={textOperations}
                                inputValue={numberRequest}
                                inputChange={onSetNumberRequest}
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

export default ExcludedObjects;
