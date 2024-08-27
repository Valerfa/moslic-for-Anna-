import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../utils/gridUtils";

import { Link } from "react-router-dom";
import Breadcrumb from "../../components/UI/General/Breadcrumb";
import IconButtonBook from "../../components/UI/General/Buttons/IconButtonBook";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";
import IconButtonEdit from "../../components/UI/General/Buttons/IconButtonEdit";
import IconButtonWatch from "../../components/UI/General/Buttons/IconButtonWatch";
import IconButtonX from "../../components/UI/General/Buttons/IconButtonX";
import IconCircleGreen from "../../components/UI/General/Buttons/IconCircleGreen";
import IconCircleRed from "../../components/UI/General/Buttons/IconCircleRed";
import CardTable from "../../components/UI/General/CardTable/CardTable";
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";
import ErrorNotification from "../../components/UI/General/Notifications/Error";
import ProcessNotification from "../../components/UI/General/Notifications/Process";
import ModalIconObjectView from "../../dialogs/SubjectView/ModalIconObjectView";
import { showDate, variables } from "../../variables";
import CheckboxQuarter from "../../components/UI/General/Inputs/CheckBoxQuarter";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonDropdownRequest from "../../dialogs/SubjectView/ButtonDropdownRequest";
import ButtonDropdown3 from "../../components/UI/General/Buttons/ButtonDropdown3";
import DefaultModalNarrow from "../../components/UI/General/Modal/DefaultModalNarrow";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import TextAreaInput from "../../components/UI/General/Inputs/TextAreaInput";
import TextInput from "../../components/UI/General/Inputs/TextInput";
import IconButtonDocument from "../../components/UI/General/Buttons/IconButtonDocument";

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
            name="Сведения о субъекте"
            buttons={
              <>
                <IconButtonDownload
                  onClick={() => Download()}
                  title={"Выгрузить в Excel"}
                />
                <IconButtonX />
                <DefaultIconModalWide
                  name={""}
                  title={""}
                  textbutton={""}
                  icon={<IconButtonEdit />}
                  children={undefined}
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  onClickText={"Сохранить"}
                  onClickClassName={""}></DefaultIconModalWide>
                <IconCircleGreen title={"Действующая лицензия"} />
                <IconCircleRed title={"Действие лицензии прекращено"} />
              </>
            }>
            <>
              {/*Данные о лицензии*/}
              <div className="p-5.5 col-span-12 grid grid-cols-2 gap-5.5">
                <div className="grid grid-col gap-5.5">
                  {/*Общие сведения*/}
                  <div className="text-black col-span-4 flex flex-col">
                    <span className="text-bodydark2">Общие сведения</span>
                    <div className="flex flex-row gap-2">
                      <span>Полное наименование:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Краткое наименование:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>ОПФ:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Юридический адрес:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Фактический адрес:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>ИНН:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>КПП:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>ОГРН:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>ОКПО:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Уставной капитал:</span>
                      <span>[Данные]</span>
                    </div>
                  </div>
                  {/*Контакты*/}
                  <div className="text-black col-span-4 flex flex-col">
                    <span className="text-bodydark2">Контакты</span>
                    <div className="flex flex-row gap-2">
                      <span>Телефон:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Факс:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>E-mail:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Web:</span>
                      <span>[Данные]</span>
                    </div>
                  </div>
                  {/*Руководитель*/}
                  <div className="text-black col-span-4 flex flex-col">
                    <span className="text-bodydark2">Руководитель</span>
                    <div className="flex flex-row gap-2">
                      <span>Должность:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Фамилия:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Имя:</span>
                      <span>[Данные]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Отчество:</span>
                      <span>[Данные]</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-col gap-5.5">
                  {/*Свидетельство о постановке на налоговый учет*/}
                  <div className="text-black col-span-4 flex flex-col">
                    <span className="text-bodydark2">
                      Свидетельство о постановке на налоговый учет
                    </span>
                    <div className="flex flex-row gap-2">
                      <span>Государственная налоговая инспекция:</span>
                      <span>[ Данные ]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Дата:</span>
                      <span>[ Дата ]</span>
                    </div>
                  </div>
                  {/*Свидетельство о государственной регистрации*/}
                  <div className="text-black col-span-4 flex flex-col">
                    <span className="text-bodydark2">
                      Свидетельство о государственной регистрации
                    </span>
                    <div className="flex flex-row gap-2">
                      <span>Регистрирующий орган:</span>
                      <span>[ Данные ]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Дата:</span>
                      <span>[ Дата ]</span>
                    </div>
                  </div>
                  {/*Свидетельство субъекта малого предпринимательства*/}
                  <div className="text-black col-span-4 flex flex-col">
                    <span className="text-bodydark2">
                      Свидетельство субъекта малого предпринимательства
                    </span>
                    <div className="flex flex-row gap-2">
                      <span>Регистрирующий орган:</span>
                      <span>[ Данные ]</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span>Дата:</span>
                      <span>[ Дата ]</span>
                    </div>
                  </div>
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
                        Административные дела
                      </Tab>
                    </div>
                  </div>
                </TabList>
                <TabPanels className="leading-relaxed block p-5.5">
                  {/* ---------- Вкладка Экземпляры ---------- */}
                  <TabPanel>
                    <Link
                      to="/subject-view"
                      relative="path"
                      className="text-primary underline underline-offset-4 cursor-pointer">
                      {" "}
                      *запись из таблицы*
                    </Link>
                    {/* Иконка книга */}
                    <div className="" title="Текущая запись">
                      <IconButtonBook className="stroke-[#637381] h-6"></IconButtonBook>
                    </div>
                    {/* Зеленый круг */}
                    <div className="" title="">
                      <IconCircleGreen className="fill-meta-3 h-6"></IconCircleGreen>
                    </div>
                    {/* Красный круг */}
                    <div className="" title="">
                      <IconCircleRed className="fill-meta-1 h-6"></IconCircleRed>
                    </div>
                  </TabPanel>

                  {/* ---------- Вкладка Объекты ---------- */}
                  <TabPanel>
                    {" "}
                    <ModalIconObjectView />
                    {/* Зеленый круг */}
                    <div className="" title="Актуальное значение">
                      <IconCircleGreen className="fill-meta-3 h-6"></IconCircleGreen>
                    </div>
                    {/* Красный круг */}
                    <div className="" title="">
                      <IconCircleRed className="fill-meta-1 h-6"></IconCircleRed>
                    </div>
                  </TabPanel>

                  {/* ---------- Вкладка Банковские реквизиты ---------- */}
                  <TabPanel>
                    {" "}
                    {/* Зеленый круг */}
                    <div className="" title="Основные">
                      <IconCircleGreen className="fill-meta-3 h-6"></IconCircleGreen>
                    </div>
                    {/* Красный круг */}
                    <div className="" title="">
                      <IconCircleRed className="fill-meta-1 h-6"></IconCircleRed>
                    </div>
                  </TabPanel>

                  {/* ---------- Вкладка Заявки ---------- */}
                  <TabPanel>
                    <CheckboxQuarter
                      label={"Все с текущим ИНН"}
                      name={""}
                      id={""}
                      value={false}
                      onChange={undefined}
                    />
                    {/* Зеленый круг */}
                    <div className="" title="[ Инфо о лицензии ]">
                      <IconCircleGreen className="fill-meta-3 h-6"></IconCircleGreen>
                    </div>
                    {/* Красный круг */}
                    <div className="" title="Недействующая">
                      <IconCircleRed className="fill-meta-1 h-6"></IconCircleRed>
                    </div>
                    <Link
                      to="/request-view"
                      relative="path"
                      className="text-primary underline underline-offset-4 cursor-pointer">
                      {" "}
                      *запись из таблицы*
                    </Link>
                  </TabPanel>

                  {/* ---------- Вкладка Лицензии ---------- */}
                  <TabPanel>
                    {" "}
                    <Link
                      to="/license-view"
                      relative="path"
                      className="text-primary underline underline-offset-4 cursor-pointer">
                      {" "}
                      *запись из таблицы*
                    </Link>
                  </TabPanel>

                  {/* ---------- Вкладка Межвед ---------- */}
                  <TabPanel>
                    {/*Выбор типа запроса*/}
                    <div className="w-1/3 flex flex-row items-end gap-2 mb-4">
                      <div className="grow">
                        {" "}
                        <SelectCustom
                          value={undefined}
                          options={undefined}
                          onChange={undefined}
                          label={"Тип запроса"}
                        />{" "}
                      </div>
                      <div className="w-auto">
                        <ButtonPrimary
                          children={undefined}
                          onClick={function (
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          id={undefined}>
                          Применить
                        </ButtonPrimary>
                      </div>
                    </div>

                    {/*Кнопка Дропдаун*/}
                    <div className="mb-4">
                      {" "}
                      <ButtonDropdownRequest
                        title={""}
                        textbutton={""}
                        children={undefined}
                        onClick={function (
                          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ): void {
                          throw new Error("Function not implemented.");
                        }}
                        onClickText={""}
                        onClickClassName={""}
                      />
                    </div>
                  </TabPanel>

                  {/*Вкладка Обследования*/}
                  <TabPanel>
                    {/* Иконка просмотр */}
                    <Link to="/inspection-view" title="Просмотр обследования">
                      <IconButtonWatch className="fill-meta-3 h-6"></IconButtonWatch>
                    </Link>
                  </TabPanel>

                  {/*Вкладка Проверки*/}
                  <TabPanel>
                    {/* Иконка просмотр */}
                    <Link
                      to="/control-check-license"
                      title="Контрольная лицензионная проверка">
                      <IconButtonWatch className="fill-meta-3 h-6"></IconButtonWatch>
                    </Link>
                    <Link
                      to="/license-view"
                      relative="path"
                      className="text-primary underline underline-offset-4 cursor-pointer">
                      {" "}
                      *запись из таблицы*
                    </Link>
                  </TabPanel>

                  {/*Вкладка Административные дела*/}
                  <TabPanel>
                    {" "}
                    <Link to="/case-material" title="Материалы дела">
                      <IconButtonDocument className="fill-meta-3 h-6"></IconButtonDocument>
                    </Link>
                    <Link to="" title="Просмотр докумен">
                      <IconButtonWatch className="fill-meta-3 h-6"></IconButtonWatch>
                    </Link>
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

export default SubjectView;
