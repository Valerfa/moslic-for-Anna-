import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { variables, showDate } from "../../variables.tsx";

//Осн. элементы нтерфейса
import Breadcrumb from "../../components/UI/General/Breadcrumb.tsx";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

//Модальные (диалоговые) окна

//Кнопки
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary.tsx";

//Инпуты
import SelectCustom from "../../components/UI/General/Inputs/Select.tsx";
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput.tsx";

//Иконки

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../utils/gridUtils.tsx";
import TextInput from "../../components/UI/General/Inputs/TextInput.tsx";
import ModalIconSubjectAddressAdd from "../../dialogs/RequestCurrentDay/ModalIconSubjectAddressAdd.tsx";

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

const SubjectAdd = () => {
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
      <Breadcrumb pageName="Добавление субъекта" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 flex flex-col gap-5.5">
          <div className="bg-white rounded-md">
            {/* ---------- Общие сведения  ---------- */}
            <div>
              <div className="border-b border-stroke">
                <p className="text-bodydark2 font-medium text-lg py-4 px-5.5">
                  Общие сведения
                </p>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5.5">
                <div className="col-span-6">
                  <TextInput
                    label={"Полное наименование"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
                <div className="col-span-6">
                  <TextInput
                    label={"Краткое наименование"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
                <div className="col-span-6">
                  <SelectCustom
                    value={undefined}
                    options={undefined}
                    onChange={undefined}
                    label={"ОПФ"}></SelectCustom>
                </div>

                <div className="col-span-6">
                  <label
                    className="text-left block text-sm text-black font-medium dark:text-white"
                    htmlFor="emailAddress">
                    Юридический адрес
                  </label>
                  <div className="flex flex-row gap-1">
                    <div className="flex-auto">
                      <TextInput></TextInput>
                    </div>
                    <div className="self-end">
                      {/* ---------- Модальное окно "Добавление адреса объекта" ---------- */}
                      <ModalIconSubjectAddressAdd />
                    </div>
                  </div>
                </div>
                <div className="col-span-6">
                  <label
                    className="text-left block text-sm text-black font-medium dark:text-white"
                    htmlFor="emailAddress">
                    Фактический адрес
                  </label>
                  <div className="flex flex-row gap-1">
                    <div className="flex-auto">
                      <TextInput></TextInput>
                    </div>
                    <div className="self-end">
                      {/* ---------- Модальное окно "Добавление адреса объекта" ---------- */}
                      <ModalIconSubjectAddressAdd />
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <NumberInput
                    label={"ИНН"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}></NumberInput>
                </div>
                <div className="col-span-3">
                  <NumberInput
                    label={"КПП"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}></NumberInput>
                </div>
                <div className="col-span-3">
                  <NumberInput
                    label={"ОГРН"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}></NumberInput>
                </div>
                <div className="col-span-3">
                  <NumberInput
                    label={"ОКПО"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}></NumberInput>
                </div>
                <div className="col-span-3">
                  <NumberInput
                    label={"Уставной капитал"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}></NumberInput>
                </div>
              </div>{" "}
            </div>
            {/* ---------- Контакты компании ---------- */}
            <div>
              <div className="border-b border-stroke">
                <div className="text-bodydark2 font-medium text-xl py-4 px-5.5">
                  Контакты компании
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5.5">
                <div className="col-span-3">
                  <NumberInput
                    label={"Телефон"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}></NumberInput>
                </div>
                <div className="col-span-3">
                  <NumberInput
                    label={"Факс"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}></NumberInput>
                </div>
                <div className="col-span-3">
                  <TextInput
                    label={"E-mail"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
                <div className="col-span-3">
                  <TextInput
                    label={"Web"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
              </div>
            </div>
            {/* ---------- Руководитель ---------- */}
            <div>
              <div className="border-b border-stroke">
                <div className="text-bodydark2 font-medium text-xl py-4 px-5.5">
                  Руководитель
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5.5">
                <div className="col-span-3">
                  <TextInput
                    label={"Должность"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
                <div className="col-span-3">
                  <TextInput
                    label={"Фамилия"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
                <div className="col-span-3">
                  <TextInput
                    label={"Имя"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
                <div className="col-span-3">
                  <TextInput
                    label={"Отчество"}
                    type={""}
                    value={""}
                    name={""}
                    id={""}
                    placeholder={""}
                    defaultvalue={""}
                    onChange={undefined}
                    disable={false}></TextInput>
                </div>
              </div>
            </div>
            {/* ---------- Свидетельство о постановке на налоговый учет ---------- */}
            <div>
              <div className="border-b border-stroke">
                <div className="text-bodydark2 font-medium text-xl py-4 px-5.5">
                  Свидетельство о постановке на налоговый учет
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5.5">
                <div className="col-span-6">
                  <SelectCustom
                    value={undefined}
                    options={undefined}
                    onChange={undefined}
                    label={"Государственная налоговая инспекция"}
                  />
                </div>
                <div className="col-span-2">
                  <DateDefaultInput
                    label={"Дата"}
                    onChange={undefined}
                    selected={""}
                  />
                </div>
              </div>
            </div>
            {/* ---------- Свидетельство о государственной регистрации ---------- */}
            <div>
              <div className="border-b border-stroke">
                <div className="text-bodydark2 font-medium text-xl py-4 px-5.5">
                  Свидетельство о государственной регистрации
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5.5">
                <div className="col-span-6">
                  <SelectCustom
                    value={undefined}
                    options={undefined}
                    onChange={undefined}
                    label={"Регистрирующий орган"}
                  />
                </div>
                <div className="col-span-2">
                  <DateDefaultInput
                    label={"Дата"}
                    onChange={undefined}
                    selected={""}
                  />
                </div>
              </div>
            </div>
            {/* ---------- Свидетельство субъекта малого предпринимательства ---------- */}
            <div>
              <div className="border-b border-stroke">
                <div className="text-bodydark2 font-medium text-xl py-4 px-5.5">
                  Свидетельство субъекта малого предпринимательства
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5.5">
                <div className="col-span-5">
                  <SelectCustom
                    value={undefined}
                    options={undefined}
                    onChange={undefined}
                    label={"Вид СМП"}
                  />
                </div>
                <div className="col-span-5">
                  <SelectCustom
                    value={undefined}
                    options={undefined}
                    onChange={undefined}
                    label={"Регистрирующий орган"}
                  />
                </div>
                <div className="col-span-2">
                  <DateDefaultInput
                    label={"Дата"}
                    onChange={undefined}
                    selected={""}
                  />
                </div>
                <div className="col-span-5">
                  <NumberInput
                    label={"Номер"}
                    name={""}
                    id={""}
                    placeholder={""}
                    value={""}
                    onChange={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <ButtonPrimary
              onClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
              id={undefined}>
              Создать
            </ButtonPrimary>
          </div>

          <></>
        </div>
      </div>
    </>
  );
};

export default SubjectAdd;
