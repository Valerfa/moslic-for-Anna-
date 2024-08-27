import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// Контент - По типам
import Types from "./TabContent/Types/index.tsx";
// Контент - Доп. описи
import ExtraInventory from "./TabContent/ExtraInventory/index.tsx";
// Контент - На выдаче
import OnExport from "./TabContent/OnExport/index.tsx";
// Контент - Предварительные заявки
import PreRequests from "./TabContent/PreRequests/index.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";
import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import { showDate, variables } from "../../../variables.tsx";

import {
  getJsonData,
  getFiltersLists,
  getFullJsonData,
  disableFiltersList,
} from "../../../utils/gridUtils.tsx";

import axios from "axios";
import { Link } from "react-router-dom";
import IconButtonEdit from "../../../components/UI/General/Buttons/IconButtonEdit.tsx";
import IconButtonX from "../../../components/UI/General/Buttons/IconButtonX.tsx";
import IconButtonStop from "../../../components/UI/General/Buttons/IconButtonStop.tsx";
import DefaultIconModal from "../../../components/UI/General/Modal/DefaultIconModal.tsx";
import CheckboxQuarter from "../../../components/UI/General/Inputs/CheckBoxQuarter.tsx";
import DefaultIconModalWide from "../../../components/UI/General/Modal/DefaultIconModalWide.tsx";

let activeDataFiltersTypes = {};
let activeDataFiltersExtraInventory = {};
let activeDataFiltersOnExport = {};
let activeDataFiltersPrePequests = {};

