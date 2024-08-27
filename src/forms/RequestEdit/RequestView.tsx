import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../variables.tsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../utils/gridUtils.tsx";

import { Link } from "react-router-dom";
import Breadcrumb from "../../components/UI/General/Breadcrumb.tsx";
import IconButtonUser from "../../components/UI/General/Buttons/ButtonIconUser.tsx";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary.tsx";
import IconButtonCalendarDays from "../../components/UI/General/Buttons/IconButtonCalendarDays.tsx";
import IconButtonCopy from "../../components/UI/General/Buttons/IconButtonCopy.tsx";
import IconButtonDocument from "../../components/UI/General/Buttons/IconButtonDocument.tsx";
import IconButtonDocumentCheck from "../../components/UI/General/Buttons/IconButtonDocumentCheck.tsx";
import IconButtonDocumentPlus from "../../components/UI/General/Buttons/IconButtonDocumentPlus.tsx";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload.tsx";
import IconButtonHand from "../../components/UI/General/Buttons/IconButtonHand.tsx";
import IconButtonWatch from "../../components/UI/General/Buttons/IconButtonWatch.tsx";
import CardTable from "../../components/UI/General/CardTable/CardTable.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";

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

const RequestView = () => {
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
      <Breadcrumb pageName="Просмотр заявки" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Просмотр заявки"
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
              <div className="flex flex-row h-3/5">
                <div className="flex flex-col p-5">
                  <Link to="/okno/request-edit">
                    <ButtonPrimary
                      children={undefined}
                      onClick={function (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      id={undefined}>
                      Редактировать{" "}
                    </ButtonPrimary>
                  </Link>
                  <div className="flex flex-row gap-2">
                    <span>Тип заявки:</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Дата заявки:</span>
                    <span>[Дата]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Рег. номер/Номер дела:</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>По обращению (ЕНО):</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Исполнить к:</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Ответственный:</span>
                    <span>[Данные]</span>
                  </div>

                  <div className="flex flex-row gap-2">
                    <span>Вид деятельности:</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Срок:</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Начиная с:</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Комментарий:</span>
                    <span>[Данные]</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Заявитель:</span>
                    <Link to="/subject-view" className="text-primary">
                      [Данные]
                    </Link>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>На основе лицензии:</span>
                    <Link to="/license-view" className="text-primary">
                      [Данные]
                    </Link>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span>Состояние:</span>
                    <span>[Данные]</span>
                  </div>
                </div>
              </div>
              <div className="border-b border-stroke">
                <p className="px-5.5 py-4 text-black">Результаты</p>
              </div>
              <IconButtonDocumentCheck title={"Решение от [ дата ]"} />
              <IconButtonHand title={"Выдача от [ дата ]"} />{" "}
              <div className="mx-5.5 my-4 border border-stroke rounded-md p-4">
                * таблица *{" "}
              </div>
              {/*Табы*/}
              <TabGroup>
                <TabList className="p-5.5 flex flex-wrap gap-3 pb-5 dark:border-strokedark">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-wrap gap-3">
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Объекты
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Обследования
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Представлены
                      </Tab>
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Разработаны
                      </Tab>
                    </div>
                  </div>
                </TabList>
                <TabPanels className="leading-relaxed block p-5.5">
                  {/*Вкладка Объекты*/}
                  <TabPanel>
                    <table className="table-fixed p-4 rounded-xl border border-1 border-stroke">
                      <thead>
                        <tr>
                          <th className="p-2.5 border border-1 border-stroke">
                            КПП
                          </th>
                          <th className="p-2.5 border border-1 border-stroke">
                            Наименование
                          </th>
                          <th className="p-2.5 border border-1 border-stroke">
                            Адрес
                          </th>
                          <th className="p-2.5 border border-1 border-stroke">
                            Общепит
                          </th>
                          <th className="p-2.5 border border-1 border-stroke">
                            16,5 %
                          </th>
                          <th className="p-2.5 border border-1 border-stroke">
                            Виды работ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </TabPanel>

                  {/*Вкладка Обследования*/}
                  <TabPanel>
                    {" "}
                    {/* Иконка просмотр */}
                    <Link to="/inspection-view" title="Просмотр обследования">
                      <IconButtonWatch className="fill-meta-3 h-6"></IconButtonWatch>
                    </Link>
                  </TabPanel>

                  {/*Вкладка Представлены*/}
                  <TabPanel>
                    <IconButtonUser
                      title={"Документы, предоставленные заявителем лично"}
                    />
                    <IconButtonCopy
                      title={"Документы, полученные по межведу"}
                    />
                    <IconButtonDocument title={"Оригинал"} />

                    <IconButtonCopy title={"Копия"} />
                    <IconButtonDocumentPlus title={"Создан [ дата ]"} />
                    <IconButtonCalendarDays
                      title={"Получен на экспертизу [ дата ]"}
                    />
                  </TabPanel>

                  {/*Вкладка Разработаны*/}
                  <TabPanel>
                    {" "}
                    <IconButtonDocument title={"Оригинал"} />
                    <IconButtonCopy title={"Копия"} />
                    <IconButtonDocumentPlus title={"Создан [ дата ]"} />
                    <IconButtonHand title={"Выдан на руки от [ дата ]"} />
                    <IconButtonCalendarDays title={"Создан [ дата ]"} />
                    <IconButtonDocumentCheck
                      title={"Подписан [ дата ] [ ФИО ]"}
                    />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default RequestView;
