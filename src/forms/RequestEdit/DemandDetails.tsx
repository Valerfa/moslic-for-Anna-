import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../utils/gridUtils.tsx";
import Breadcrumb from "../../components/UI/General/Breadcrumb.tsx";
import IconButtonCheck from "../../components/UI/General/Buttons/IconButtonCheck.tsx";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload.tsx";
import CardFilter from "../../components/UI/General/CardFilter/CardFilter.tsx";
import CardTable from "../../components/UI/General/CardTable/CardTable.tsx";
import DateRangeCard from "../../components/UI/General/Inputs/Filters/DateRangeCard.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import { showDate, variables, AG_GRID_LOCALE_RU } from "../../variables.tsx";
import IconButtonX from "../../components/UI/General/Buttons/IconButtonX.tsx";
import IconButtonPrint from "../../components/UI/General/Buttons/IconButtonPrint.tsx";
import IconButtonDocument from "../../components/UI/General/Buttons/IconButtonDocument.tsx";
import { Link } from "react-router-dom";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

const DataColumns = [
  {
    enableValue: true,
    field: "numberinreestr",
    headerName: "",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "numberinreestr",
    headerName: "(*)",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "numberinreestr",
    headerName: "Запрос",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "numberinreestr",
    headerName: "Ответ",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "numberinreestr",
    headerName: "Дата/Время",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "numberinreestr",
    headerName: "Сист. код",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    enableValue: true,
    field: "licensenumber",
    headerName: "Сист. сообщение",
    resizable: true,
    sortable: true,
    filter: "agNumberColumnFilter",
    filterParams: {
      allowedCharPattern: "\\d",
    },
  },
  {
    enableValue: true,
    field: "licenseseria",
    headerName: "Код",
    resizable: true,
    sortable: true,
    filter: "agSetColumnFilter",
    filterParams: {
      values: async (params) => {
        const values = await getFiltersLists(
          "requests",
          "LicenseSeria",
          "/Api/Requests/options"
        );
        console.log(values);
        params.success(values);
      },
      keyCreator: (params) => {
        return params.value.id;
      },
      valueFormatter: (params) => {
        return params.value.name;
      },
    },
  },
  {
    enableValue: true,
    field: "decisiondate",
    headerName: "Комментарий",
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
    field: "putdate",
    headerName: "Результат",
    resizable: true,
    sortable: true,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      return showDate(params.getValue());
    },
    filter: "agDateColumnFilter",
  },
];

let activeDataFilters = {};

let subjectTypeList = {};

const formatSubjectTypeList = () => {
  subjectTypeList[1] = "ЮЛ";
  subjectTypeList[2] = "ИП";
};

const DemandDetails = () => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const last_date = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0);

  //Filters
  // Дата регистрации
  const [useDateReg, onSetUseDateReg] = useState(false);
  const [dateRegStart, onSetDateRegStart] = useState(last_date);
  const [dateRegEnd, onSetDateRegEnd] = useState(current_date);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    setLoad(false);
  }, []);

  useEffect(() => {
    console.log(gridRef);
    if (gridRef && "current" in gridRef) {
      disableFilters();
    }
  }, [count]);

  const disableFilters = async () => {
    console.log(gridRef);
    disableFiltersList(DataColumns, gridRef);
  };

  const getFiltersData = async () => {
    const filters = await getJsonData(DataColumns, gridRef);

    return {
      FilterExt: {
        StartDate: useDateReg ? dateRegStart : null,
        EndDate: useDateReg ? dateRegEnd : null,
      },
      ...filters,
    };
  };

  const convertDateFormat = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}.${month}.${year}`;
  };

  const onSearchClick = async () => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData();
    try {
      if (
        activeDataFilters.FilterExt &&
        activeDataFilters.FilterExt.StartDate
      ) {
        activeDataFilters.FilterExt.StartDate = convertDateFormat(
          activeDataFilters.FilterExt.StartDate
        );
      }
      if (activeDataFilters.FilterExt && activeDataFilters.FilterExt.EndDate) {
        activeDataFilters.FilterExt.EndDate = convertDateFormat(
          activeDataFilters.FilterExt.EndDate
        );
      }
      const result = await axios.post(
        variables.API_URL + `/Api/LicenseList/count`,
        activeDataFilters,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setCount(result.data.count);
      var datasource = getServerSideDatasource(result.data.count);
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
      return 0;
    }
  };

  const getServerSideDatasource = (count) => {
    return {
      getRows: async (params) => {
        setLoad(true);
        setError(null);

        try {
          const result = await axios.post(
            variables.API_URL + `/Api/LicenseList/export`,
            await getFullJsonData(params.request, activeDataFilters),
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          if (result.success) throw Error(result);
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
        variables.API_URL + `/Api/LicenseList/export_to_excel`,
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
      <Breadcrumb pageName="Детали запроса" />
      <div className="flex flex-row h-3/5">
        <div className="flex flex-col text-md">
          <div className="flex flex-row gap-2">
            <span>Создан:</span>
            <span className="text-black">[Дата]</span>
            <span>Оператор:</span>
            <span className="text-black">[Имя оператора]</span>
          </div>
          <div className="flex flex-row gap-2">
            <span>Сохранен:</span>
            <span className="text-black">[Дата]</span>
            <span>Отправлен:</span>
            <span className="text-black">[Дата]</span>
          </div>
          <div className="flex flex-row gap-2">
            <span>Абонент:</span>
            <span className="text-black">Отправка сообщений на МПГУ v.6.1</span>
          </div>
          <div className="flex flex-row gap-2">
            <span>Код:</span>
            <span className="text-black">1</span>
            <span>Текст:</span>
            <span className="text-black">[Не отправилось]</span>
          </div>
          <div className="flex flex-row gap-2">
            <span>Количество попыток отправки:</span>
            <span className="text-black">[1]</span>
          </div>
          <IconButtonCheck /> <IconButtonPrint title={"Печать документа"} />
          <Link to="/okno/demand-details">
            <IconButtonDocument title={"Детали запроса"} />
          </Link>
        </div>
      </div>
      <TabGroup>
        <TabList>
          <div className="flex justify-between w-full">
            <div className="flex flex-wrap gap-3">
              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                История отправки
              </Tab>
              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                Связанные запросы
              </Tab>
            </div>
          </div>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
              <div className="col-span-12">
                <CardTable
                  onFiltersClick={openFilters}
                  name="История отправки"
                  buttons={
                    <>
                      <IconButtonDownload
                        onClick={() => Download()}
                        title={"Выгрузить в Excel"}
                      />
                    </>
                  }>
                  <>
                    <div className="flex flex-row ag-grid-h">
                      <div
                        className="flex flex-col ag-theme-alpine ag-theme-acmecorp flex flex-col"
                        style={{ height: "100%", width: "100%" }}>
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
                                      isChecked={useDateReg}
                                      onChangeChecked={onSetUseDateReg}
                                      name={"Дата регистрации"}
                                      inputValueMin={dateRegStart}
                                      inputChangeMin={onSetDateRegStart}
                                      inputValueMax={dateRegEnd}
                                      inputChangeMax={onSetDateRegEnd}
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
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
};

export default DemandDetails;
