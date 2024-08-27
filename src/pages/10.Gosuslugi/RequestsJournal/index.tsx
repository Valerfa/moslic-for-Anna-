import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// Контент - Выдача
import Output from "./TabContent/Output/index.tsx";
// Контент - Продление
import Renewal from "./TabContent/Renewal/index.tsx";
// Контент - Переоформление
import ReRegistration from "./TabContent/ReRegistration/index.tsx";
// Контент - Прекращение
import Termination from "./TabContent/Termination/index.tsx";

// Кнопки
import TabsButtonRospotrebnadzor from "../../../components/UI/General/Buttons/TabsButtonRospotrebnadzor.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";
import React, {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import {
    showDate,
    variables,
} from "../../../variables.tsx";

import {
    getJsonData,
    getFiltersLists,
    getFullJsonData,
    disableFiltersList
} from "../../../utils/gridUtils.tsx";

import axios from "axios";


const DataColumnsOutput = [
    {
        enableValue: true,
        field: "dataresult",
        headerName: "ФОИВ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "arcrequestnum",
        headerName: "№ пакета",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "requestdate",
        headerName: "Дата регистрации",
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
        field: "subjectbriefname",
        headerName: "Название организации",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "objectname",
        headerName: "Объект лицензирования",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
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
        field: "docdate",
        headerName: "Дата проекта решения",
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
        field: "plandecisiondate",
        headerName: "Дата принятия решения",
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
        field: "fullpersonname",
        headerName: "Исполнитель",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "payments",
        headerName: "Оплата госпошлины",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "send2signdate",
        headerName: "Передача лицензионных документов на подпись",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "numberinreestr",
        headerName: "Номер ФСРАР",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "importantdoc",
        headerName: "№ бланка",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "negativebase",
        headerName: "Причина отказа",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "dopexpert",
        headerName: "Дополнительная экспертиза",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "complaint",
        headerName: "Жалоба",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data1cnt",
        headerName: "ЕГРЮЛ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data2cnt",
        headerName: "ФНС",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data3cnt",
        headerName: "ЕГРП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data4cnt",
        headerName: "РНиП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
];

const DataColumnsRenewal = [
    {
        enableValue: true,
        field: "dataresult",
        headerName: "ФОИВ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "arcrequestnum",
        headerName: "№ пакета",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "requestdate",
        headerName: "Дата регистрации",
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
        field: "subjectbriefname",
        headerName: "Название организации",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "objectname",
        headerName: "Объект лицензирования",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
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
        field: "docdate",
        headerName: "Дата проекта решения",
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
        field: "plandecisiondate",
        headerName: "Дата принятия решения",
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
        field: "fullpersonname",
        headerName: "Исполнитель",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "payments",
        headerName: "Оплата госпошлины",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "send2signdate",
        headerName: "Передача лицензионных документов на подпись",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "importantdoc",
        headerName: "№ бланка",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "negativebase",
        headerName: "Причина отказа",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "dopexpert",
        headerName: "Дополнительная экспертиза",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "complaint",
        headerName: "Жалоба",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data1cnt",
        headerName: "ЕГРЮЛ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data2cnt",
        headerName: "ФНС",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data3cnt",
        headerName: "ЕГРП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data4cnt",
        headerName: "РНиП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
];

const DataColumnsReRegistation = [
    {
        enableValue: true,
        field: "dataresult",
        headerName: "ФОИВ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "arcrequestnum",
        headerName: "№ пакета",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "requestdate",
        headerName: "Дата регистрации",
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
        field: "subjectbriefname",
        headerName: "Название организации",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "objectname",
        headerName: "Объект лицензирования",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
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
        field: "docdate",
        headerName: "Дата проекта решения",
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
        field: "plandecisiondate",
        headerName: "Дата принятия решения",
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
        field: "fullpersonname",
        headerName: "Исполнитель",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "processsubtypename",
        headerName: "Оплата госпошлины",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "payments",
        headerName: "Причина переоформления",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "send2signdate",
        headerName: "Передача лицензионных документов на подпись",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "importantdoc",
        headerName: "№ бланка",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "negativebase",
        headerName: "Причина отказа",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "dopexpert",
        headerName: "Дополнительная экспертиза",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "complaint",
        headerName: "Жалоба",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data1cnt",
        headerName: "ЕГРЮЛ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data2cnt",
        headerName: "ФНС",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data3cnt",
        headerName: "ЕГРП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data4cnt",
        headerName: "РНиП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
];

const DataColumnsTermination = [
    {
        enableValue: true,
        field: "dataresult",
        headerName: "ФОИВ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "arcrequestnum",
        headerName: "№ пакета",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "requestdate",
        headerName: "Дата регистрации",
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
        field: "subjectbriefname",
        headerName: "Название организации",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "objectname",
        headerName: "Объект лицензирования",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
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
        field: "orderdocdate",
        headerName: "Дата распоряжения",
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
        field: "docdate",
        headerName: "Дата проекта решения",
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
        field: "plandecisiondate",
        headerName: "Дата принятия решения",
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
        field: "fullpersonname",
        headerName: "Исполнитель",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "payments",
        headerName: "Оплата госпошлины",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "send2signdate",
        headerName: "Передача лицензионных документов на подпись",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "importantdoc",
        headerName: "№ бланка",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "negativebase",
        headerName: "Причина отказа",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "dopexpert",
        headerName: "Дополнительная экспертиза",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "complaint",
        headerName: "Жалоба",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data1cnt",
        headerName: "ЕГРЮЛ",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data2cnt",
        headerName: "ФНС",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data3cnt",
        headerName: "ЕГРП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
    {
        enableValue: true,
        field: "data4cnt",
        headerName: "РНиП",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
    },
];

let activeDataFiltersOutput = {};
let activeDataFiltersRenewal = {};
let activeDataFiltersReRegistration = {};
let activeDataFiltersTermination = {};

const Gosuslugi = () => {
  const gridRefOutput = useRef<AgGridReact>(null);
  const gridRefRenewal = useRef<AgGridReact>(null);
  const gridRefReRegistration = useRef<AgGridReact>(null);
  const gridRefTermination = useRef<AgGridReact>(null);

  const [selectedTabIndex, onSetSelectedTabIndex] = useState(0);

  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [count, setCount] = useState(0);

  const getCurrentGridRef = () => {
    var currentGridRef =  null;
    var currentDataColumns = null;
    var currentActiveFilters = null;

    switch (selectedTabIndex + 1) {
        case 1:
          currentGridRef = gridRefOutput;
          currentDataColumns = DataColumnsOutput;
          currentActiveFilters = activeDataFiltersOutput;
          break;
        case 2:
          currentGridRef =gridRefRenewal;
          currentDataColumns = DataColumnsRenewal;
          currentActiveFilters = activeDataFiltersRenewal;
          break;
        case 3:
          currentGridRef = gridRefReRegistration;
          currentDataColumns = DataColumnsReRegistation;
          currentActiveFilters = activeDataFiltersReRegistration;
          break;
        case 4:
          currentGridRef = gridRefTermination;
          currentDataColumns = DataColumnsTermination;
          currentActiveFilters = activeDataFiltersTermination;
          break;
      }
    return [currentGridRef, currentDataColumns, currentActiveFilters]
  }

  useEffect(() => {
      const currentTableParams = getCurrentGridRef();
      if(currentTableParams[0] && 'current' in currentTableParams[0]) {
        disableFilters(currentTableParams[1], currentTableParams[0]);
      }
  }, [count])

  const disableFilters = async (DataColumns, gridRef) => {
      await disableFiltersList(DataColumns, gridRef);
  }

  const getFiltersData = async(DataColumns, gridRef) => {
    const filters = await getJsonData(DataColumns, gridRef)
    return {
        ...filters,
        GroupNum: selectedTabIndex+1,
    }
  }

  const onSearchClick = async () => {
    //     if (quarter === null && year === null) return;
    setLoad(true);
    setError(null);
    console.log(selectedTabIndex+ 1)
    const currentTableParams = getCurrentGridRef();
    console.log(currentTableParams)
    currentTableParams[2] = await getFiltersData(currentTableParams[1], currentTableParams[0]);
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/RequestsJournal/count`,
        currentTableParams[2],
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      var count = result.data.count;
      setCount(count)
      var datasource = getServerSideDatasource(count, currentTableParams[2]);
      currentTableParams[0].current.api.setGridOption("serverSideDatasource", datasource);
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
        console.log(params)
        try {
          const result = await axios.post(
            variables.API_URL + `/Api/RequestsJournal/export`,
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

    const currentTableParams = getCurrentGridRef();
    console.log(currentTableParams)

    for (const row of currentTableParams[0].current.api.getColumnState()) {
      if (row.sortIndex !== null) {
        sort_info = row;
        break;
      }
    }
    console.log(sort_info);
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/RequestsJournal/export_to_excel`,
        {
            ...currentTableParams[2],
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
      <Breadcrumb pageName="Журнал обработки заявок" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <TabGroup selectedIndex={selectedTabIndex} onChange={onSetSelectedTabIndex}>
            <TabList className="flex justify-between">
              <div className="flex gap-4">
                <Tab className="rounded-md py-1 px-3 text-sm/6 font-semibold text-black bg-stroke focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Выдача
                </Tab>
                <Tab className="rounded-md py-1 px-3 text-sm/6 font-semibold text-black bg-stroke focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Продление
                </Tab>
                <Tab className="rounded-md py-1 px-3 text-sm/6 font-semibold text-black bg-stroke focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Переоформление
                </Tab>
                <Tab className="rounded-md py-1 px-3 text-sm/6 font-semibold text-black bg-stroke focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Прекращение
                </Tab>
              </div>
              <div className="flex gap-4">
                <TabsButtonRospotrebnadzor />
              </div>
            </TabList>
            <TabPanels className="mt-3">
              <TabPanel>
                {/* <!-- Контент - Выдача Start --> */}
                <Output
                    ref={gridRefOutput}
                    download={Download}
                    DataColumns={DataColumnsOutput}
                    onSearchClick={onSearchClick}
                />
                {/* <!-- Контент - Выдача End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - Продление Start --> */}
                <Renewal
                    ref={gridRefRenewal}
                    download={Download}
                    DataColumns={DataColumnsRenewal}
                    onSearchClick={onSearchClick}
                />
                {/* <!-- Контент - Продление End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - Переоформление Start --> */}
                <ReRegistration
                    ref={gridRefReRegistration}
                    download={Download}
                    DataColumns={DataColumnsReRegistation}
                    onSearchClick={onSearchClick}
                />
                {/* <!-- Контент - Переоформление End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - Прекращение Start --> */}
                <Termination
                    ref={gridRefTermination}
                    download={Download}
                    DataColumns={DataColumnsTermination}
                    onSearchClick={onSearchClick}
                />
                {/* <!-- Контент - Прекращение End --> */}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default Gosuslugi;
