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
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import Breadcrumb from "../../components/UI/General/Breadcrumb";
import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";
import Tabs from "../../components/Tabs/Tabs";

import InputDefault from "../../components/UI/General/Inputs/Input";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import { variables, AG_GRID_LOCALE_RU, LicDataColumns, showDate, getCurrentYear, getCurrentQuarter } from "../../variables";

const Declarations = () => {
  const gridRef = useRef<AgGridReact>(null);
  const navigate = useNavigate();
  const current_date = new Date();

  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");

  const [is_open_filters, setFilters] = useState(true);

  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);

  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);

  const [data, setData] = useState([]);

  const [selectedAddr, setAddr] = useState([]);

  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const getQuarters = async () => {
    try {
      const result = await axios.get(variables.LIC_API_URL + `/quarters`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setQuarters(
        result.data?.map((i) => ({
          value: i.quarter,
          name: i.period_name,
          code: i.period_code,
        }))
      );
      setQuarter(getCurrentQuarter());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getYears = async () => {
    try {
      const result = await axios.get(variables.LIC_API_URL + `/years`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setYears(result.data.map((i) => ({ value: i.year, name: i.year })));
      setYear(getCurrentYear());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const onSearchClick = async () => {
    if (quarter === null) {
      alert("Выберите квартал!");
      return;
    }
    if (year === null) {
      alert("Выберите год!");
      return;
    }
    setLoad(true);
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-objects`,
        {
          PERIOD_CODE: quarter.code,
          PERIOD_YEAR: year.value,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setData(result.data);
      console.log(result.data[0]);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  useEffect(() => {
    getQuarters();
    getYears();
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setAddr(
      selectedRows?.map((i) => ({
        address: i["FULLADDRESSUR"],
        name: i["FULLSUBJECTNAME"],
      }))
    );
  }, []);

  const onClick = () => {
    localStorage.setItem("addresses", JSON.stringify(selectedAddr));
    const link = document.createElement("a");
    link.href = "map";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const Download = useCallback(() => {
    setLoad(true);
	gridRef.current!.api.exportDataAsExcel({
	    processCellCallback: function (cell) {
            var cellVal = cell.value;
            switch(cell.column.colId) {
                case "OGRN":
                    cellVal = ' ' + String(cellVal);
                    break;
                case "LICBEGDATE":
                case "LICENDDATE":
                case "LICPUTDATE":
                    cellVal = showDate(cellVal);
                    break;
                default:
                    break
            }
            return cellVal;
        }
	});
	setLoad(false);
  }, []);

  const redirectSummary = () => {
    const link = document.createElement("a");
    link.href = `licensesSummary?quarter=${
      quarter === null ? null : quarter.code
    }&year=${year === null ? null : year.value}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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
      <Breadcrumb pageName="Реестр действующих лицензий" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          {/*Карточка 1*/}
          <div className="col-span-4">
            <Card name="Период">
              <form action="#">
                <div className="mb-5.5 flex flex-row gap-5.5">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Квартал
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={quarters}
                        value={quarter}
                        onChange={(e) => setQuarter(e)}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Год
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={years}
                        value={year}
                        onChange={(e) => setYear(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            name={"Лицензии"}
            onFiltersClick={openFilters}
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}
                >
                  <AgGridReact
                    ref={gridRef}
                    rowData={data}
                    columnDefs={LicDataColumns}
                    localeText={AG_GRID_LOCALE_RU}
                    autoGroupColumnDef={autoGroupColumnDef}
                    defaultColDef={defaultColDef}
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
              <>
                <IconButtonDownload onClick={() => Download()} />
                <button
                  type="button"
                  onClick={() => redirectSummary()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Сводка по лицензиям
                </button>
                <button
                  type="button"
                  onClick={() => onSearchClick()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Поиск
                </button>
              </>
            }
          ></CardTable>
        </div>
      </div>
    </>
  );
};

export default Declarations;
