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
  showDateTime,
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


let activeDataFilters = {};


const MailingJournal = ({token, personlog_id, resources}) => {
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
                    enableValue: false,
                    field: "",
                    headerName: "",
                    resizable: true,
                    sortable: false,
                    filter: null,
                    cellRenderer: "agGroupCellRenderer"
                  },
                  {
                    enableValue: true,
                    field: "emaildate",
                    headerName: "Дата и время отправки",
                    resizable: true,
                    sortable: true,
                    filter: "agDateColumnFilter",
                    cellRenderer: (params) => {
                      if (params.getValue() === null || params.getValue() === undefined)
                        return <div></div>;
                      return showDateTime(params.getValue());
                    },
                  },
                  {
                    enableValue: true,
                    field: "fullsubjectname",
                    headerName: "Адресат",
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
                    field: "fulladdress",
                    headerName: "Место выездного обслуживания",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "doctypename",
                    headerName: "Отправленный документ",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
                  {
                    enableValue: true,
                    field: "email",
                    headerName: "Адрес эл. почты",
                    resizable: true,
                    sortable: true,
                    filter: "agTextColumnFilter",
                  },
      ]
  )

  //Filters
  // Дата регистрации
  const [useDate, onSetUseDate] = useState(false);
  const [dateStart, onSetDateStart] = useState(last_date);
  const [dateEnd, onSetDateEnd] = useState(current_date);

  // Отправленный документ
  const [sendDoc, setSendDoc] = useState([]);
  const [sendDocs, setSendDocs] = useState([]);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    getFiltersResults()
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
    setLoad(true);
    const data = await getFiltersLists('options', 'V_DOCTYPE4EMAILING_STATE2', token);
    const new_list = [{value: null, name: 'Не важно'}, ...data.map(el => ({value: el.id, name: el.name}))];
    setSendDocs(new_list);
    setSendDoc([new_list[0]])
    setLoad(false);
  }

  const getFiltersData = async() => {
    const filters = await getJsonData(DataColumns, gridRef)
    return {
      Filter: [
        {'ElementID': "ID_DOCTYPE", "Use": Number(sendDoc.length === 0 ? false : sendDoc[0].value === null ? false : true), "Value": sendDoc.map(doc => doc.value)},
      ],
      FilterExt: {
        "StartDate": useDate ? dateStart.toISOString().split('T')[0] : null, "EndDate": useDate ? dateEnd.toISOString().split('T')[0] : null
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
        variables.API_URL + `/Api/MailingJournal/count?personlog_id=${personlog_id}`,
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
            variables.API_URL + `/Api/MailingJournal/export?personlog_id=${personlog_id}`,
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

  const setCurrentSendDoc = (v) => {
      console.log(v.filter(value => value.value === null).length !== 0)
      if (sendDoc.filter(value => value.value === null).length === 0 && v.filter(value => value.value === null).length !== 0) {
          setSendDoc([sendDocs[0]])
      } else {
          setSendDoc(v.filter(value => value.value !== null))
      }
  }

  const detailCellRendererParams = useMemo<any>(() => {
    return {
      // level 2 grid options
      detailGridOptions: {
        columnDefs: [
          {
            enableValue: true,
            field: "setdate",
            headerName: "Дата и время отправки",
            resizable: true,
            sortable: true,
            rowGroup: false,
            filter: "agDaterColumnFilter",
            cellRenderer: (params) => {
                if (params.getValue() === null || params.getValue() === undefined)
                    return <div></div>;
                return showDateTime(params.getValue());
            },
          },
          {
            enableValue: true,
            field: "processstatelognote",
            headerName: "Ошибка",
            resizable: true,
            sortable: true,
            rowGroup: false,
            filter: "agSetColumnFilter",
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
        try {
          const result = await axios.post(
                variables.API_URL + `/Api/MailingJournal/export_log?personlog_id=${personlog_id}`,
                {ID_PROCESS: params.data.id_docprocess},
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
      <Breadcrumb pageName="Журнал рассылок отказов от МВО" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Журнал рассылок отказов от МВО"
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
                              name={'Дата'}
                              inputValueMin={dateStart}
                              inputChangeMin={onSetDateStart}
                              inputValueMax={dateEnd}
                              inputChangeMax={onSetDateEnd}
                            />
                            <SelectCard
                                name={'Отправленный документ'}
                                type={'multy'}
                                selectValue={sendDoc}
                                selectChange={setCurrentSendDoc}
                                selectOptions={sendDocs}
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

export default MailingJournal;
