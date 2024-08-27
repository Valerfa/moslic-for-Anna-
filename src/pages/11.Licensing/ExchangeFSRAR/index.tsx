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
import DialogModal from "../../../components/UI/General/Modal/DialogModal.tsx";
import States from "./TabContent/States.tsx";
import Places from "./TabContent/Places.tsx";
import History from "./TabContent/History.tsx";
import Unit from "./TabContent/Unit.tsx";
import OutPlaces from "./TabContent/OutPlaces.tsx";
import Units from "./TabContent/Units.tsx";
import ModalEditKPP from "./Modals/ModalEditKPP.tsx";
import ButtonPrimary from "../../../components/UI/General/Buttons/ButtonPrimary.tsx";
import ModalSimilResults2 from "./Modals/ModalSimilResults2.tsx";

let activeDataFilters = {};

const ExchangeFSRAR = ({ token, personlog_id, resources }) => {
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
      <Breadcrumb pageName="Просмотр отчета" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/*Левое верхнее поле*/}
        <div className="col-span-3">
          <CardTable name="Отправки" buttons={<></>} children={undefined}>
            {" "}
          </CardTable>
        </div>

        {/*Правое верхнее поле*/}
        <div className="col-span-9">
          <CardTable
            name="Отправленные сведения"
            buttons={
              <>
                {" "}
                <ButtonPrimary
                  children={undefined}
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  id={undefined}>
                  <ModalSimilResults2
                    name={"Сравнить"}
                    title={"Сравнение результатов"}
                    textbutton={"Сравнить"}
                    icon={undefined}
                    children={undefined}
                    onClick={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void {
                      throw new Error("Function not implemented.");
                    }}
                    onClickClassName={""}></ModalSimilResults2>
                </ButtonPrimary>
              </>
            }
            onFiltersClick={function (
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void {
              throw new Error("Function not implemented.");
            }}
            children={undefined}></CardTable>
        </div>

        {/*Нижнее поле*/}
        <div className="col-span-12">
          <CardTable
            name="Детализация"
            buttons={<></>}
            onFiltersClick={function (
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void {
              throw new Error("Function not implemented.");
            }}
            children={undefined}>
            <div className="m-5.5">
              <TabGroup className="">
                <TabList>
                  <div className="flex flex-row gap-4">
                    <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                      Места
                    </Tab>
                    <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                      Состояния
                    </Tab>
                    <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                      История
                    </Tab>
                    <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                      Подразделения
                    </Tab>
                    <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary">
                      Выездные места
                    </Tab>
                  </div>
                </TabList>

                <TabPanels className="py-5.5">
                  <TabPanel>
                    {/*Места*/}
                    <Places />
                  </TabPanel>
                  <TabPanel>
                    {/*Состояния*/}
                    <States />
                  </TabPanel>
                  <TabPanel>
                    {/*История*/}
                    <History />
                  </TabPanel>
                  <TabPanel>
                    {/*Подразделения*/}
                    <Units />
                  </TabPanel>
                  <TabPanel>
                    {/*Выездные места*/}
                    <OutPlaces />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default ExchangeFSRAR;
