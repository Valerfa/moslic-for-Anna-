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

import IconButtonDownload from "../../../components/UI/General/Buttons/IconButtonDownload.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../../variables.tsx";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../../utils/gridUtils.tsx";

import DateRangeCard from "../../../components/UI/General/Inputs/Filters/DateRangeCard.tsx";
import IconButtonWatch from "../../../components/UI/General/Buttons/IconButtonWatch.tsx";
import { Link } from "react-router-dom";
import DefaultIconModalWide from "../../../components/UI/General/Modal/DefaultIconModalWide.tsx";
import IconButtonEdit from "../../../components/UI/General/Buttons/IconButtonEdit.tsx";
import NumberInput from "../../../components/UI/General/Inputs/NumberInput.tsx";
import DateDefaultInput from "../../../components/UI/General/Inputs/DateDefaultInput.tsx";
import TextAreaInput from "../../../components/UI/General/Inputs/TextAreaInput.tsx";
import CheckboxDefault from "../../../components/UI/General/Inputs/CheckboxDefault.tsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

let activeDataFilters = {};

let subjectTypeList = {};

const formatSubjectTypeList = () => {
  subjectTypeList[1] = "ЮЛ";
  subjectTypeList[2] = "ИП";
};

const NoticeGoverment = ({ token, personlog_id, resources }) => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const last_date = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [count, setCount] = useState(0);
  const [DataColumns] = useState([
    {
      enableValue: true,
      field: "numberinreestr",
      headerName: "Дата создания",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "licensenumber",
      headerName: "Тип",
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
      headerName: "Управа",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists(
            "options",
            "LicenseSeria",
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
    {
      enableValue: true,
      field: "decisiondate",
      headerName: "Округ",
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
      headerName: "Тип процесса",
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
      field: "lic_start",
      headerName: "Номер",
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
      field: "lic_stop",
      headerName: "Номер дела",
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
      field: "curlic_stop",
      headerName: "Дата",
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
      field: "fullsubjectname",
      headerName: "Номер",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "id_subjecttype",
      headerName: "Состояние",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        formatSubjectTypeList();
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return subjectTypeList[params.getValue()];
      },
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          console.log(params.column);
          const values = await getFiltersLists("options", "SubjectType", token);
          for (let i of values) {
            subjectTypeList[i.id] = i.name;
          }
          console.log(subjectTypeList);
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
      field: "inn",
      headerName: "Лицензия",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "licensestatetypename",
      headerName: "Наименование",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists(
            "options",
            "LicenseStateType",
            token
          );
          console.log(values);
          params.success(values);
        },
        keyCreator: (params) => {
          return params.value.name;
        },
        valueFormatter: (params) => {
          return params.value.name;
        },
      },
    },
    {
      enableValue: true,
      field: "id_arbitrationlsl",
      headerName: "ИНН",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "id_arbitrationlsl",
      headerName: "Наименование",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "id_arbitrationlsl",
      headerName: "Актуальный адрес",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "id_arbitrationlsl",
      headerName: "Адрес",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
  ]);

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
        variables.API_URL +
          `/Api/LicenseList/count?personlog_id=${personlog_id}`,
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
              `/Api/LicenseList/export?personlog_id=${personlog_id}`,
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
          `/Api/LicenseList/export_to_excel?personlog_id=${personlog_id}`,
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
      <Breadcrumb pageName="Уведомления в управы и префектуры" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Список уведомлений"
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

                {/* Просмотр лицензии */}
                <Link to="/license-view" relative="path">
                  <IconButtonWatch title="Просмотр лицензии"></IconButtonWatch>
                </Link>

                {/* Состояние лицензии */}
                <Link
                  to="/licensing/notice-goverment/license-state"
                  relative="path">
                  <IconButtonWatch title="Состояние лицензии"></IconButtonWatch>
                </Link>

                {/* Модальное окно при нажатии на иконку "Карандаш" */}
                <DefaultIconModalWide
                  name={"Редактирование документа"}
                  title={"Редактирование документа"}
                  textbutton={undefined}
                  icon={<IconButtonEdit />}
                  children={
                    <>
                      {" "}
                      <form action="#">
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                          <div className="w-full flex flex-row gap-4">
                            <a className="text-black"> Тип документа:</a>
                            Проедостережение о недопустимости нарушения
                            (остатки)
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
                              onChange={undefined}
                              selected={""}></DateDefaultInput>
                          </div>
                          <div className="w-full sm:w-1/3">
                            {" "}
                            <DateDefaultInput
                              label={"Дата контроля/вступления в силу"}
                              onChange={undefined}
                              selected={""}></DateDefaultInput>
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
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                          <CheckboxDefault
                            label={"Оригинал"}
                            name={""}
                            id={""}
                            value={false}
                            onChange={undefined}
                          />
                          <CheckboxDefault
                            label={"Копия/эл. образ"}
                            name={""}
                            id={""}
                            value={false}
                            onChange={undefined}
                          />
                          <CheckboxDefault
                            label={"Заверенная копия"}
                            name={""}
                            id={""}
                            value={false}
                            onChange={undefined}
                          />
                        </div>
                        <div className="mt-8">
                          <TabGroup>
                            <TabList className="flex flex-row gap-4">
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                                Содежимое
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                                Исполнитель
                              </Tab>
                              <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                                Подписание
                              </Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel className="text-black text-sm mt-4">
                                <div className="flex flex-row gap-2">
                                  <span>Просмотр текста:</span>
                                  <span>Загрузить</span>
                                  <span>Выгрузить</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                  <span>Просмотр образа:</span>
                                  <span>Загрузить</span>
                                  <span>Выгрузить</span>
                                </div>
                              </TabPanel>
                              <TabPanel className="text-black text-sm mt-4 text-left">
                                Иванов Иван Иваныч
                              </TabPanel>
                              <TabPanel className="text-black text-sm mt-4 text-left">
                                Иванов Иван Иваныч
                              </TabPanel>
                            </TabPanels>
                          </TabGroup>
                        </div>
                      </form>
                    </>
                  }
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  onClickText={"Сохранить"}
                  onClickClassName={""}></DefaultIconModalWide>
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

export default NoticeGoverment;