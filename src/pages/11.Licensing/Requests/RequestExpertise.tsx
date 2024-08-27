import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { variables, AG_GRID_LOCALE_RU, showDate } from "../../../variables.tsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

//Осн. элементы нтерфейса
import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";
import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

//Модальные (диалоговые) окна
import DefaultIconModal from "../../../components/UI/General/Modal/DefaultIconModal.tsx";
import DefaultIconModalWide from "../../../components/UI/General/Modal/DefaultIconModalWide.tsx";
import ModalOperationProcess from "../../../dialogs/RequestEdit/ModalOperationProcess.tsx";
import ModalPaymentList from "../../../dialogs/RequestEdit/ModalPaymentList.tsx";
import ModalSubjectAdd from "../../7.Subjects/UI/ModalObjectAdd.tsx";

//Кнопки
import ButtonDropdown3 from "../../../components/UI/General/Buttons/ButtonDropdown3.tsx";
import ButtonPrimary from "../../../components/UI/General/Buttons/ButtonPrimary.tsx";
import ButtonsSecondary from "../../../components/UI/General/Buttons/ButtonsSecondary.tsx";
import ButtonDropdownRequest from "../../../dialogs/RequestEdit/ButtonDropdownRequest.tsx";

//Инпуты
import CheckboxDefault from "../../../components/UI/General/Inputs/CheckboxDefault.tsx";
import CheckboxQuarter from "../../../components/UI/General/Inputs/CheckBoxQuarter.tsx";
import DateDefaultInput from "../../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../../components/UI/General/Inputs/NumberInput.tsx";
import SelectCustom from "../../../components/UI/General/Inputs/Select.tsx";
import TextAreaInput from "../../../components/UI/General/Inputs/TextAreaInput.tsx";

//Иконки
import IconButtonCopy from "../../../components/UI/General/Buttons/IconButtonCopy.tsx";
import IconButtonDownload from "../../../components/UI/General/Buttons/IconButtonDownload.tsx";
import IconButtonEdit from "../../../components/UI/General/Buttons/IconButtonEdit.tsx";
import IconButtonList from "../../../components/UI/General/Buttons/IconButtonList.tsx";
import IconButtonWarning from "../../../components/UI/General/Buttons/IconButtonWarning.tsx";
import IconButtonWatch from "../../../components/UI/General/Buttons/IconButtonWatch.tsx";
import IconButtonX from "../../../components/UI/General/Buttons/IconButtonX.tsx";
import IconButtonStop from "../../../components/UI/General/Buttons/IconButtonStop.tsx";
import Gerb from "../../../images/icon/gerb.svg";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../../utils/gridUtils.tsx";
import ModalIconObjectEdit from "../../../dialogs/SubjectView/ModalIconObjectEdit.tsx";
import TextInput from "../../../components/UI/General/Inputs/TextInput.tsx";
import IconButtonLetter from "../../../components/UI/General/Buttons/IconButtonLetter.tsx";
import DefaultModal from "../../../components/UI/General/Modal/DefaultModal.tsx";
import DefaultModalNarrow from "../../../components/UI/General/Modal/DefaultModalNarrow.tsx";
import ModalIconEditDocument from "./UI/ModalIconEditDocument.tsx";

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

