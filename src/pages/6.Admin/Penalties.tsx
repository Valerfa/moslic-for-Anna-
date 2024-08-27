import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
  useCallback,
} from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";

import Tabs from "../../components/Tabs/1.Tabs";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";

import { variables, showDate, AG_GRID_LOCALE_RU } from "../../variables";
import CellRender3 from "./AdminCasesCell3";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

const filter_use = false;

const Penalties = (props) => {
  const gridRef = useRef<AgGridReact>(null);
  const fileInput = createRef();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [data, setData] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [dataCount, setCount] = useState(0);
  const [paydoc_types, setPayDocTypes] = useState([]);
  // data columns
  const [dataColumns] = useState([
      {
        enableValue: true,
        field: "operations",
        headerName: "Операции",
        resizable: true,
        sortable: false,
        filter: filter_use ? "agSetColumnFilter" : null,
        cellRenderer: (params) => {
          if (params.data === null || params.data === undefined)
            return <div></div>;
          return CellRender3(params, onEditClick, onDeleteClick);
        },
      },
      {
        enableValue: true,
        field: "penalty_mode",
        headerName: "По статье",
        resizable: true,
        sortable: false,
        filter: filter_use ? "agNumberColumnFilter" : null,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          switch (params.getValue()) {
            case 0:
                return <div>15.13</div>;
            case 1:
                return <div>20.25</div>;
          };
        },
      },
      {
        enableValue: true,
        field: "paymdoc_type_name",
        headerName: "Вид платежного документа",
        resizable: true,
        sortable: false,
        filter: filter_use ? "agSetColumnFilter" : null,
      },
      {
        enableValue: true,
        field: "paymdoc_number",
        headerName: "Номер платежного документа",
        resizable: true,
        sortable: false,
        filter: filter_use ? "agSetColumnFilter" : null,
      },
      {
        enableValue: true,
        field: "paym_date",
        headerName: "Дата платежа",
        resizable: true,
        sortable: false,
        filter: filter_use ? "agSetColumnFilter" : null,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return <div>{showDate(params.getValue())}</div> ;
        },
      },
      {
        enableValue: true,
        field: "paym_sum",
        headerName: "Сумма платежа",
        resizable: true,
        sortable: false,
        filter: filter_use ? "agSetColumnFilter" : null,
      },
  ]);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const getFirstData = async() => {
    const kinds = await getKinds();
    setPayDocTypes(kinds);
    if (props !== null && props !== undefined) {
        onSearchClick(params.get('inn'), params.get('period_ucode'), params.get('iswrong'), kinds)
    }
  }

  useEffect(() => {
    getFirstData()
  }, []);


  const getKinds = async() => {
    let data = []
    try {
      const result = await axios.get(
        variables.ADM_API_URL + `/paydoc-types`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: 'user',
          },
        }
      );
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      console.log(result.data)
      data = result.data
    } catch (e) {
      console.log(e);
      setError(e);
    }
    return data
  };

  const onSearchClick = async (inn, period_ucode, iswrong, kinds) => {
    setLoad(true);

    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/fetch-payment-details`,
        {
          INN: inn,
          PERIOD_UCODE: period_ucode,
          ISWRONG: iswrong
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            User: 'user',
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      for (let i of result.data) {
        i.paydoc_types = kinds;
      }
      setData(result.data)
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  const onEditClick = async(doc_id, paidAmount, paidDate, paidKind, paidNumber, paidForce) => {

    setLoad(true);
    let result = true;
    try {
        const result = await axios.post(
          variables.ADM_API_URL + `/update-payment-details`,
          {
            p_ID: doc_id,
            p_OPERATOR: user,
            p_PAYM_SUM: Number(paidAmount),
            p_PAYMDOC_TYPE_ID: paidKind.value,
            p_PAYMDOC_NUMBER: paidNumber,
            p_PAYM_DATE: paidDate,
            p_UNDERPRESSURE: Number(paidForce)
          },
          {
            headers: {
                Authorization: `Token ${token}`,
                User: 'user',
            }
          }
        );
        if(result.status !== 200)
            throw Error(result)
        setError(null);
    } catch(e) {
        console.log(e);
        setError(e);
        result = false;
    }
    setLoad(false)
    return result;
  };

  const onDeleteClick = async(doc_id) => {
    if (confirm("Вы уверены?")) {
      console.log("Выгрузка");
    } else {
      // Do nothing!
      return;
    }

    setLoad(true);
    let res = true;
    try {
        const result = await axios.delete(
          variables.ADM_API_URL + `/delete-payment-details/${doc_id}?operator=${user}`,
          {
            headers: {
                Authorization: `Token ${token}`,
                User: 'user',
            }
          }
        );
        if(result.status !== 200)
            throw Error(result)
        setError(null);
    } catch(e) {
        console.log(e);
        setError(e);
        res = false;
    }
    setLoad(false)
    return res;
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

  const ReloadSearch = () => {
  	onSearchClick(params.get('inn'), params.get('period_ucode'), params.get('iswrong'), paydoc_types)
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
      <Breadcrumb pageName="Сведения об оплатах по выставленному штрафу" />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Cписок сведений"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}
                >
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={dataColumns}
                    rowData={data}
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
                                suppressRowGroups: true,
                                suppressValues: true,
                                suppressPivots: true,
                                suppressPivotMode: true,
                                suppressColumnFilter: true,
                                suppressColumnSelectAll: true,
                                suppressColumnExpandAll: true,
                          },
                        }
                      ],
                      position: "left",
                    }}
                  />
                </div>
              </div>
            }
            buttons={
              <button
                  type="button"
                  onClick={() => ReloadSearch()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Обновить
             </button>
            }
          ></CardTable>
        </div>
      </div>
    </>
  );
};

export default Penalties;
