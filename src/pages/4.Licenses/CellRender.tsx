import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";

import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";
import DocumentsInput from "../../components/UI/General/Inputs/DocumentsInput";

//Модальное окно
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../variables";
import ButtonDanger from "../../components/UI/General/Buttons/ButtonDanger";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import CustomPopover from "../../components/UI/General/Inputs/Popover";

import ModalFetch from "./LicenseModal";

registerLocale("ru", ru);

var filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue.replace(" GMT", "");
    if (dateAsString == null) return -1;
    var cellDate = Date.parse(dateAsString);
    if (filterLocalDateAtMidnight.getTime() === cellDate) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

export default function CellRender(params, loadLicenses, lic_inn) {
  const [useColumns, setUseColumns] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [dataColumns] = useState([
      {
        enableValue: true,
        field: "seria",
        headerName: "Серия",
        filter: 'agTextColumnFilter',
        resizable: true,
        rowGroup: false,
        minWidth: 50,
        width: 100
      },
      {
        enableValue: true,
        field: "nomer_lic",
        headerName: "Номер",
        filter: 'agTextColumnFilter',
        resizable: true,
        rowGroup: false,
        minWidth: 50,
        width: 100,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          const link_path = `ArchiveLicense?seria=${params.data.seria}&number=${params.data.nomer_lic}&kod=${params.data.kod}&startdate=${params.data.startdate}&stopdate=${params.data.stopdate}`;
          return <div><a href={link_path} target="_black" style={{'color': 'blue'}}>{params.getValue()}</a></div>;
        },
      },
      {
        enableValue: true,
        field: "kod",
        headerName: "Код",
        filter: 'agTextColumnFilter',
        resizable: true,
        rowGroup: false,
        minWidth: 50,
        width: 100
      },
      {
        enableValue: true,
        field: "startdate",
        headerName: "Начало действия",
        filter: 'agDateColumnFilter',
        filterParams: filterParams,
        resizable: true,
        rowGroup: false,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return <div>{showDate(params.getValue())}</div>;
        },
        minWidth: 50,
        width: 150
      },
      {
        enableValue: true,
        field: "stopdate",
        filter: 'agDateColumnFilter',
        headerName: "Окончание действия",
        filterParams: filterParams,
        resizable: true,
        rowGroup: false,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return <div>{showDate(params.getValue())}</div>;
        },
        minWidth: 50,
        width: 150
      },
      {
        enableValue: true,
        field: "filedb",
        headerName: "Бланк",
        filter: 'agSetColumnFilter',
        resizable: true,
        rowGroup: false,
        minWidth: 50,
        width: 100
      },
  ])

  useEffect(() => {
    if (params.data === null || params.data === undefined)
        return
  }, []);

  const handleLicenses = async (use_columns) => {
    const result = await loadLicenses(useColumns, params.data);
    if (result === null)
        setLicenses([]);
    else
        setLicenses(result)
  }

  const setUseColumnsMany = (value) => {
    if (useColumns.includes(value)) {
      const new_data = [];
      for (let kind of useColumns) {
        if (kind !== value) {
          new_data.push(kind);
        }
      }
      handleLicenses(new_data);
      setUseColumns(new_data);
    } else {
      const new_data = useColumns.map((kind) => {
        return kind;
      });
      new_data.push(value);
      handleLicenses(new_data);
      setUseColumns(new_data);
    }
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

  if (params.data === null || params.data === undefined)
    return <div></div>;
  return (
    <ModalFetch
        title={'Список лицензий'}
        onClickText={params.data.lcn_name}
        onClick={() => handleLicenses(useColumns)}
        children={
            <>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Наименование: {params.data.lcn_name === null ? 'отсутствует': params.data.lcn_name}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('lcn_name')}
                        onChange={() => setUseColumnsMany('lcn_name')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Юридический адрес: {params.data.lcn_uaddr === null ? 'отсутствует': params.data.lcn_uaddr}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('lcn_uaddr')}
                        onChange={() => setUseColumnsMany('lcn_uaddr')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Регион: {params.data.admarea === null ? 'отсутствует': params.data.admarea}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('admarea')}
                        onChange={() => setUseColumnsMany('admarea')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Фактический адрес: {params.data.lcn_faddr === null ? 'отсутствует': params.data.lcn_faddr}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('lcn_faddr')}
                        onChange={() => setUseColumnsMany('lcn_faddr')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Гос. регистрация: {params.data.lcn_reg_num === null ? 'отсутствует': params.data.lcn_reg_num}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('lcn_reg_num')}
                        onChange={() => setUseColumnsMany('lcn_reg_num')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      ОКПО: {params.data.lcn_okpo === null ? 'отсутствует': params.data.lcn_okpo}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('lcn_okpo')}
                        onChange={() => setUseColumnsMany('lcn_okpo')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Орган регистрации: {params.data.lcn_reg_name === null ? 'отсутствует': params.data.lcn_reg_name}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('lcn_reg_name')}
                        onChange={() => setUseColumnsMany('lcn_reg_name')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Налоговая инспекция: -
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('')}
                        onChange={() => setUseColumnsMany('')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Телефон: {params.data.contacts === null ? 'отсутствует': params.data.contacts}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('contacts')}
                        onChange={() => setUseColumnsMany('contacts')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Руководитель: {params.data.chief === null ? 'отсутствует': params.data.chief}
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={useColumns.includes('chief')}
                        onChange={() => setUseColumnsMany('chief')}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                <div style={{ height: "100%", width: "100%" }}>
                  <div
                    className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{ height: 600, width: "100%" }}
                  >
                    <AgGridReact
                      rowData={licenses}
                      columnDefs={dataColumns}
                      defaultColDef={defaultColDef}
                      autoGroupColumnDef={autoGroupColumnDef}
                      localeText={AG_GRID_LOCALE_RU}
                      pagination={true}
                      paginationPageSize={100}
                      cacheBlockSize={100}
                      autosize={true}
                      rowSelection={"single"}
                      sideBar={{
                        toolPanels: [
                          {
                            id: "columns",
                            labelDefault: "Columns",
                            labelKey: "columns",
                            iconKey: "columns",
                            toolPanel: "agColumnsToolPanel",
                            minWidth: 225,
                            width: 225,
                            maxWidth: 225,
                            toolPanelParams: {
                                suppressValues: true,
                                suppressPivots: true,
                                suppressPivotMode: true,
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
                </div>
            </>
        }
    ></ModalFetch>
  )
}
