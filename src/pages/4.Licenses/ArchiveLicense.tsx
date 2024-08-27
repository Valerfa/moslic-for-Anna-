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

import CellRender2 from "./CellRender2.tsx";
import ModalFetch from "./LicenseModal";

import { variables, showDate, AG_GRID_LOCALE_RU } from "../../variables";

var filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue.replace(" GMT", "");
    if (dateAsString == null) return -1;
    var cellDate = Date.parse(dateAsString);
    if (filterLocalDateAtMidnight.getTime() === cellDate) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

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
        field: "seria",
        headerName: "Серия",
        filter: 'agTextColumnFilter',
        resizable: true,
        rowGroup: false,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return <div>
            <ModalFetch
                title={'Инфо'}
                onClickText={params.data.seria}
                onClick={() => console.log('')}
                children={
                    <>
                      <p>Документ: Оформление лицензии (HI#{params.data.docum_type} - Заявка#{params.data.docum_id})</p>
                      <p>Серия, Номер, Код: {params.data.seria}, {params.data.nomer_lic}, {params.data.kod}</p>
                      <br/>
                      <p>Лицензиат: {params.data.lcn_name}</p>
                      <p>ИНН: {params.data.lcn_inn}</p>
                      <p>Юр. адрес: {params.data.lcn_uaddr}</p>
                      <p>Сведетельство о рег.: {params.data.lcn_reg_num} {showDate(params.data.lcn_reg_date)}</p>
                      <p>Орган регистрации: {params.data.lcn_reg_name}</p>
                      <p>Контакт: {params.data.contacts}</p>
                      <br/>
                      <p>Срок действия документа: {showDate(params.data.startdate)} по {showDate(params.data.stopdate)}</p>
                      <p>Виды работ/услуг: {params.data.typetrade}</p>
                      <br/>
                      <p>Область действия: {params.data.admarea}</p>
                      <p>Виды объекта: {params.data.type_object}</p>
                      <p>Вид расчета: {params.data.paymode}</p>
                      <p>Дата подачи заявки: {showDate(params.data.dateapp)}</p>
                      <p>Дата решения: {showDate(params.data.datesol)}</p>
                      <p>Дата выдачи: {showDate(params.data.dateget)}</p>
                      <p>Дата контрольной проверки: </p>
                      <p>Примечение: {params.data.note}</p>
                      <p>Документ подписан: {params.data.chief}</p>
                    </>
                }
            ></ModalFetch>
          </div>;
        },
      },
      {
        enableValue: true,
        field: "nomer_lic",
        headerName: "Номер",
        resizable: true,
        rowGroup: false,
        filter: 'agTextColumnFilter',
      },
      {
        enableValue: true,
        field: "kod",
        headerName: "Код",
        resizable: true,
        rowGroup: false,
        filter: 'agTextColumnFilter',
      },
      {
        enableValue: true,
        field: "startdate",
        headerName: "Начало действия",
        filter: 'agDateColumnFilter',
        filterParams: filterParams,
        resizable: true,
        rowGroup: false,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return <div>{showDate(params.getValue())}</div>;
        },
      },
      {
        enableValue: true,
        field: "stopdate",
        filter: 'agDateColumnFilter',
        headerName: "Окончание действия",
        filterParams: filterParams,
        resizable: true,
        rowGroup: false,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return <div>{showDate(params.getValue())}</div>;
        },
      },
      {
        enableValue: true,
        field: "filedb",
        headerName: "Хранилище",
        filter: 'agSetColumnFilter',
        resizable: true,
        rowGroup: false,
      },
  ])

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);

  useEffect(() => {
    if (params.get("seria") && params.get("number") && params.get("kod") && params.get("startdate") && params.get("stopdate"))
      onSearchClick(params.get("seria"), params.get("number"), params.get("kod"), params.get("startdate"), params.get("stopdate"));
  }, []);

  const onSearchClick = async (seria, number, kod, startdate, stopdate) => {
    setLoad(true);
    setError(null);
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/get-licenses-list`,
        {
            seria: seria,
            number: number,
            kod: kod,
            startdate: startdate,
            stopdate: stopdate
        },
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
            name={`Cписок лицензий`}
            children={
              <>
                <div style={{ height: "100%", width: "100%" }}>
                  <div
                    className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{ height: 600, width: "100%" }}
                  >
                    <AgGridReact
                      rowData={data}
                      ref={gridRef}
                      columnDefs={dataColumns}
                      defaultColDef={defaultColDef}
                      autoGroupColumnDef={autoGroupColumnDef}
                      localeText={AG_GRID_LOCALE_RU}
                      pagination={true}
                      paginationPageSize={100}
                      cacheBlockSize={100}
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
            buttons={
              <>
              </>
            }
          ></CardTable>
        </div>
      </div>
    </>
  );
};

export default ArchiveLicensee;