const Gosuslugi = ({ token, personlog_id, resources }) => {
  const gridRefTypes = useRef<AgGridReact>(null);
  const gridRefExtraInventory = useRef<AgGridReact>(null);
  const gridRefOnExport = useRef<AgGridReact>(null);
  const gridRefPrePequests = useRef<AgGridReact>(null);

  const [selectedTabIndex, onSetSelectedTabIndex] = useState(0);

  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  // Filters
  const current_date = new Date();
  const [useDate1, setUseDate1] = useState(true);
  const [date1, setDate1] = useState(current_date);
  const [types, setTypes] = useState([1, 3, 5, 7]);

  const [useDate2, setUseDate2] = useState(true);
  const [date2, setDate2] = useState(current_date);

  const [useDate3, setUseDate3] = useState(true);
  const [date3, setDate3] = useState(current_date);

  const [useDate4, setUseDate4] = useState(true);
  const [date4, setDate4] = useState(current_date);
  const [showAll, setShowAll] = useState(true);

  const [DataColumnsTypes] = useState([
    {
      enableValue: true,
      field: "arcrequestnum",
      headerName: "Номер дела",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "processtypename",
      filterField: "id_processrequesttype",
      headerName: "Тип заявки",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("options", "RequestType", token);
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
      field: "fullsubjectname",
      headerName: "Заявитель",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "inn",
      headerName: "ИНН",
      resizable: true,
      sortable: true,
      realFilterType: "text",
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "servicenumber1",
      headerName: "Форма подачи",
      filterField: "servicenumber",
      filterUpdate: true,
      filterValue: (value) => {
        if (value === null) return null;
        if (value === "Э")
          return { filterType: "text", type: "startWith", filter: "0001" };
        else
          return { filterType: "text", type: "notStartsWith", filter: "0001" };
      },
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (
          params.data.servicenumber === null ||
          params.data.servicenumber === undefined
        )
          return <div></div>;
        if (params.data.servicenumber.slice(0, 4) === "0001") return "Э";
        return "Б";
      },
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("dicts", "TypesDocs", token);
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
      field: "requestnum",
      headerName: "Номер заявки",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "startdate",
      headerName: "Требуемое начало лицензии",
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
      field: "duration",
      headerName: "Требуемая продолжительность",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{Number(params.getValue()) / 12}</div>;
      },
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
        numberParser: (text_value) => {
          if (
            text_value === null ||
            text_value === undefined ||
            text_value === ""
          )
            return null;
          return Number(text_value) * 12;
        },
      },
    },
    {
      enableValue: true,
      field: "processdatetime",
      headerName: "Дата регистрации",
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
      field: "decisiondate",
      headerName: "Дата принятия",
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
      headerName: "Дата выдачи",
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
      field: "processresulttypename",
      filterField: "id_processresulttype",
      headerName: "Текущее состояние",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists(
            "options",
            "RequestResultType",
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
      field: "putdate",
      headerName: "Дата перехода в текущее состояние",
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
      field: "numberinreestr",
      headerName: "Номер ФСРАР",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "licensenumber",
      headerName: "Номер лицензии",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "licenseseria",
      headerName: "Серия лицензии",
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
          return params.value.name;
        },
        valueFormatter: (params) => {
          return params.value.name;
        },
      },
    },
    {
      enableValue: true,
      field: "lic_start",
      headerName: "Начало действия",
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
      headerName: "Окончание действия",
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
      field: "declaredsum",
      headerName: "Сумма",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "confirmeddsum",
      headerName: "Подтверждено",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "visitnum",
      headerName: "Номер обращения",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "servicenumber",
      headerName: "ЕНО",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
  ]);

  const [DataColumnsExtraInventory] = useState([
    {
      enableValue: true,
      field: "arcrequestnum",
      headerName: "Номер дела",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "processtypename",
      filterField: "id_processrequesttype",
      headerName: "Тип заявки",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("options", "RequestType", token);
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
      field: "fullsubjectname",
      headerName: "Лицензиат",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "requestnum",
      headerName: "Номер заявки",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "startdate",
      headerName: "Требуемое начало лицензии",
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
      field: "duration",
      headerName: "Требуемая продолжительность",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{Number(params.getValue()) / 12}</div>;
      },
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
        numberParser: (text_value) => {
          if (
            text_value === null ||
            text_value === undefined ||
            text_value === ""
          )
            return null;
          return Number(text_value) * 12;
        },
      },
    },
    {
      enableValue: true,
      field: "processdatetime",
      headerName: "Дата регистрации",
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
      field: "decisiondate",
      headerName: "Дата принятия",
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
      headerName: "Дата выдачи",
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
      field: "processresulttypename",
      filterField: "id_processresulttype",
      headerName: "Текущее состояние",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists(
            "options",
            "RequestResultType",
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
      field: "putdate",
      headerName: "Дата перехода в текущее состояние",
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
      field: "numberinreestr",
      headerName: "Номер ФСРАР",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "licensenumber",
      headerName: "Номер лицензии",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "licenseseria",
      headerName: "Серия лицензии",
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
          return params.value.name;
        },
        valueFormatter: (params) => {
          return params.value.name;
        },
      },
    },
    {
      enableValue: true,
      field: "lic_start",
      headerName: "Начало действия",
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
      headerName: "Окончание действия",
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
      field: "declaredsum",
      headerName: "К оплате",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "confirmeddsum",
      headerName: "Оплачено",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "visitnum",
      headerName: "Номер обращения",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "servicenumber",
      headerName: "ЕНО",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
  ]);

  const [DataColumnsOnExport] = useState([
    {
      enableValue: true,
      field: "arcrequestnum",
      headerName: "Номер дела",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      enableValue: true,
      field: "servicenumber1",
      headerName: "Форма подачи",
      filterField: "servicenumber",
      filterUpdate: true,
      filterValue: (value) => {
        if (value === null) return null;
        if (value === "Э")
          return { filterType: "text", type: "startWith", filter: "0001" };
        else
          return { filterType: "text", type: "notStartsWith", filter: "0001" };
      },
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (
          params.data.servicenumber === null ||
          params.data.servicenumber === undefined
        )
          return <div></div>;
        if (params.data.servicenumber.slice(0, 4) === "0001") return "Э";
        return "Б";
      },
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("dicts", "TypesDocs", token);
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
      field: "requesttype",
      filterField: "id_processrequesttype",
      headerName: "Тип заявки",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("options", "RequestType", token);
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
      field: "fullsubjectname",
      headerName: "Лицензиат",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "requestnum",
      headerName: "Номер заявки",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
      },
    },
    {
      enableValue: true,
      field: "startdate",
      headerName: "Требуемое начало лицензии",
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
      field: "duration",
      headerName: "Требуемая продолжительность",
      resizable: true,
      sortable: true,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{Number(params.getValue()) / 12}</div>;
      },
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
        numberParser: (text_value) => {
          if (
            text_value === null ||
            text_value === undefined ||
            text_value === ""
          )
            return null;
          return Number(text_value) * 12;
        },
      },
    },
    {
      enableValue: true,
      field: "processdatetime",
      headerName: "Дата регистрации",
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
      field: "decisiondate",
      headerName: "Дата принятия",
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
      headerName: "Дата выдачи",
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
      field: "processresulttypename",
      filterField: "id_processresulttype",
      headerName: "Текущее состояние",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists(
            "options",
            "RequestResultType",
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
      field: "putdate",
      headerName: "Дата перехода в текущее состояние",
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
      field: "numberinreestr",
      headerName: "Номер ФСРАР",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "lic_start",
      headerName: "Начало действия",
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
      headerName: "Окончание действия",
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
      field: "servicenumber",
      headerName: "ЕНО",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
  ]);

  const [DataColumnsPrePequests] = useState([
    {
      enableValue: true,
      field: "prerequeststatename",
      headerName: "Статус",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "regnum",
      headerName: "Номер Ас ГУФ",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "regnumber",
      headerName: "ЕНО",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "createdate",
      headerName: "Дата и время поступления",
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
      field: "requesttype",
      filterField: "id_processresulttype",
      headerName: "Тип заявки",
      resizable: true,
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: async (params) => {
          const values = await getFiltersLists("options", "RequestType", token);
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
      field: "fullname",
      headerName: "Заявитель",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "inn",
      headerName: "ИНН",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "addressur",
      headerName: "Юр. адрес",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "addressobj",
      headerName: "Адрес объектов",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      enableValue: true,
      field: "duration",
      headerName: "Длительность",
      resizable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        allowedCharPattern: "\\d",
        numberParser: (text_value) => {
          if (
            text_value === null ||
            text_value === undefined ||
            text_value === ""
          )
            return null;
          return Number(text_value) * 12;
        },
      },
    },
    {
      enableValue: true,
      field: "requestdate",
      headerName: "Дата заявки",
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
      field: "requestnum",
      headerName: "Номер заявки",
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
  ]);

  const getCurrentGridRef = () => {
    var currentGridRef = null;
    var currentDataColumns = null;
    var currentActiveFilters = null;
    var currentPage = null;

    switch (selectedTabIndex + 1) {
      case 1:
        currentGridRef = gridRefTypes;
        currentDataColumns = DataColumnsTypes;
        currentActiveFilters = activeDataFiltersTypes;
        currentPage = "types";
        break;
      case 2:
        currentGridRef = gridRefExtraInventory;
        currentDataColumns = DataColumnsExtraInventory;
        currentActiveFilters = activeDataFiltersExtraInventory;
        currentPage = "dopopis";
        break;
      case 3:
        currentGridRef = gridRefOnExport;
        currentDataColumns = DataColumnsOnExport;
        currentActiveFilters = activeDataFiltersOnExport;
        currentPage = "on_issue";
        break;
      case 4:
        currentGridRef = gridRefPrePequests;
        currentDataColumns = DataColumnsPrePequests;
        currentActiveFilters = activeDataFiltersPrePequests;
        currentPage = "prerequests";
        break;
    }
    return [
      currentGridRef,
      currentDataColumns,
      currentActiveFilters,
      currentPage,
    ];
  };

  useEffect(() => {
    const currentTableParams = getCurrentGridRef();
    if (currentTableParams[0] && "current" in currentTableParams[0]) {
      disableFilters(currentTableParams[1], currentTableParams[0]);
    }
  }, [count]);

  const disableFilters = async (DataColumns, gridRef) => {
    await disableFiltersList(DataColumns, gridRef);
  };

  const getFiltersData = async (DataColumns, gridRef) => {
    const filters = await getJsonData(DataColumns, gridRef);
    switch (selectedTabIndex + 1) {
      case 1:
        return {
          ...filters,
          sOnDate: useDate1 && date1 ? date1.toISOString().split("T")[0] : null,
          sTypes: types.toString(),
        };
      case 2:
        return {
          ...filters,
          sOnDate: useDate2 && date2 ? date2.toISOString().split("T")[0] : null,
        };
      case 3:
        return {
          ...filters,
        };
      case 4:
        return {
          ...filters,
          ShowAll: Number(showAll),
          sOnDate: useDate4 && date4 ? date4.toISOString().split("T")[0] : null,
        };
    }
  };

  const setTypesList = (value) => {
    if (value === null) {
      setTypes([]);
      return;
    }
    if (types.includes(value)) {
      const new_data = [];
      for (let kind of types) {
        if (kind !== value) {
          new_data.push(kind);
        }
      }
      setTypes(new_data);
    } else {
      const new_data = types.map((kind) => {
        return kind;
      });
      new_data.push(value);
      setTypes(new_data);
    }
  };

  const onSearchClick = async () => {
    //     if (quarter === null && year === null) return;
    setLoad(true);
    setError(null);
    console.log(selectedTabIndex + 1);
    const currentTableParams = getCurrentGridRef();
    console.log(currentTableParams);
    currentTableParams[2] = await getFiltersData(
      currentTableParams[1],
      currentTableParams[0]
    );
    try {
      const result = await axios.post(
        variables.API_URL +
          `/Api/RequestCurrentDay/count_${currentTableParams[3]}?personlog_id=${personlog_id}`,
        currentTableParams[2],
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      var count = result.data.count;
      setCount(count);
      var datasource = getServerSideDatasource(
        count,
        currentTableParams[2],
        currentTableParams[3]
      );
      currentTableParams[0].current.api.setGridOption(
        "serverSideDatasource",
        datasource
      );
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
    }
  };

  const getServerSideDatasource = (count, activeDataFilters, url) => {
    return {
      getRows: async (params) => {
        setLoad(true);
        setError(null);
        console.log(params);
        try {
          const result = await axios.post(
            variables.API_URL +
              `/Api/RequestCurrentDay/export_${url}?personlog_id=${personlog_id}`,
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

    const currentTableParams = getCurrentGridRef();
    console.log(currentTableParams);

    for (const row of currentTableParams[0].current.api.getColumnState()) {
      if (row.sortIndex !== null) {
        sort_info = row;
        break;
      }
    }
    console.log(sort_info);
    try {
      const result = await axios.post(
        variables.API_URL +
          `/Api/RequestCurrentDay/export_to_excel_${currentTableParams[3]}?personlog_id=${personlog_id}`,
        {
          ...currentTableParams[2],
          sort: sort_info === null ? undefined : sort_info.colId,
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
      link.setAttribute("download", "Заявки.xlsx"); //or any other extension
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
      <Breadcrumb pageName="Заявки текущего дня" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <Link to="/okno/request-edit">
          <IconButtonEdit />
        </Link>
        <IconButtonX
          onClick={function (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
          ): void {
            throw new Error("Function not implemented.");
          }}
          title={"Удалить"}
        />
        {/*Модальное окно "Отказ в приеме документов"*/}
        <DefaultIconModalWide
          name={"Отказ в приеме документов"}
          title={""}
          textbutton={""}
          icon={<IconButtonStop title={"Отказ в приеме"} />}
          children={
            <>
              <div className="font-medium text-left pb-2">Основания</div>
              <div className="flex flex-col gap-2 p-2 rounded-md bg-whiten">
                <div className="flex flex-row items-start">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Запрос и иные документы в электронной форме подписаны с
                    использованием электронной подписи с нарушением требований,
                    установленных НПА РФ
                  </span>
                </div>
                <div className="flex flex-row items-start pt-2 border-t border-stroke">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Заявителем представлен неполный комплект документов,
                    подлежащих обязательному представлению заявителем
                  </span>
                </div>
                <div className="flex flex-row items-start pt-2 border-t border-stroke">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Наличие противоречивых сведений в интерактивном запросе и
                    приложенных к нему документах
                  </span>
                </div>
                <div className="flex flex-row items-start pt-2 border-t border-stroke">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Некорректное заполнение обязательных полей в форме
                    интерактивного запроса
                  </span>
                </div>
                <div className="flex flex-row items-start pt-2 border-t border-stroke">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Обращение за предоставлением государственной услуги лица, не
                    являющегося получателем государственной услуги в
                    соответствии с АР
                  </span>
                </div>
                <div className="flex flex-row items-start pt-2 border-t border-stroke">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Подача запроса от имени заявителя не уполномоченным на то
                    лицом
                  </span>
                </div>
                <div className="flex flex-row items-start pt-2 border-t border-stroke">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Представленные документы утратили силу
                  </span>
                </div>
                <div className="flex flex-row items-start pt-2 border-t border-stroke">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Представленные запрос и иные документы, необходимые для
                    предоставления государственной услуги, не соответствуют
                    требованиям, установленным НПА и АР
                  </span>
                </div>
              </div>
              <div className="font-medium text-left pb-2 pt-4">Документы</div>
              <div className="flex flex-col gap-2 p-2 rounded-md bg-whiten">
                <div className="flex flex-row items-start">
                  <CheckboxQuarter
                    label={""}
                    name={""}
                    id={""}
                    value={false}
                    onChange={undefined}
                  />
                  <span className="text-left text-sm text-black">
                    Уведомление об отказе в приеме документов
                  </span>
                </div>
              </div>
            </>
          }
          onClick={function (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onClickText={"Сохранить"}
          onClickClassName={""}
        />
        <div className="col-span-12">
          <TabGroup
            selectedIndex={selectedTabIndex}
            onChange={onSetSelectedTabIndex}>
            <TabList className="flex justify-between">
              <div className="flex gap-4">
                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  По типам
                </Tab>
                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Доп. описи
                </Tab>
                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  На выдаче
                </Tab>
                <Tab className="rounded-md bg-bodydark1 py-3 px-4 text-sm font-medium text-graydark md:text-base lg:px-6 hover:bg-primary hover:text-white dark:hover:bg-primary focus:outline-none data-[selected]:bg-primary/90 data-[selected]:text-white data-[hover]:bg-primary/30 data-[selected]:data-[hover]:bg-primary/30 data-[focus]:bg-stroke/90 data-[focus]:outline-primary">
                  Пред. заявки
                </Tab>
              </div>
            </TabList>
            <TabPanels className="mt-3">
              <TabPanel>
                {/* <!-- Контент - Типы Start --> */}
                <Types
                  ref={gridRefTypes}
                  download={Download}
                  DataColumns={DataColumnsTypes}
                  onSearchClick={onSearchClick}
                  useFilter={useDate1}
                  useFilterChange={setUseDate1}
                  value={date1}
                  valueChange={setDate1}
                  types={types}
                  setTypes={setTypesList}
                />
                {/* <!-- Контент - Типы End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - Доп. описи Start --> */}
                <ExtraInventory
                  ref={gridRefExtraInventory}
                  download={Download}
                  DataColumns={DataColumnsExtraInventory}
                  onSearchClick={onSearchClick}
                  useFilter={useDate2}
                  useFilterChange={setUseDate2}
                  value={date2}
                  valueChange={setDate2}
                />
                {/* <!-- Контент - Доп. описи End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - На выдаче Start --> */}
                <OnExport
                  ref={gridRefOnExport}
                  download={Download}
                  DataColumns={DataColumnsOnExport}
                  onSearchClick={onSearchClick}
                  useFilter={useDate3}
                  useFilterChange={setUseDate3}
                  value={date3}
                  valueChange={setDate3}
                />
                {/* <!-- Контент - На выдаче End --> */}
              </TabPanel>
              <TabPanel>
                {/* <!-- Контент - Предварительные заявки Start --> */}
                <PreRequests
                  ref={gridRefPrePequests}
                  download={Download}
                  DataColumns={DataColumnsPrePequests}
                  onSearchClick={onSearchClick}
                  useFilter={useDate4}
                  useFilterChange={setUseDate4}
                  value={date4}
                  valueChange={setDate4}
                  showAll={showAll}
                  setShowAll={setShowAll}
                />
                {/* <!-- Контент - Предварительные заявки End --> */}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default Gosuslugi;
