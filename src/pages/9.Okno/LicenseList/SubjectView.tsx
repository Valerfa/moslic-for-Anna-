import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import CardFilter from "../../../components/UI/General/CardFilter/CardFilter.tsx";
import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

import IconButtonDownload from "../../../components/UI/General/Buttons/IconButtonWarning.tsx";
import IconButtonWarning from "../../../components/UI/General/Buttons/IconButtonWarning.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../../variables.tsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../../utils/gridUtils.tsx";

import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx";
import { Link } from "react-router-dom";
import IconButtonWatch from "../../../components/UI/General/Buttons/IconButtonWatch.tsx";
import IconButtonBook from "../../../components/UI/General/Buttons/IconButtonBook.tsx";
import IconCircleRed from "../../../components/UI/General/Buttons/IconCircleRed.tsx";
import IconCircleGreen from "../../../components/UI/General/Buttons/IconCircleGreen.tsx";
import ModalIconObjectView from "../../../dialogs/SubjectView/ModalIconObjectView.tsx";

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

const SubjectView = () => {
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
      <Breadcrumb pageName="Субъект" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Общие сведения"
            buttons={
              <>
                <IconButtonDownload
                  onClick={() => Download()}
                  title={"Выгрузить в Excel"}
                />
              </>
            }>
            <>
              {/*Данные о лицензии*/}
              <div className="p-5.5 col-span-12 grid-grid-col gap-4">
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Полное наименование:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Краткое наименование:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">ОПФ:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Юридический адрес:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Фактический адрес:</p>{" "}
                  <div className="">*данные*</div>
                </div>

                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">ИНН:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">КПП:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">ОГРН:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">ОКПО:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Уставной капитал:</p>{" "}
                  <div className="">*данные*</div>
                </div>
              </div>

              {/*Табы*/}
              <TabGroup>
                <TabList className="p-5.5 flex flex-wrap gap-3 border-t border-stroke pb-5 dark:border-strokedark">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-wrap gap-3">
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Экземпляры
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Объекты
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Банковские реквизиты
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Заявки
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Лицензии
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Межвед
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Обследования
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Проверки
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Административный дела
                      </Tab>
                    </div>
                  </div>
                </TabList>
                <TabPanels className="leading-relaxed block p-5.5">
                  <TabPanel>
                    - Вкладка "Экземпляры" -{/* Иконка книга */}
                    <div className="" title="Текущая запись">
                      <IconButtonBook className="stroke-[#637381] h-6"></IconButtonBook>
                    </div>
                    {/* Зеленый круг */}
                    <div className="" title="[ Инфо о лицензии ]">
                      <IconCircleGreen className="fill-meta-3 h-6"></IconCircleGreen>
                    </div>
                    {/* Красный круг */}
                    <div className="" title="Недействующая">
                      <IconCircleRed className="fill-meta-1 h-6"></IconCircleRed>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <ModalIconObjectView />
                  </TabPanel>
                  <TabPanel>- Вкладка "Банковские реквизиты" -</TabPanel>
                  <TabPanel>- Вкладка "Заявки" - </TabPanel>
                  <TabPanel>- Вкладка "Лицензии" -</TabPanel>
                  <TabPanel>- Вкладка "Межвед" -</TabPanel>
                  <TabPanel>
                    - Вкладка "Обследования" -{/* Иконка просмотр */}
                    <Link to="/inspection-view" title="Просмотр обследования">
                      <IconButtonWatch className="fill-meta-3 h-6"></IconButtonWatch>
                    </Link>
                  </TabPanel>

                  <TabPanel>- Вкладка "Проверки" -</TabPanel>
                  <TabPanel>- Вкладка "Административные дела" -</TabPanel>
                </TabPanels>
              </TabGroup>
            </>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default SubjectView;
