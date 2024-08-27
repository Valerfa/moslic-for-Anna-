import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  useLocation,
} from "react-router-dom";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import CardTable from "../../components/UI/General/CardTable/CardTable";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import { variables, AG_GRID_LOCALE_RU } from "../../variables";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

const ViolatorsList = () => {
	const gridRef = useRef<AgGridReact>(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const current_date = new Date();
    const [loading, setLoad] = useState(false);
    const [error, setError] = useState(null);
    const [token] = useState("");
    const [user] = useState("Департамент торговли и услуг города Москвы");
	const [rowData, setRowData] = useState([]);
	const [columnDefs, setcolumnDefs] = useState([
		{
			headerName: "№ \n п.п",
			valueGetter: "node.rowIndex + 1",
			sortable: true,
			resizable: true, wrapHeaderText: true, autoHeaderHeight: true, //перенос на несолько строк
			width: 80, minWidth: 50, maxWidth: 150
		},
		{
			field: 'inn', 
			headerName: 'ИНН',
			sortable: true, filter: 'agTextColumnFilter',
			resizable: true, wrapHeaderText: true, autoHeaderHeight: true, //перенос на несолько строк
			width: 120,	//, minWidth: 100, maxWidth: 120
			cellRenderer: params => {
              if (params.getValue() === null || params.getValue() === undefined)
                return <div></div>;
              const link_path = `licenseInfo?inn=${params.data.inn}`;
              return <div><a href={link_path} target="_black" style={{'color': 'blue'}}>{params.getValue()}</a></div>;
            }
		},
		{	field: 'kpp', 
			headerName: 'КПП',
			sortable: true, filter: 'agTextColumnFilter',
			resizable: true, wrapHeaderText: true, autoHeaderHeight: true, //перенос на несолько строк
			width: 120	//, minWidth: 100, maxWidth: 120
		},	
		{field: 'region_code', 
			headerName: 'Код региона',
			sortable: true, filter: 'agSetColumnFilter',
			resizable: true, wrapHeaderText: true, autoHeaderHeight: true, //перенос на несолько строк
			width: 110		//, minWidth: 50, maxWidth: 80
		}, 

		{	field: 'full_subject_name', 
			headerName: 'Наименование',
			sortable: true, filter: 'agTextColumnFilter',
			resizable: true, wrapText: true, autoHeight: true, //перенос на несолько строк
			width: 400	//, minWidth: 250, maxWidth: 380
		},	
		{	field: 'full_address_ur', 
			headerName: 'Юридический адрес',
			sortable: true, filter: 'agTextColumnFilter',
			resizable: true, wrapText: true, autoHeight: true, //перенос на несолько строк
			width: 400	//, minWidth: 250, maxWidth: 380
		},	
		{
			field: 'econ_yn', 
			headerName: 'Осуществляет экономическую деятельность',
			sortable: true, filter: 'agSetColumnFilter',
			resizable: true, wrapHeaderText: true, autoHeaderHeight: true, //перенос на несолько строк
			width: 160,	//, minWidth: 100, maxWidth: 120
			cellRenderer: (params) => {
              if (params.getValue() === null || params.getValue() === undefined)
                return <div></div>;
              if (params.getValue() == 'Нет')
                return (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                );
              if (params.getValue() == 'Да')
                return (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                );
            },
		}
	]);

	//экспорт в Excel
	const Download = useCallback(() => {
        setLoad(true);
        gridRef.current!.api.exportDataAsExcel({
            processCellCallback: function (cell) {
                var cellVal = cell.value;
                return cellVal;
            }
        });
        setLoad(false);
    }, []);

    const onSearch = async (id, period_ucode) => {
        if (id === null || period_ucode === null) {
            return;
        }
        setLoad(true);
        try {
          const result = await axios.get(
            variables.DOC_API_URL + `/violations-list?id=${id}&period_ucode=${period_ucode}`,
            {
              headers: {
                Authorization: `Token ${token}`,
                User: 'user',
              },
            }
          );
          if (result.status !== 200) throw Error(result);
          setError(null);
          setRowData(result.data)
        } catch (e) {
          console.log(e);
          setError(e);
        }
        setLoad(false);
    }

  useEffect(() => {
	onSearch(params.get('id'), params.get('godkv'))
  }, []);

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
      <Breadcrumb pageName="Детализация нарушителей" />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            name={`${params.get('namecol')}  ${params.get('namerow').toLowerCase()}`}
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}
                >
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
                    autosize={true}
                    sideBar={{
                      toolPanels: [
                        {
                          id: "columns",
                          labelDefault: "Columns",
                          labelKey: "columns",
                          iconKey: "columns",
                          toolPanel: "agColumnsToolPanel",
                          minWidth: 225,
                          width: 225,
                          maxWidth: 225,
                          toolPanelParams: {
                                suppressValues: true,
                                suppressPivots: true,
                                suppressPivotMode: true,
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
            }
            buttons={
              <IconButtonDownload onClick={() => Download()} />
            }
          ></CardTable>
        </div>
      </div>
    </>
  );
}  
export default ViolatorsList