import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import CardFilter from "../../../components/UI/General/CardFilter/CardFilter.tsx";
import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

import IconButtonDownload from "../../../components/UI/General/Buttons/IconButtonDownload.tsx";
import IconButtonWatch from "../../../components/UI/General/Buttons/IconButtonWatch.tsx";
import DefaultModal from "../../../components/UI/General/Modal/DefaultModal.tsx";
import IconButtonEdit from "../../../components/UI/General/Buttons/IconButtonEdit.tsx";
import DateDefaultInput from "../../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../../components/UI/General/Inputs/NumberInput.tsx";
import TextInput from "../../../components/UI/General/Inputs/TextInput";
import TextAreaInput from "../../../components/UI/General/Inputs/TextAreaInput";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../../variables.tsx";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../../utils/gridUtils.tsx";

import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import DefaultIconModalWide from "../../../components/UI/General/Modal/DefaultIconModalWide.tsx";
import IconButtonTest from "../../../components/UI/General/Buttons/IconButtonTest.tsx";
import IconButtonFolderMinus from "../../../components/UI/General/Buttons/IconButtonFolderMinus.tsx";
import IconButtonCheck from "../../../components/UI/General/Buttons/IconButtonCheck.tsx";
import IconButtonFingerGreen from "../../../components/UI/General/Buttons/IconButtonFingerGreen.tsx";
import IconButtonFingerRed from "../../../components/UI/General/Buttons/IconButtonFingerRed.tsx";
import IconButtonDocumentCheck from "../../../components/UI/General/Buttons/IconButtonDocumentCheck.tsx";

let activeDataFilters = {};