const EditRequest = () => {
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

  function setTitle(e: any) {
    throw new Error("Function not implemented.");
  }

  function setFormDateDoc(date: any) {
    throw new Error("Function not implemented.");
  }

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
      <Breadcrumb pageName="Экспертиза заявки" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Экспертиза заявки"
            buttons={
              <>
                <IconButtonDownload
                  onClick={() => Download()}
                  title={"Выгрузить в Excel"}
                />
              </>
            }>
            <>
              <div className="m-5.5 p-4 flex flex-col gap-5.5 w-full md:w-2/3 xl:w-1/2 border-stroke rounded-lg">
                {/*Вид заявки*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    Вид заявки:
                  </label>
                  <div className="relative w-3/4">
                    <label
                      className="mb-2 block text-sm text-black font-medium dark:text-white"
                      htmlFor="emailAddress">
                      Выдача лицензии
                    </label>
                    <SelectCustom></SelectCustom>
                    <div className="border border-stroke rounded-md p-4 mt-2">
                      *таблица*
                    </div>
                  </div>
                </div>
                {/*Дата заявки*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    Дата заявки:
                  </label>
                  <div className="relative w-3/4 flex flex-row">
                    <div className="w-1/2 mb-2 block text-sm text-black font-medium dark:text-white">
                      [Дата]
                    </div>
                    <div className="text-right w-1/2 mb-2 block text-sm text-black font-medium dark:text-white">
                      <span className="">Крайняя дата исполнения:</span>{" "}
                      <span className="">[Дата]</span>
                    </div>
                  </div>
                </div>
                {/*Номер регистрации*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    Номер регистрации:
                  </label>
                  <div className="relative w-3/4 flex flex-row gap-4">
                    <div className="w-1/4 text-black text-sm">[Номер]</div>
                    <div className="w-1/4">
                      {" "}
                      <label
                        className="mb-2 block text-sm text-black font-medium dark:text-white"
                        htmlFor="emailAddress">
                        Форма подачи
                      </label>
                      <TextInput></TextInput>
                    </div>

                    <div className="relative w-1/2">
                      <label
                        className="mb-2 block text-sm text-black font-medium dark:text-white"
                        htmlFor="emailAddress">
                        ЕНО
                      </label>
                      <NumberInput></NumberInput>
                    </div>
                  </div>
                </div>
                {/*Ответственный*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    Ответственный:
                  </label>
                  <div className="relative w-3/4 flex block text-sm text-black ">
                    [Данные]
                  </div>
                </div>
                {/*Вид деятельности*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    Вид деятельности:
                  </label>
                  <div className="relative w-3/4 block text-sm text-black">
                    [Данные]
                  </div>
                </div>
                {/*Срок*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    Срок:
                  </label>
                  <div className="relative w-3/4 flex flex-row gap-4">
                    <div className="w-1/2 flex flex-row gap-4">
                      <div className="w-1/2">
                        <label
                          className="mb-2 block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Лет
                        </label>
                        <NumberInput />
                      </div>
                      <div className="w-1/2">
                        <label
                          className="mb-2 block text-sm text-black font-medium dark:text-white"
                          htmlFor="emailAddress">
                          Месяцев
                        </label>
                        <NumberInput />
                      </div>
                    </div>
                    <div className="relative w-1/2 self-end flex flex-row">
                      <div className="grow">
                        <label
                          className="mb-2 block text-sm text-black font-medium dark:text-white flex flex-row"
                          htmlFor="emailAddress">
                          Начиная с:
                        </label>
                        <DateDefaultInput></DateDefaultInput>
                      </div>
                    </div>
                  </div>
                </div>
                {/*На основе лицензии*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <div className="w-1/4 flex flex-row items-center">
                    {" "}
                    <CheckboxQuarter />{" "}
                    <label className="mb-2 block text-md font-medium dark:text-white">
                      На основе лицензии:
                    </label>
                  </div>
                  <div className="relative w-3/4 flex block text-sm text-primary">
                    <Link to="/licensing/caution-remains/license-view">
                      [Данные]
                    </Link>
                  </div>
                </div>
                {/*Лицензиат*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="w-1/4 mb-2 block text-md font-medium dark:text-white"
                    htmlFor="emailAddress">
                    Лицензиат:
                  </label>
                  <div className="relative w-3/4 flex gap-4 block text-sm text-primary">
                    <div className="grow">
                      {" "}
                      <Link to="/subject-view">[Данные]</Link>{" "}
                    </div>
                    <div className="flex-none">
                      <IconButtonLetter />
                    </div>
                  </div>
                </div>
                {/*ИНН*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    ИНН:
                  </label>
                  <div className="relative w-3/4 flex block text-sm text-black ">
                    [Данные]
                  </div>
                </div>
                {/*КПП*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    КПП:
                  </label>
                  <div className="relative w-3/4 flex block text-sm text-black ">
                    [Данные]
                  </div>
                </div>
                {/*Виды продукции*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label className="w-1/4 mb-2 block text-md font-medium dark:text-white">
                    Виды продукции:
                  </label>
                  <div className="relative w-3/4 flex justify-items-center gap-4 block text-sm text-primary">
                    <div className="grow">
                      {" "}
                      <TextInput />
                    </div>
                    <div className="flex-none self-center">
                      <IconButtonLetter />
                    </div>
                  </div>
                </div>
                {/*Ограничения*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label className="w-1/4 mb-2 block text-md font-medium dark:text-white">
                    Ограничения:
                  </label>
                  <div className="relative w-3/4 flex justify-items-center gap-4 block text-sm text-primary">
                    <div className="grow">
                      {" "}
                      <TextAreaInput />
                    </div>
                    <div className="flex-none self-center">
                      <IconButtonEdit />
                    </div>
                  </div>
                </div>
                {/*Состояние*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label className="w-1/4 mb-2 block text-md font-medium dark:text-white">
                    Состояние:
                  </label>
                  <div className="relative w-3/4 block text-sm text-primary">
                    {" "}
                    <TextAreaInput />
                  </div>
                </div>
                {/*Комментарий*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="mb-2 block text-md font-medium dark:text-white w-1/4"
                    htmlFor="emailAddress">
                    Комментарий:
                  </label>
                  <div className="relative w-3/4">
                    <TextAreaInput />
                  </div>
                </div>
                {/*
                  Дата приема/передачи:*/}
                <div className="flex flex-row gap-4">
                  {" "}
                  <label
                    className="w-1/4 mb-2 block text-md font-medium dark:text-white"
                    htmlFor="emailAddress">
                    Дата приема/передачи:
                  </label>
                  <div className="relative w-3/4">
                    <div className="flex gap-4 block text-sm text-black">
                      <div className="grow flex flex-row gap-2">
                        {" "}
                        <span className="">Передано в архив:</span>
                        <span className="">[Дата]</span>
                      </div>
                      <div className="flex-none">
                        <IconButtonCopy />
                      </div>
                      <div className="flex-none">
                        <IconButtonEdit />
                      </div>
                    </div>
                    <div className="flex gap-4 block text-sm text-black">
                      <div className="grow flex flex-row gap-2">
                        {" "}
                        <span className="">Передано в ГПУ:</span>
                        <span className="">[Дата]</span>
                      </div>
                      <div className="flex-none">
                        <IconButtonEdit />
                      </div>
                    </div>
                    <div className="flex gap-4 block text-sm text-black">
                      <div className="grow flex flex-row gap-2">
                        {" "}
                        <span className="">Возвращено из ГПУ:</span>
                        <span className="">[Дата]</span>
                      </div>
                      <div className="flex-none">
                        <IconButtonEdit />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 m-5.5">
                <ButtonsSecondary
                  children={"Сохранить"}
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  id={undefined}
                />
              </div>
              {/*Табы*/}
              <TabGroup>
                <TabList className="p-5.5 flex flex-wrap gap-3 border-t border-stroke pb-5 dark:border-strokedark">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-wrap gap-3">
                      <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Объекты
                      </Tab>
                      <Tab className=" rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Обследования
                      </Tab>
                      <Tab className=" rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Документы
                      </Tab>
                      <Tab className=" rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Решения
                      </Tab>
                      <Tab className=" rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Операции
                      </Tab>
                      <Tab className=" rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Статусы
                      </Tab>
                      <Tab className=" rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                        Межведомственные запросы
                      </Tab>
                    </div>
                  </div>
                </TabList>
                <TabPanels className="leading-relaxed block p-5.5">
                  <TabPanel>
                    <>
                      <IconButtonEdit />
                      <IconButtonCopy />
                    </>
                  </TabPanel>
                  <TabPanel>
                    {/*Модальное окно*/}

                    <ButtonPrimary>
                      <DefaultModal
                        name={""}
                        title={"Добавление выездной оценки"}
                        textbutton={"Добавить"}
                        icon={undefined}
                        children={
                          <>
                            <CheckboxQuarter />
                          </>
                        }
                        onClick={function (
                          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ): void {
                          throw new Error("Function not implemented.");
                        }}
                        onClickText={"Сохранить"}
                        onClickClassName={""}
                      />{" "}
                    </ButtonPrimary>
                    <IconButtonX />
                    <Link to="/inspection-view-2">
                      <IconButtonWatch />
                    </Link>
                  </TabPanel>
                  <TabPanel>
                    <>
                      {/*  Модальное окно "Добавление документа"  */}
                      <ButtonPrimary>
                        <DefaultModalNarrow
                          title={"Добавление документа"}
                          textbutton={"Добавить документ"}
                          children={
                            <>
                              <form className="grid grid-cols-2 gap-4">
                                <div className="">
                                  {" "}
                                  <SelectCustom
                                    value={undefined}
                                    options={undefined}
                                    onChange={undefined}
                                    label={"Тип документа"}
                                  />
                                </div>
                                <div className="">
                                  {" "}
                                  <DateDefaultInput
                                    label={"Дата документа"}
                                    onChange={undefined}
                                    selected={""}
                                  />
                                </div>
                                <div className="col-span-2">
                                  {" "}
                                  <NumberInput
                                    label={"Номер документа"}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    value={""}
                                    onChange={function (
                                      event: React.MouseEvent<
                                        HTMLButtonElement,
                                        MouseEvent
                                      >
                                    ): void {
                                      throw new Error(
                                        "Function not implemented."
                                      );
                                    }}
                                  />
                                </div>
                                <div className="col-span-2">
                                  {" "}
                                  <TextAreaInput
                                    label={"Комментарий"}
                                    type={""}
                                    value={""}
                                    name={""}
                                    id={""}
                                    placeholder={""}
                                    defaultvalue={""}
                                    disable={false}
                                  />
                                  <div className="flex flex-row gap-4">
                                    {" "}
                                    <CheckboxDefault
                                      label={"Оригинал"}
                                      name={""}
                                      id={""}
                                      value={false}
                                      onChange={undefined}
                                    />
                                    <CheckboxDefault
                                      label={"Копия/эл.образ"}
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
                                </div>
                              </form>
                            </>
                          }
                          onClick={function (
                            event: MouseEvent<HTMLButtonElement, MouseEvent>
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          onClickText={"Сохранить"}
                          onClickClassName={""}
                        />
                      </ButtonPrimary>
                      {/*  Модальное окно "Операция над процессом" --------- */}
                      <ModalOperationProcess
                        name={""}
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
                        icon={undefined}
                      />
                      <div className="flex flex-row gap-4">
                        {" "}
                        <CheckboxQuarter
                          label={"Представленные"}
                          name={""}
                          id={""}
                          value={false}
                          onChange={undefined}
                        />
                        <CheckboxQuarter
                          label={"Разработанные"}
                          name={""}
                          id={""}
                          value={false}
                          onChange={undefined}
                        />
                        <CheckboxQuarter
                          label={"Письма и запросы"}
                          name={""}
                          id={""}
                          value={false}
                          onChange={undefined}
                        />
                        <CheckboxQuarter
                          label={"Межвед"}
                          name={""}
                          id={""}
                          value={false}
                          onChange={undefined}
                        />
                        {/* Модальное окно "Список привязанных платежей" */}
                        <ButtonPrimary
                          children={
                            <ModalPaymentList
                              title={"Список привязанных платежей"}
                              textbutton={""}
                              children={undefined}
                              onClick={function (
                                event: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ): void {
                                throw new Error("Function not implemented.");
                              }}
                              onClickText={""}
                              onClickClassName={""}
                            />
                          }
                          onClick={function (
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          id={undefined}></ButtonPrimary>
                        {/* Модальное окно "Просмотр документа" */}
                        <ModalIconEditDocument />
                        {/* ---------- Иконка "Крест" ---------- */}
                        <IconButtonX
                          onClick={function (
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          title={""}
                        />
                        {/* ---------- Выпадающее меню ---------- */}
                        <ButtonDropdown3
                          title={""}
                          textbutton={"Добавить документ"}
                          children={undefined}
                          onClick={function (
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          onClickText={""}
                          onClickClassName={""}
                        />
                        {/* ---------- Иконка "Оригинал документа" ---------- */}
                        <IconButtonList title={"Оригинал документа"} />{" "}
                        {/* ---------- Иконка "Копия документа" ---------- */}
                        <IconButtonCopy title={"Копия документа"} />{" "}
                      </div>
                    </>
                  </TabPanel>
                  <TabPanel>
                    <div className="flex flex-row gap-4">
                      <Link to="/okno/status-request">
                        {" "}
                        <IconButtonList title={"Просмотр статуса заявки"} />
                      </Link>
                      {/* --------- Иконка "А" --------- */}{" "}
                      <div
                        className="text-lg font-bold text-meta-1 cursor-pointer p-1 rounded-md bg-white"
                        title="АСГУФ">
                        А
                      </div>{" "}
                      {/* --------- Вместо иконки "Герб департамента" --------- */}{" "}
                      <img
                        src={Gerb}
                        className="h-5 cursor-pointer"
                        title="МПГУ"
                      />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <ButtonDropdownRequest />
                  </TabPanel>
                  <TabPanel>Статусы</TabPanel>
                  <TabPanel>Межведомственные запросы</TabPanel>
                </TabPanels>
              </TabGroup>
            </>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default EditRequest;
