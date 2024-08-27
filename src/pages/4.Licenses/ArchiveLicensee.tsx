import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
  useCallback,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import CellRender from "./CellRender.tsx";

import { variables, showDate, AG_GRID_LOCALE_RU } from "../../variables";

const ArchiveLicensee = () => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const params = new URLSearchParams(location.search);

  const [dataColumns] = useState([
    {
      enableValue: true,
      field: "lcn_name",
      headerName: "Название",
      filter: "agTextColumnFilter",
      resizable: true,
      rowGroup: false,
      cellRenderer: (params_table) => {
        if (
          params_table.getValue() === null ||
          params_table.getValue() === undefined
        )
          return <div></div>;
        return CellRender(params_table, loadLicense);
      },
    },
    {
      enableValue: true,
      field: "lcn_uaddr",
      headerName: "Юридический адрес",
      resizable: true,
      rowGroup: false,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "admarea",
      headerName: "Регион",
      resizable: true,
      rowGroup: false,
      filter: "agSetColumnFilter",
    },
    {
      enableValue: true,
      field: "lcn_faddr",
      headerName: "Фактический адрес",
      resizable: true,
      rowGroup: false,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "lcn_reg_num",
      headerName: "Гос. регистация",
      filter: "agTextColumnFilter",
      resizable: true,
      rowGroup: false,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return (
          <div>
            {params.getValue()} {showDate(params.data.lcn_reg_date)}
          </div>
        );
      },
    },
    {
      enableValue: true,
      field: "lcn_okpo",
      headerName: "ОКПО",
      resizable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "lcn_reg_name",
      headerName: "Орган регистрации",
      resizable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "contacts",
      headerName: "Телефон",
      resizable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "chief",
      headerName: "Руководитель",
      resizable: true,
      filter: "agTextColumnFilter",
    },
  ]);

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);

  useEffect(() => {
    if (params.get("inn") !== "null")
      onSearchClick(params.get("inn"));
  }, []);

  const onSearchClick = async (inn) => {
    setLoad(true);
    setError(null);
    try {
      const result = await axios.get(
        variables.LIC_API_URL + `/get-license-by-inn/${inn}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setData(result.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  const loadLicense = async (use_columns, licensee) => {
    setLoad(true);
    setError(null);
    let d = null;
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/get-license-by-filter`,
        {
          licensee: licensee,
          b_use: use_columns,
          lic_inn: params.get("inn"),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      d = result.data;
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
    return d;
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
      <Breadcrumb pageName="Архив лицензий" />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            name={`Cписок лицензиатов для ИНН ${params.get("inn") !== 'null'? params.get("inn") : ''}`}
            children={
              <>
                <div style={{ height: "100%", width: "100%" }}>
                  <div
                    className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{ height: 600, width: "100%" }}>
                    <AgGridReact
                      rowData={data}
                      ref={gridRef}
                      columnDefs={dataColumns}
                      defaultColDef={defaultColDef}
                      autoGroupColumnDef={autoGroupColumnDef}
                      localeText={AG_GRID_LOCALE_RU}
                      pagination={true}
                      paginationPageSize={100}
                      autosize={true}
                      rowSelection={"single"}
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
              </>
            }
            buttons={<></>}></CardTable>
        </div>
      </div>
    </>
  );
};

export default ArchiveLicensee;