const NotSendedList = ({ token, personlog_id, resources }) => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const last_date = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0);
  const [formDateDoc, setFormDateDoc] = useState("");

  //Filters
  // Дата регистрации
  const [useDateReg, onSetUseDateReg] = useState(false);
  const [dateRegStart, onSetDateRegStart] = useState(last_date);
  const [dateRegEnd, onSetDateRegEnd] = useState(current_date);
  const [DataColumns] = useState([
    {
      enableValue: true,
      field: "createdate",
      headerName: "Создан",
      resizable: true,
      sortable: true,
      filter: "agDateColumnFilter",
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return showDate(params.getValue());
      },
    },
    {
      enableValue: true,
      field: "requestnum",
      headerName: "Заявка",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "arcrequestnum",
      headerName: "Номер дела",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "servicenumber",
      headerName: "ЕНО",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "fullpersonname",
      headerName: "Исполнитель по заявке",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "doctypename",
      headerName: "Тип документа",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists(
            "options",
            "RequestDecisionDocType",
            token
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
  ]);

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

  const onSearchClick = async () => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData();
    try {
      const result = await axios.post(
        variables.API_URL +
          `/Api/NotSendedList/count?personlog_id=${personlog_id}`,
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
            variables.API_URL +
              `/Api/NotSendedList/export?personlog_id=${personlog_id}`,
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
        variables.API_URL +
          `/Api/NotSendedList/export_to_excel?personlog_id=${personlog_id}`,
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
      <Breadcrumb pageName="Неотправленные статусы на МПГУ" />

      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Неотправленные статусы"
            buttons={
              <>
                <IconButtonDownload
                  onClick={() => Download()}
                  title={"Выгрузить"}
                />
                <button
                  type="button"
                  onClick={() => onSearchClick()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Поиск
                </button>

                <Link to="/okno/request-list/details" relative="path">
                  <IconButtonWatch title={undefined}></IconButtonWatch>
                </Link>

                {/*Модальное окно просмотра документа*/}
                <DefaultIconModalWide
                  name={""}
                  title={"Просмотр документа"}
                  textbutton={""}
                  icon={<IconButtonEdit />}
                  children={
                    <>
                      <form action="#">
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                          <div className="w-full flex flex-row gap-4">
                            <a className="text-black"> Тип документа:</a>
                            Решение о прекращении действия лицензии
                          </div>
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                          <div className="w-full sm:w-1/3">
                            <NumberInput
                              label={"Номер документа"}
                              placeholder={"Не заполнено"}
                              name={""}
                              id={""}
                              value={""}
                              onChange={function (
                                event: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                            />
                          </div>
                          <div className="w-full sm:w-1/3">
                            <DateDefaultInput
                              label={"Дата документа"}
                              selected={formDateDoc}
                              onChange={(date) =>
                                setFormDateDoc(date)
                              }></DateDefaultInput>
                          </div>
                          <div className="w-full sm:w-1/3">
                            <DateDefaultInput
                              label={"Дата контроля/вступления в силу"}
                              selected={formDateDoc}
                              onChange={(date) =>
                                setFormDateDoc(date)
                              }></DateDefaultInput>
                          </div>
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                          <div className="w-full">
                            <TextAreaInput
                              label={"Комментарий"}
                              type={"text"}
                              placeholder={"Не заполнено"}
                              value={""}
                              name={""}
                              id={""}
                              defaultvalue={""}
                              disable={false}
                            />
                          </div>
                        </div>
                      </form>
                      <TabGroup>
                        <TabList className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
                          <div className="flex justify-between w-full">
                            <div className="flex flex-wrap gap-3">
                              <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                                Содержимое
                              </Tab>
                              <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                                Исполнитель
                              </Tab>
                              <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                                Даты уведомлений
                              </Tab>
                              <Tab className="rounded-md bg-stroke py-3 px-4 text-sm font-medium  md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                                Подписание
                              </Tab>
                            </div>
                          </div>
                        </TabList>
                        <TabPanels className="leading-relaxed block">
                          <TabPanel>
                            <div className="flex flex-row gap-4">
                              <p className="text-md text-black font-medium">
                                Просмотр текста:
                              </p>
                              <div className="flex flex-row">
                                <button className="text-md hover:text-primary font-medium">
                                  Загрузить
                                </button>
                                <p className="text-md px-1">/</p>
                                <button className="text-md hover:text-primary font-medium">
                                  Выгрузить
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-row gap-4">
                              <p className="text-md text-black font-medium">
                                Просмотр образа:
                              </p>
                              <div className="flex flex-row">
                                <button className="text-md hover:text-primary font-medium">
                                  Загрузить
                                </button>
                                <p className="text-md px-1">/</p>

                                <button className="text-md hover:text-primary font-medium">
                                  Выгрузить
                                </button>
                              </div>
                            </div>
                          </TabPanel>
                          <TabPanel>
                            <div className="grid justify-items-stretch gap-4">
                              <div className="flex flex-row gap-4">
                                <div className="w-1/2">
                                  <TextInput
                                    label={"ФИО"}
                                    type={"text"}
                                    placeholder={"Не заполнено"}
                                    value={""}
                                    name={""}
                                    id={""}
                                    defaultvalue={""}
                                    onChange={undefined}
                                    disable={false}
                                  />
                                </div>
                                <div className="w-1/2">
                                  <TextInput
                                    label={"Должность"}
                                    type={"text"}
                                    placeholder={"Не заполнено"}
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                className="justify-self-end text-white bg-meta-3 hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                {" "}
                                Стать исполнителем
                              </button>
                            </div>
                          </TabPanel>
                          <TabPanel>
                            <div className="grid justify-items-stretch gap-4">
                              <div className="flex flex-row gap-4">
                                <div className="text-left w-1/3">
                                  <DateDefaultInput
                                    label={"По почте"}
                                    selected={formDateDoc}
                                    onChange={(date) =>
                                      setFormDateDoc(date)
                                    }></DateDefaultInput>
                                </div>
                                <div className="text-left w-1/3">
                                  <DateDefaultInput
                                    label={"Через управу"}
                                    selected={formDateDoc}
                                    onChange={(date) =>
                                      setFormDateDoc(date)
                                    }></DateDefaultInput>
                                </div>
                                <div className="text-left w-1/3">
                                  <DateDefaultInput
                                    label={"По e-mail"}
                                    selected={formDateDoc}
                                    onChange={(date) =>
                                      setFormDateDoc(date)
                                    }></DateDefaultInput>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="justify-self-end text-white bg-meta-3 hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                {" "}
                                Сохранить
                              </button>
                            </div>
                          </TabPanel>
                          <TabPanel>
                            <div className="flex flex-row gap-4">
                              <p className="text-md text-black font-medium">
                                Подписал:
                              </p>
                              <div className="flex flex-row">
                                <div className="text-md font-medium">
                                  Немерюк Алексей Алексеевич
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row gap-4">
                              <p className="text-md text-black font-medium">
                                Дата подписания
                              </p>
                              <div className="flex flex-row">
                                <div className="text-md font-medium">
                                  20.11.2020
                                </div>
                              </div>
                            </div>
                          </TabPanel>
                        </TabPanels>
                      </TabGroup>
                    </>
                  }
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  onClickText={"Сохранить"}
                  onClickClassName={""}></DefaultIconModalWide>
                <IconButtonFolderMinus title={"Нет образа"} />

                <IconButtonCheck title={"В ЦХЭД не зарегистрирован"} />

                <IconButtonFingerGreen title={"Есть ЭЦП"} />
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
    </>
  );
};

export default NotSendedList;
