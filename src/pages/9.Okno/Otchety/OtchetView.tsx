import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

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

import DialogModal from "../../../components/UI/General/Modal/DialogModal.tsx";

let activeDataFilters = {};

const ReportView = ({ token, personlog_id, resources }) => {
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
        <div className="col-span-3">
          <CardTable
            name="Параметры отчета"
            buttons={<></>}
            children={undefined}>
            {" "}
            <div className="m-4 pb-4">
              <DialogModal
                title={"Госпошлина за месяц"}
                textbutton={"Сформировать"}
                children={undefined}
              />{" "}
            </div>
          </CardTable>
        </div>
        <div className="col-span-9">
          <CardTable
            name="Госпошлина за месяц"
            buttons={<></>}
            onFiltersClick={function (
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void {
              throw new Error("Function not implemented.");
            }}
            children={<div className="m-4 pb-4">*контент*</div>}></CardTable>
        </div>
      </div>
    </>
  );
};

export default ReportView;
