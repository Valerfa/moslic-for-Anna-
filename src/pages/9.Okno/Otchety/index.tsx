import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// Контент - Выдача
import Output from "./Favorities/index.tsx";
// Контент - Продление
import Renewal from "./Available/index.tsx";
// Контент - Переоформление
import ReRegistration from "./Recent/index.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";
import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import { variables } from "../../../variables.tsx";

import {
  getJsonData,
  getFullJsonData,
  disableFiltersList,
} from "../../../utils/gridUtils.tsx";

import axios from "axios";

const DataColumnsFavorities = [
  {
    enableValue: true,
    field: "elementname",
    headerName: "Наименования отчета",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
];

const DataColumnsAvailable = [
  {
    enableValue: true,
    field: "rusdocname",
    headerName: "Наименование",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "rusdocnote",
    headerName: "Комментарий",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "fullpathrpt",
    headerName: "Путь",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
];

const DataColumnsRecent = [
  {
    enableValue: true,
    field: "reportname",
    headerName: "Наименование",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "dtstart",
    headerName: "Дата исполнения",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "params",
    headerName: "Параметры",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
];

let activeDataFiltersOutput = {};
let activeDataFiltersRenewal = {};
let activeDataFiltersReRegistration = {};

const Gosuslugi = ({ token, personlog_id, resources }) => {
  const gridRefOutput = useRef<AgGridReact>(null);
  const gridRefRenewal = useRef<AgGridReact>(null);
  const gridRefReRegistration = useRef<AgGridReact>(null);

  const [selectedTabIndex, onSetSelectedTabIndex] = useState(0);

  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const getCurrentGridRef = () => {
    var currentGridRef = null;
    var currentDataColumns = null;
    var currentActiveFilters = null;

    switch (selectedTabIndex + 1) {
      case 1:
        currentGridRef = gridRefOutput;
        currentDataColumns = DataColumnsFavorities;
        currentActiveFilters = activeDataFiltersOutput;
        break;
      case 2:
        currentGridRef = gridRefRenewal;
        currentDataColumns = DataColumnsAvailable;
        currentActiveFilters = activeDataFiltersRenewal;
        break;
      case 3:
        currentGridRef = gridRefReRegistration;
        currentDataColumns = DataColumnsRecent;
        currentActiveFilters = activeDataFiltersReRegistration;
        break;
    }
    return [currentGridRef, currentDataColumns, currentActiveFilters];
  };

  useEffect(() => {
    const currentTableParams = getCurrentGridRef();
    if (currentTableParams[0] && "current" in currentTableParams[0]) {
      disableFilters(currentTableParams[1], currentTableParams[0]);
    }
  }, [count]);

  const disableFilters = async (DataColumns, gridRef) => {
    await disableFiltersList(DataColumns, gridRef);
  };

  const getFiltersData = async (DataColumns, gridRef) => {
    const filters = await getJsonData(DataColumns, gridRef);
    return {
      ...filters,
      GroupNum: selectedTabIndex + 1,
    };
  };

  const onSearchClick = async () => {
    //     if (quarter === null && year === null) return;
    setLoad(true);
    setError(null);
    console.log(selectedTabIndex + 1);
    const currentTableParams = getCurrentGridRef();
    console.log(currentTableParams);
    currentTableParams[2] = await getFiltersData(
      currentTableParams[1],
      currentTableParams[0]
    );
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/Otchety/count?personlog_id=${personlog_id}`,
        currentTableParams[2],
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      var count = result.data.count;
      setCount(count);
      var datasource = getServerSideDatasource(count, currentTableParams[2]);
      currentTableParams[0].current.api.setGridOption(
        "serverSideDatasource",
        datasource
      );
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
    }
  };

  const getServerSideDatasource = (count, activeDataFilters) => {
    return {
      getRows: async (params) => {
        setLoad(true);
        setError(null);
        console.log(params);
        try {
          const result = await axios.post(
            variables.API_URL +
              `/Api/Otchety/export?personlog_id=${personlog_id}`,
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
        variables.API_URL +
          `/Api/Otchety/export_to_excel?personlog_id=${personlog_id}`,
        {
          ...activeDataFilters,
          sort: sort_info === null ? "id_license" : sort_info.colId,
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
      link.setAttribute("download", "Список лицензий.xlsx"); //or any other extension
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
      <Breadcrumb pageName="Отчеты" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <TabGroup
            selectedIndex={selectedTabIndex}
            onChange={onSetSelectedTabIndex}>
            <TabList className="flex justify-between">
              <div className="flex gap-4">
                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Избранное
                </Tab>
                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Все доступные
                </Tab>
                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Последние выполненные
                </Tab>
              </div>
            </TabList>
            <TabPanels className="mt-3">
              <TabPanel>
                {/* <!-- Контент - Выдача Start --> */}
                <Output
                  ref={gridRefOutput}
                  download={Download}
                  DataColumns={DataColumnsFavorities}
                  onSearchClick={onSearchClick}
                />
                {/* <!-- Контент - Выдача End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - Продление Start --> */}
                <Renewal
                  ref={gridRefRenewal}
                  download={Download}
                  DataColumns={DataColumnsAvailable}
                  onSearchClick={onSearchClick}
                />
                {/* <!-- Контент - Продление End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - Переоформление Start --> */}
                <ReRegistration
                  ref={gridRefReRegistration}
                  download={Download}
                  DataColumns={DataColumnsRecent}
                  onSearchClick={onSearchClick}
                />
                {/* <!-- Контент - Переоформление End --> */}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default Gosuslugi;
