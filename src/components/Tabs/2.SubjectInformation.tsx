import React, { useEffect, useRef, useState, createRef, useMemo } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../variables";

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

const columns = [
  {
    enableValue: true,
    field: "NUMBERINREESTR",
    headerName: "№ в ФСРАР",
    filter: "agTextColumnFilter",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 150,
  },
  {
    enableValue: true,
    field: "LICENSESERIA",
    headerName: "Серия",
    filter: "agTextColumnFilter",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 100,
  },
  {
    enableValue: true,
    field: "LICENSENUMBER",
    headerName: "Номер",
    filter: "agTextColumnFilter",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 100,
  },
  {
    enableValue: true,
    field: "FULLADDRESSUR",
    headerName: "Область действия (адрес объекта)",
    filter: "agTextColumnFilter",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 200,
  },
  {
    enableValue: true,
    field: "KINDNAME",
    headerName: "Тип объекта",
    filter: "agTextColumnFilter",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 150,
  },
  {
    enableValue: true,
    field: "LICBEGDATE",
    headerName: "С",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 150,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return null;
      return showDate(params.getValue());
    },
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
  {
    enableValue: true,
    field: "LICENDDATE",
    headerName: "По",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 150,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return null;
      return showDate(params.getValue());
    },
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
  {
    enableValue: true,
    field: "LICPUTDATE",
    headerName: "Дата выдачи",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 150,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return null;
      return showDate(params.getValue());
    },
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
  {
    enableValue: true,
    field: "LICENSESTATETYPENAME",
    headerName: "Состояние",
    filter: "agSetColumnFilter",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 150,
  },
  {
    enableValue: true,
    field: "LICENSESTATEBEGDATE",
    headerName: "Дата состояния",
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 150,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return null;
      return showDate(params.getValue());
    },
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
];

const SubjectInformation = (props) => {
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const openInfo = async (license, licenseIndex) => {
    setLoad(true);
    if (license.info === null || license.info === undefined) {
      await getLicenseInfo(license, licenseIndex);
    }
    setLoad(false);
  };

  const getLicenseInfo = async (license, licenseIndex) => {
    const new_lic = await getLicenseList(license);
    const new_data = data.map((lic, licIndx) => {
      if (licIndx === licenseIndex) {
        lic.info = new_lic;
      }
      return lic;
    });
    setData(new_data);
    console.log(new_data);
  };

  const getLicenseList = async (license) => {
    console.log(license);
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-inn-list`,
        {
          FULLSUBJECTNAME: license.FULLSUBJECTNAME,
          INN: license.INN,
          KPPUR: license.KPPUR,
          FULLADDRESSUR: license.FULLADDRESSUR,
          EMAIL: license.EMAIL,
          PHONE: license.PHONE,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      return result.data;
    } catch (e) {
      console.log(e);
      setError(e);
    }
    return null;
  };

  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      wrapHeaderText: true,
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      //       autoHeaderHeight: true,
    };
  }, []);

  if (data === null) return null;
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
      {data.length === 0 ?
          "Отсутствуют лицензии"
      :
        data?.map((license, licenseIndx) => (
          <>
            {/*Юр. лицо*/}
            <div>
              <h4 className="mb-3 text-xl font-bold text-black dark:text-white">
                {license.FULLSUBJECTNAME}
              </h4>
              <span className="mt-1.5 block">
                <span className="font-medium text-black dark:text-white">
                  ИНН:{" "}
                </span>
                {license.INN}
              </span>
              <span className="block">
                <span className="font-medium text-black dark:text-white">
                  КПП:{" "}
                </span>
                {license.KPPUR === null ? "отсутствует" : license.KPPUR}
              </span>
              <span className="block">
                <span className="font-medium text-black dark:text-white">
                  Юридический адрес:{" "}
                </span>
                {license.FULLADDRESSUR === null
                  ? "отсутствует"
                  : license.FULLADDRESSUR}
              </span>
              <span className="block">
                <span className="font-medium text-black dark:text-white">
                  Адрес электронной почты:{" "}
                </span>
                {license.EMAIL === null ? "отсутствует" : license.EMAIL}
              </span>
              <span className="block">
                <span className="font-medium text-black dark:text-white">
                  Контактный телефон:{" "}
                </span>
                {license.PHONE === null ? "отсутствует" : license.PHONE}
              </span>
              {license.info === null || license.info === undefined ? (
                <p className="my-4 font-medium text-primary hover:opacity-75 dark:text-white">
                  <a href="#" onClick={() => openInfo(license, licenseIndx)}>
                    Смотреть список лицензий организации
                  </a>
                </p>
              ) : null}
            </div>
            {license.info === null || license.info === undefined ? null : (
              <div className="mt-10 max-w-full overflow-x-auto">
                {license.info.length === 0 ? (
                  'Список лицензий отсутствует'
                ) : (
                  <>
                    {/*Сведения о лицензиате*/}
                    <div
                      className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                      style={{ height: 450, width: "100%" }}>
                      <AgGridReact
                        columnDefs={columns}
                        rowData={license.info}
                        defaultColDef={defaultColDef}
                        autoGroupColumnDef={autoGroupColumnDef}
                        localeText={AG_GRID_LOCALE_RU}
                        pagination={true}
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
                        }}></AgGridReact>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ))
      }
    </>
  );
};

export default SubjectInformation;
