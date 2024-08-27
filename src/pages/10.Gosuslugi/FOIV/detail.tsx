import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";
import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

import {
  variables,
  AG_GRID_LOCALE_RU,
  showDate,
} from "../../../variables.tsx";

let activeDataFilters = {};


const DetailFOIV = ({token, personlog_id, resources}) => {
  const gridRef = useRef<AgGridReact>(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const current_date = new Date();
  const last_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([])
  const [DataColumns] = useState([
    {
      enableValue: true,
      field: "requestid",
      headerName: "requestid",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "extdocnumber",
      headerName: "Номер документа",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "requestnum",
      headerName: "Номер заявки",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
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
      field: "savedate",
      headerName: "Дата изменения",
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
      field: "resultcode",
      headerName: "Результат",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        switch (params.getValue()) {
          case 1:
            return "Есть результат";
          case 1:
            return "Нет результата, но запрос принят в ФОИВ";
          case 0:
            return "Запрос не отправлялся";
          default:
            return "Ошибки обмена";
        };
        },
    },
    {
      enableValue: true,
      field: "id_webrequest",
      headerName: "Операции",
      resizable: true,
      sortable: true,
      filter: null,
    },
  ])

  useEffect(() => {
    onSearchClick()
  }, []);

  const getFiltersData = async() => {
    return {
      DOC_TYPE: params.get("DOC_TYPE"),
      START_DATE: params.get("START_DATE"),
      END_DATE: params.get("END_DATE"),
      FLAG: params.get("FLAG"),
      COUNT_DAY: params.get("COUNT_DAY")
    }
  }

  const onSearchClick = async() => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData()
    console.log(activeDataFilters)
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/FOIV/export?personlog_id=${personlog_id}`,
        activeDataFilters,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setData(result.data);
      setLoad(false);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
      return 0
    }
  }

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
      <Breadcrumb pageName="Детальный список ФОИВ" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            buttons={
              <>
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
                    rowData={data}
                    columnDefs={DataColumns}
                    defaultColDef={defaultColDef}
                    pivotMode={false}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    pagination={true}
                    paginationPageSize={100}
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
                            suppressRowGroups: false,
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

export default DetailFOIV;
