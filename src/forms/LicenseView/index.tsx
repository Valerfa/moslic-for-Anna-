import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Уведомления

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../utils/gridUtils.tsx";

import { Link } from "react-router-dom";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";
import Breadcrumb from "../../components/UI/General/Breadcrumb.tsx";
import ButtonDropdownLicenses from "../../dialogs/LicenseView/ButtonDropdownLicences.tsx";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload.tsx";
import CardTable from "../../components/UI/General/CardTable/CardTable.tsx";
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import { showDate, variables } from "../../variables.tsx";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary.tsx";
import IconButtonPlus from "../../components/UI/General/Buttons/IconButtonPlus.tsx";
import IconButtonPrint from "../../components/UI/General/Buttons/IconButtonPrint.tsx";
import IconButtonDocument from "../../components/UI/General/Buttons/IconButtonDocument.tsx";
import IconButtonClipboard from "../../components/UI/General/Buttons/IconButtonClipboard.tsx";
import IconButtonTest from "../../components/UI/General/Buttons/IconButtonTest.tsx";

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

const LicenseView = () => {
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
      <Breadcrumb pageName="Лицензия" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Сведения о лицензии"
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
                  <p className="text-md text-black">Номер ФСРАР:</p>{" "}
                  <div className="">*данные*</div>{" "}
                  <div className="">
                    <Link to="/">
                      <IconButtonPrint title={"Карточка"} />{" "}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Внутренний номер:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Вид деятельности:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Лицензиат:</p>{" "}
                  <Link
                    to="/subject-view"
                    relative="path"
                    className="text-primary underline underline-offset-4 cursor-pointer">
                    {" "}
                    *данные*
                  </Link>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Срок действия:</p>{" "}
                  <div className="">00.00.0000</div> <a>-</a>
                  <div className="">00.00.0000</div>
                </div>

                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Решение:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Бланк:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Состояние:</p>{" "}
                  <div className="">*данные*</div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-md text-black">Дата выдачи:</p>{" "}
                  <div className="">00.00.0000</div>
                </div>
                <div className="mt-4">
                  <ButtonDropdownLicenses />
                </div>
                {/*Кнопки перелистывания лицензий*/}
                <div className="flex flex-row gap-4 mt-4">
                  <ButtonsSecondary children={undefined}>
                    {"<<"}
                  </ButtonsSecondary>
                  <ButtonsSecondary children={undefined}>
                    {">>"}
                  </ButtonsSecondary>
                </div>
              </div>

              {/*Табы*/}
              <TabGroup>
                <TabList className="p-5.5 flex flex-wrap gap-3 border-t border-stroke pb-5 dark:border-strokedark">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-wrap gap-3">
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        Места деятельности
                      </Tab>
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        Дополнения
                      </Tab>
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        Виды продукции
                      </Tab>
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        Журнал печати
                      </Tab>
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        Журнал состояний
                      </Tab>
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        Заявки
                      </Tab>
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        Места выездного обслуживания
                      </Tab>
                      <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                        РРО
                      </Tab>
                    </div>
                  </div>
                </TabList>
                <TabPanels className="leading-relaxed block p-5.5">
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
                  <TabPanel>- Вкладка "Дополнения" -</TabPanel>
                  <TabPanel>
                    {" "}
                    <table className="table-fixed p-4 rounded-xl border border-1 border-stroke">
                      <thead>
                        <tr>
                          <th className="p-2.5 border border-1 border-stroke">
                            Наименование
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border border-1 border-stroke">
                            *контент*
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </TabPanel>
                  <TabPanel>
                    <IconButtonDocument title={"Вызов отчета"} />
                    <IconButtonPrint title={"Печать мест деятельности"} />
                    <IconButtonClipboard
                      title={"Сохранение результатов печати"}
                    />
                  </TabPanel>
                  <TabPanel>
                    <IconButtonTest title={undefined} />
                  </TabPanel>
                  <TabPanel>- Вкладка "Заявки" -</TabPanel>
                  <TabPanel>
                    - Вкладка "Места выездного обслуживания" -
                  </TabPanel>
                  <TabPanel>- Вкладка "РРО" -</TabPanel>
                </TabPanels>
              </TabGroup>
            </>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default LicenseView;
