import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import axios from "axios";

export const variables = {
  DECL_API_URL: "https://api-moslicense.mos.ru/declarations",
  VIO_API_URL: "https://api-moslicense.mos.ru/violators",
  LIC_API_URL: "https://api-moslicense.mos.ru/licenses",
  ADM_API_URL: "https://api-moslicense.mos.ru/admin",
  SUB_API_URL: "https://api-moslicense.mos.ru/subject",
  DOC_API_URL: "https://api-moslicense.mos.ru/documents",

  API_URL: "http://localhost:8000",
  AUTH_TOKEN: "MOSLIC_AUTH_TOKEN",
  YANDEX_CAPTCHA_KEY: "eaJVFVG313FcLCV8iemspT73VhlfjioRIxbU9ZiJ"
};

export function showDate(dateString) {
  if (dateString === null || dateString === undefined) return null;
  let NewDate = new Date(dateString);
  NewDate = format(NewDate, "dd.MM.yyyy", { locale: ru });
  return NewDate;
}

export function showDateTime(dateString) {
  if (dateString === null || dateString === undefined) return null;
  let NewDate = new Date(dateString);
  NewDate = format(NewDate, "dd.MM.yyyy HH:MM:ss", { locale: ru });
  return NewDate;
}

export const mathOperations = [
    {value: '1', name: '='},
    {value: '2', name: '>'},
    {value: '3', name: '>='},
    {value: '4', name: '<'},
    {value: '5', name: '<='},
    {value: '6', name: '!='},
]

export const textOperations = [
    {value: '1', name: '='},
    {value: '2', name: 'Содержится'},
    {value: '3', name: 'Начинается с'},
    {value: '4', name: 'Заканчивается'},
    {value: '5', name: 'Не равно'},
    {value: '6', name: 'Не содержится'},
    {value: '7', name: 'Не начинается с'},
    {value: '8', name: 'Не заканчивается'},
]

var filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue
      .replace(" GMT", "")
      .replace(/\d\d:\d\d:\d\d/, "00:00:00");
    if (dateAsString == null) return -1;
    var cellDate = Date.parse(dateAsString);
    console.log(dateAsString, filterLocalDateAtMidnight);
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

export function getCurrentQuarter() {
  const current_date = new Date();
  switch (current_date.getMonth() + 1) {
    case 1:
    case 2:
    case 3:
      return { value: 4, name: "4 квартал", code: "0" };
    case 4:
    case 5:
    case 6:
      return { value: 1, name: "1 квартал", code: "3" };
    case 7:
    case 8:
    case 9:
      return { value: 2, name: "2 квартал", code: "6" };
    case 10:
    case 11:
    case 12:
      return { value: 3, name: "3 квартал", code: "9" };
    default:
      return null;
  }
}

export function getCurrentYear() {
  const current_date = new Date();
  switch (current_date.getMonth() + 1) {
    case 1:
    case 2:
    case 3:
      return {
        value: current_date.getFullYear() - 1,
        name: String(current_date.getFullYear() - 1),
      };
    default:
      return {
        value: current_date.getFullYear(),
        name: String(current_date.getFullYear()),
      };
  }
}

var filterParamsTwo = {
  comparator: (filterLocalNumber, cellValue) => {
    if (cellValue == null) return -1;
    var value_1 = cellValue[0];
    var value_2 = cellValue[1];
    if (filterLocalNumber === value_1 || filterLocalNumber === value_2) {
      return 0;
    }
    if (value_1 < filterLocalNumber || filterLocalNumber < value_2) {
      return -1;
    }
    if (value_1 > filterLocalNumber || filterLocalNumber < value_2) {
      return 1;
    }
    return 0;
  },
};

const quarters = {
  "3": "1 квартал",
  "6": "2 квартал",
  "9": "3 квартал",
  "0": "4 квартал",
};

const forms = {
  "11": "Форма 7",
  "07": "Форма 7",
  "7": "Форма 7",
  "37": "Форма 7",
  "12": "Форма 8",
  "08": "Форма 8",
  "8": "Форма 8",
  "38": "Форма 8",
};

const kinds = {
  "1": "Первичная",
  "2": "Корректирующая",
};

const decl_filter_use = false;
const filter_use = true;

export const DeclDataColumns = [
  {
    enableValue: true,
    field: "period_code",
    headerName: "Квартал",
    resizable: true,
    sortable: true,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      return quarters[params.getValue()];
    },
    filter: decl_filter_use ? "agSetColumnFilter" : null,
  },
  {
    enableValue: true,
    field: "period_year",
    headerName: "Год",
    filter: decl_filter_use ? "agNumberColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "inn",
    headerName: "ИНН",
    filter: decl_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "type_code",
    headerName: "Вид декларации",
    filter: decl_filter_use ? "agSetColumnFilter" : null,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      return kinds[params.getValue()];
    },
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "is_null",
    headerName: "Нулевая/Ненулевая декларация",
    filter: decl_filter_use ? "agTextColumnFilter" : null,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      if (params.getValue() == 0) return <div> Ненулевая</div>;
      if (params.getValue() == 1) return <div> Нулевая</div>;
    },
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "is_right_stocks",
    headerName: "Остатки",
    filter: decl_filter_use ? "agTextColumnFilter" : null,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      if (params.getValue() == 0)
        return (
          <div title="Нет">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      if (params.getValue() == 1)
        return (
          <div title="Есть">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>{" "}
          </div>
        );
    },
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "form_code",
    headerName: "Номер формы",
    filter: decl_filter_use ? "agTextColumnFilter" : null,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      return forms[params.getValue()];
    },
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "decl_date",
    headerName: "Дата приемки",
    filter: decl_filter_use ? "agDateColumnFilter" : null,
    resizable: true,
    sortable: true,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      return showDate(params.getValue());
    },
    filterParams: filterParams,
  },
];

export const LicDataColumns = [
  {
    enableValue: true,
    field: "FULLSUBJECTNAME",
    headerName: "Наименование и организационно-правовая форма организации",
    filter: filter_use ? "agTextColumnFilter" : null,
    enableRowGroup: filter_use ? true : false,
    minWidth: 100,
    resizable: true,
    sortable: true,
    width: 200,
  },
  {
    enableValue: true,
    field: "INN",
    headerName: "ИНН",
    filter: filter_use ? "agTextColumnFilter" : null,
    enableRowGroup: filter_use ? true : false,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      const link_path = `licenseInfo?inn=${params.getValue()}`;
      return (
        <div>
          <a href={link_path} target="_black" style={{ color: "blue" }}>
            {params.getValue()}
          </a>
        </div>
      );
    },
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "KPPUR",
    headerName: "КПП",
    filter: filter_use ? "agTextColumnFilter" : null,
    enableRowGroup: filter_use ? true : false,
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "OGRN",
    headerName: "ОГРН",
    filter: filter_use ? "agTextColumnFilter" : null,
    enableRowGroup: filter_use ? true : false,
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    headerName: "Адрес",
    children: [
      {
        enableValue: true,
        field: "FULLADDRESS",
        headerName: "Юридический адрес",
        filter: filter_use ? "agTextColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 150,
      },
      {
        enableValue: true,
        field: "FULLADDRESSUR",
        headerName: "Фактический адрес объекта лицензирования",
        filter: filter_use ? "agTextColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 170,
      },
      {
        enableValue: true,
        field: "KINDNAME",
        headerName: "Тип объекта лицензирования",
        filter: filter_use ? "agSetColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 150,
      },
      {
        enableValue: true,
        field: "KPPOBJ",
        headerName: "КПП обособл. подразд.",
        filter: filter_use ? "agTextColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
      },
    ],
  },
  {
    headerName: "Лицензия",
    children: [
      {
        enableValue: true,
        field: "LICENSESERIA",
        headerName: "Серия бланка",
        filter: filter_use ? "agTextColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        enableValue: true,
        field: "LICENSENUMBER",
        headerName: "Номер бланка",
        filter: filter_use ? "agTextColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        enableValue: true,
        field: "NUMBERINREESTR",
        headerName: "Номер лицензии ФСРАР",
        filter: filter_use ? "agTextColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        enableValue: true,
        field: "LICBEGDATE",
        headerName: "Дата начала срока действия лицензии",
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return null;
          return showDate(params.getValue());
        },
        filter: filter_use ? "agDateColumnFilter" : null,
        filterParams: filterParams,
      },
      {
        enableValue: true,
        field: "LICENDDATE",
        headerName: "Дата окончания срока действия лицензии",
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return null;
          return showDate(params.getValue());
        },
        filter: filter_use ? "agDateColumnFilter" : null,
        filterParams: filterParams,
      },
      {
        enableValue: true,
        field: "LICPUTDATE",
        headerName: "Дата выдачи лицензии",
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return null;
          console.log(params.getValue());
          return showDate(params.getValue());
        },
        filter: filter_use ? "agDateColumnFilter" : null,
        filterParams: filterParams,
      },
      {
        enableValue: true,
        field: "LICENSESTATETYPENAME",
        headerName: "Сводка по лицензиям",
        filter: filter_use ? "agSetColumnFilter" : null,
        enableRowGroup: filter_use ? true : false,
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 120,
      },
    ],
  },
];

const vio_filter_use = false;

export const VioLicDataColumns = [
  {
    enableValue: true,
    field: "region_code",
    headerName: "Регион",
    resizable: true,
    sortable: false,
    filter: vio_filter_use ? "agSetColumnFilter" : null,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
  },
  {
    enableValue: true,
    field: "period_ucode",
    headerName: "Период",
    resizable: true,
    sortable: false,
    cellRenderer: (params) => {
      if (params.data === null || params.data === undefined) return <div></div>;
      return (
        <div>
          {quarters[params.data.period_code]} {params.data.period_year} год
        </div>
      );
    },
    filter: filter_use ? "agSetColumnFilter" : null,
  },
  {
    enableValue: true,
    field: "inn",
    headerName: "ИНН",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      const link_path = `licenseInfo?inn=${params.getValue()}`;
      return (
        <div>
          <a href={link_path} target="_black" style={{ color: "blue" }}>
            {params.getValue()}
          </a>
        </div>
      );
    },
  },
  {
    enableValue: true,
    field: "kpp",
    headerName: "КПП",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "ogrn",
    headerName: "ОГРН",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "title",
    headerName: "Полное название",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      const link_path = `licenseInfo?inn=${params.data.inn}`;
      return (
        <div>
          <a href={link_path} target="_black" style={{ color: "blue" }}>
            {params.getValue()}
          </a>
        </div>
      );
    },
  },
  {
    enableValue: true,
    field: "brief_title",
    headerName: "Краткое название",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "ao_nameur",
    headerName: "АО Москвы (юр. адрес)",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "address",
    headerName: "Адрес",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "email",
    headerName: "Электронная почта",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "phone",
    headerName: "Телефон",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "manager",
    headerName: "Руководитель",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "objcount",
    headerName: "Объектов/ действ.",
    valueGetter: (params) => {
      if (params.data.objcount === null || params.data.objcount === undefined)
        return false;
      return [
        params.data.objcount,
        params.data.objcount - params.data.objnotworkedcount,
      ];
    },
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      const link_path = `licenseInfo?inn=${params.data.inn}`;
      return (
        <div>
          <a href={link_path} target="_black" style={{ color: "blue" }}>
            {params.getValue()[0]}
          </a>
          / {params.getValue()[1]}
        </div>
      );
    },
    filter: vio_filter_use ? "agNumberColumnFilter" : null,
    filterParams: filterParamsTwo,
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "egrul_date",
    headerName: "Дата окончания лицензии",
    filter: decl_filter_use ? "agDateColumnFilter" : null,
    resizable: true,
    sortable: false,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      let d = new Date(params.getValue());
      let now = Date.now();
      if (d.getTime() >= now) {
        return (
          <div style={{ color: "green" }}>{showDate(params.getValue())}</div>
        );
      } else {
        return (
          <div style={{ color: "red" }}>{showDate(params.getValue())}</div>
        );
      }
    },
    filterParams: filterParams,
  },
  {
    enableValue: true,
    field: "isexistsadminfile",
    headerName: "Наличие административных дел",
    filter: vio_filter_use ? "agSetColumnFilter" : null,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      if (params.getValue() == 0)
        return (
          <div title="Отсутствуют">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      if (params.getValue() == 1)
        return (
          <div title="Есть">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>{" "}
          </div>
        );
    },
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "iseconomyactivity",
    headerName: "Осуществляют эконом. деятельность?",
    filter: vio_filter_use ? "agSetColumnFilter" : null,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      if (params.getValue() == 0)
        return (
          <div title="Не осуществляют">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>{" "}
          </div>
        );
      if (params.getValue() == 1)
        return (
          <div title="Осуществляют">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
        );
    },
    resizable: true,
    sortable: false,
  },
  //   {
  //     enableValue: true,
  //     field: "",
  //     headerName: "Предостережения",
  //     filter: vio_filter_use ? "agSetColumnFilter" : null,
  //     cellRenderer: (params) => {
  //       if (params.getValue() === null || params.getValue() === undefined)
  //         return <div></div>;
  //       if (params.getValue() == 0)
  //         return (
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             strokeWidth="1.5"
  //             stroke="currentColor"
  //             className="w-6 h-6"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="M6 18 18 6M6 6l12 12"
  //             />
  //           </svg>
  //         );
  //       if (params.getValue() == 1)
  //         return (
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             strokeWidth="1.5"
  //             stroke="currentColor"
  //             className="w-6 h-6"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="m4.5 12.75 6 6 9-13.5"
  //             />
  //           </svg>
  //         );
  //     },
  //     resizable: true,
  //     sortable: true,
  //   },
  {
    enableValue: true,
    field: "violatormask",
    headerName: "Нарушения по ф.7",
    wrapText: true,
    autoHeight: true,
    filter: vio_filter_use ? "agSetColumnFilter" : null,
    valueGetter: (params) => {
      if (params.data.violatormask === null) return null;
      switch (params.data.violatormask % 100) {
        case 0:
          return 0;
        case 2:
          return 1;
        case 1:
          return 2;
        case 10:
          return 3;
        case 11:
          return 4;
        case 12:
          return 5;
      }
      return -1;
    },
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      switch (params.getValue()) {
        case 0:
          return <div title="Нет нарушений">Нет</div>;
        case 1:
          return (
            <div title="Не вовремя">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          );
        case 2:
          return (
            <div title="Не предоставлена">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>{" "}
            </div>
          );
        case 3:
          return (
            <div title="Недостоверные сведения">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>{" "}
            </div>
          );
        case 4:
          return (
            <>
              <div title="Недостоверные сведения">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div title="Не предоставлена">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>{" "}
              </div>
            </>
          );
        case 5:
          return (
            <>
              <div title="Недостоверные сведения">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div title="Не вовремя">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </>
          );
      }
      return <div>Другое</div>;
    },
    resizable: true,
    sortable: false,
  },
  {
    enableValue: true,
    field: "violatormask",
    headerName: "Нарушения по ф.8",
    wrapText: true,
    autoHeight: true,
    filter: vio_filter_use ? "agSetColumnFilter" : null,
    valueGetter: (params) => {
      if (params.data.violatormask === null) return null;
      switch (
        (params.data.violatormask - (params.data.violatormask % 100)) /
        100
      ) {
        case 0:
          return 0;
        case 2:
          return 1;
        case 1:
          return 2;
        case 10:
          return 3;
        case 11:
          return 4;
        case 12:
          return 5;
      }
      return -1;
    },
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      switch (params.getValue()) {
        case 0:
          return <div title="Нет нарушений">Нет</div>;
        case 1:
          return (
            <div title="Не вовремя">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                  clip-rule="evenodd"
                />
              </svg>{" "}
            </div>
          );
        case 2:
          return (
            <div title="Не предоставлена">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>{" "}
            </div>
          );
        case 3:
          return (
            <div title="Недостоверные сведения">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>{" "}
            </div>
          );
        case 4:
          return (
            <>
              <div title="Недостоверные сведения">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div title="Не предоставлена">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>{" "}
              </div>
            </>
          );
        case 5:
          return (
            <>
              <div title="Недостоверные сведения">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>{" "}
              </div>
              <div title="Не вовремя">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>{" "}
              </div>
            </>
          );
      }
      return <div>Другое</div>;
    },
    resizable: true,
    sortable: false,
  },
];

export const DecDataColumns = [
  {
    enableValue: true,
    field: "cnt_of_distinct_quarter",
    headerName: "Кол-во кварталов",
    resizable: true,
    sortable: true,
    filter: vio_filter_use ? "agNumberColumnFilter" : null,
  },
  {
    enableValue: true,
    field: "region_code",
    headerName: "Регион",
    resizable: true,
    sortable: true,
    filter: vio_filter_use ? "agSetColumnFilter" : null,
  },
  {
    enableValue: true,
    field: "inn",
    headerName: "ИНН",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      const link_path = `licenseInfo?inn=${params.data.inn}`;
      return (
        <div>
          <a href={link_path} target="_black" style={{ color: "blue" }}>
            {params.getValue()}
          </a>
        </div>
      );
    },
  },
  {
    enableValue: true,
    field: "kpp",
    headerName: "КПП",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "ogrn",
    headerName: "ОГРН",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "title",
    headerName: "Полное название",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      const link_path = `licenseInfo?inn=${params.data.inn}`;
      return (
        <div>
          <a href={link_path} target="_black" style={{ color: "blue" }}>
            {params.getValue()}
          </a>
        </div>
      );
    },
  },
  {
    enableValue: true,
    field: "brief_title",
    headerName: "Краткое название",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "ao_nameur",
    headerName: "АО Москвы (юр. адрес)",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "address",
    headerName: "Адрес",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "email",
    headerName: "Электронная почта",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "manager",
    headerName: "Руководитель",
    filter: vio_filter_use ? "agTextColumnFilter" : null,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "objcount",
    headerName: "Объектов/ действ.",
    valueGetter: (params) => {
      if (params.data.objcount === null || params.data.objcount === undefined)
        return null;
      return [
        params.data.objcount,
        params.data.objcount - params.data.objnotworkedcount,
      ];
    },
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      return (
        <div>
          {params.getValue()[0]} / {params.getValue()[1]}
        </div>
      );
    },
    filter: vio_filter_use ? "agNumberColumnFilter" : null,
    filterParams: filterParamsTwo,
    resizable: true,
    sortable: true,
  },
  {
    enableValue: true,
    field: "egrul_date",
    headerName: "Дата окончания лицензии",
    filter: decl_filter_use ? "agDateColumnFilter" : null,
    resizable: true,
    sortable: true,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      let d = new Date(params.getValue());
      let now = Date.now();
      if (d.getTime() >= now) {
        return (
          <div style={{ color: "green" }}>{showDate(params.getValue())}</div>
        );
      } else {
        return (
          <div style={{ color: "red" }}>{showDate(params.getValue())}</div>
        );
      }
    },
    filterParams: filterParams,
  },
  {
    enableValue: true,
    field: "iseconomyactivity",
    headerName: "Осуществляют эконом. деятельность?",
    filter: vio_filter_use ? "agSetColumnFilter" : null,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return <div></div>;
      if (params.getValue() == 0)
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        );
      if (params.getValue() == 1)
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        );
    },
    resizable: true,
    sortable: true,
  },
];

export const AG_GRID_LOCALE_RU = {
  // Set Filter
  selectAll: "(Выбрать все)",
  selectAllSearchResults: "(Выбрать все выбранные совпадения)",
  searchOoo: "Поиск...",
  blanks: "(Пустые)",
  noMatches: "Нет сопадений",

  // Number Filter & Text Filter
  filterOoo: "Фильтр...",
  equals: "Равен",
  notEqual: "Не равен",
  blank: "Пусто",
  notBlank: "Не пусто",
  empty: "Выберите один",

  // Number Filter
  lessThan: "Меньше чем",
  greaterThan: "Больше чем",
  lessThanOrEqual: "Меньше чем или равен",
  greaterThanOrEqual: "Больше чем или равен",
  inRange: "В промежутке",
  inRangeStart: "От",
  inRangeEnd: "До",

  // Text Filter
  contains: "Содержится",
  notContains: "Не содержится",
  startsWith: "Начинается с",
  endsWith: "Заканчивается",

  // Date Filter
  dateFormatOoo: "yyyy-mm-dd",
  before: "До",
  after: "После",

  // Filter Conditions
  andCondition: "И",
  orCondition: "Или",

  // Filter Buttons
  applyFilter: "Применить",
  resetFilter: "Отменить",
  clearFilter: "Очистить",
  cancelFilter: "Закрыть",

  // Filter Titles
  textFilter: "Фильтр по тексту",
  numberFilter: "Фильтр по числам",
  dateFilter: "Фильтр по датам",
  setFilter: "Фильтр по набору",

  // Group Column Filter
  groupFilterSelect: "Выберите поле:",

  // Side Bar
  columns: "Столбцы",
  filters: "Фильтры",

  // columns tool panel
  pivotMode: "Режим поворота",
  groups: "Группировка столбцов",
  rowGroupColumnsEmptyMessage: "Перетащите сюда для группировки строк",
  values: "Значения",
  valueColumnsEmptyMessage: "Перетащите сюда для объединения",
  pivots: "Название столбцов",
  pivotColumnsEmptyMessage: "Перетащите сюда для объединения столбцов",

  // Header of the Default Group Column
  group: "Группа столбцов",

  // Row Drag
  rowDragRow: "строка",
  rowDragRows: "строки",

  // Other
  loadingOoo: "Загрузка...",
  loadingError: "ОШИБКА",
  noRowsToShow: "Нет данных для отображения",
  enabled: "Недоступно",

  // Menu
  pinColumn: "Зафиксировать столбец",
  pinLeft: "Переместить вправо",
  pinRight: "Переместить влево",
  noPin: "Не фиксировать",
  valueAggregation: "Совокупность значений",
  noAggregation: "Пусто",
  autosizeThiscolumn: "Автоматическая ширина столбца",
  autosizeAllColumns: "Автоматическая ширина всех столбцов",
  groupBy: "Группировать",
  ungroupBy: "Загрупировать",
  addToValues: "Добавить ${variable} в значения",
  removeFromValues: "Убрать ${variable} из значений",
  addToLabels: "Добавить ${variable} в названия",
  removeFromLabels: "Убрать ${variable} из значений",
  resetColumns: "Заново выбрать столбцы",
  expandAll: "Добавить все",
  collapseAll: "Закрыть все",
  copy: "Копировать",
  ctrlC: "Ctrl+C",
  ctrlX: "Ctrl+X",
  copyWithHeaders: "Копировать с заголовками",
  copyWithGroupHeaders: "Копировать с заголовком группы",
  cut: "Вырезать",
  paste: "Вставить",
  ctrlV: "Ctrl+V",
  export: "Экспортировать",
  csvExport: "CSV Export",
  excelExport: "Excel Export",

  // Enterprise Menu Aggregation and Status Bar
  sum: "Сумма",
  first: "Первый",
  last: "Последний",
  min: "Минимальное",
  max: "Максимальное",
  none: "Пусто",
  count: "Кол-во",
  avg: "Среднее",
  filteredRows: "Фильтрованные",
  selectedRows: "Выбранные",
  totalRows: "Все строк",
  totalAndFilteredRows: "Строки",
  more: "Больше",
  to: "по",
  of: "из",
  page: "Страница",
  pageLastRowUnknown: "?",
  nextPage: "Следующая страницы",
  lastPage: "Последняя страница",
  firstPage: "Первая страницы",
  previousPage: "Предыдущая страница",
  pageSizeSelectorLabel: "Размер страницы:",

  // Pivoting
  pivotColumnGroupTotals: <div className="font-bold">"Всего"</div>,

  // Enterprise Menu (Charts)
  pivotChartAndPivotMode: "Pivot Chart & Pivot Mode",
  pivotChart: "Pivot Chart",
  chartRange: "Chart Range",

  columnChart: "Column",
  groupedColumn: "Grouped",
  stackedColumn: "Stacked",
  normalizedColumn: "100% Stacked",

  barChart: "Bar",
  groupedBar: "Grouped",
  stackedBar: "Stacked",
  normalizedBar: "100% Stacked",

  pieChart: "Pie",
  pie: "Pie",
  doughnut: "Doughnut",

  line: "Line",

  xyChart: "X Y (Scatter)",
  scatter: "Scatter",
  bubble: "Bubble",

  areaChart: "Area",
  area: "Area",
  stackedArea: "Stacked",
  normalizedArea: "100% Stacked",

  histogramChart: "Histogram",
  histogramFrequency: "Frequency",

  combinationChart: "Combination",
  columnLineCombo: "Column & Line",
  AreaColumnCombo: "Area & Column",

  // Charts
  pivotChartTitle: "Pivot Chart",
  rangeChartTitle: "Range Chart",
  settings: "Settings",
  data: "Data",
  format: "Format",
  categories: "Categories",
  defaultCategory: "(None)",
  series: "Series",
  xyValues: "X Y Values",
  paired: "Paired Mode",
  axis: "Axis",
  navigator: "Navigator",
  color: "Color",
  thickness: "Thickness",
  xType: "X Type",
  automatic: "Automatic",
  category: "Category",
  number: "Number",
  time: "Time",
  autoRotate: "Auto Rotate",
  xRotation: "X Rotation",
  yRotation: "Y Rotation",
  ticks: "Ticks",
  width: "Width",
  height: "Height",
  length: "Length",
  padding: "Padding",
  spacing: "Spacing",
  chart: "Chart",
  title: "Title",
  titlePlaceholder: "Chart title - double click to edit",
  background: "Background",
  font: "Font",
  top: "Top",
  right: "Right",
  bottom: "Bottom",
  left: "Left",
  labels: "Labels",
  size: "Size",
  minSize: "Minimum Size",
  maxSize: "Maximum Size",
  legend: "Legend",
  position: "Position",
  markerSize: "Marker Size",
  markerStroke: "Marker Stroke",
  markerPadding: "Marker Padding",
  itemSpacing: "Item Spacing",
  itemPaddingX: "Item Padding X",
  itemPaddingY: "Item Padding Y",
  layoutHorizontalSpacing: "Horizontal Spacing",
  layoutVerticalSpacing: "Vertical Spacing",
  strokeWidth: "Stroke Width",
  lineDash: "Line Dash",
  offset: "Offset",
  offsets: "Offsets",
  tooltips: "Tooltips",
  callout: "Callout",
  markers: "Markers",
  shadow: "Shadow",
  blur: "Blur",
  xOffset: "X Offset",
  yOffset: "Y Offset",
  lineWidth: "Line Width",
  normal: "Normal",
  bold: "Bold",
  italic: "Italic",
  boldItalic: "Bold Italic",
  predefined: "Predefined",
  fillOpacity: "Fill Opacity",
  strokeOpacity: "Line Opacity",
  histogramBinCount: "Bin count",
  columnGroup: "Column",
  barGroup: "Bar",
  pieGroup: "Pie",
  lineGroup: "Line",
  scatterGroup: "X Y (Scatter)",
  areaGroup: "Area",
  histogramGroup: "Histogram",
  combinationGroup: "Combination",
  groupedColumnTooltip: "Grouped",
  stackedColumnTooltip: "Stacked",
  normalizedColumnTooltip: "100% Stacked",
  groupedBarTooltip: "Grouped",
  stackedBarTooltip: "Stacked",
  normalizedBarTooltip: "100% Stacked",
  pieTooltip: "Pie",
  doughnutTooltip: "Doughnut",
  lineTooltip: "Line",
  groupedAreaTooltip: "Area",
  stackedAreaTooltip: "Stacked",
  normalizedAreaTooltip: "100% Stacked",
  scatterTooltip: "Scatter",
  bubbleTooltip: "Bubble",
  histogramTooltip: "Histogram",
  columnLineComboTooltip: "Column & Line",
  areaColumnComboTooltip: "Area & Column",
  customComboTooltip: "Custom Combination",
  noDataToChart: "No data available to be charted.",
  pivotChartRequiresPivotMode: "Pivot Chart requires Pivot Mode enabled.",
  chartSettingsToolbarTooltip: "Menu",
  chartLinkToolbarTooltip: "Linked to Grid",
  chartUnlinkToolbarTooltip: "Unlinked from Grid",
  chartDownloadToolbarTooltip: "Download Chart",
  seriesChartType: "Series Chart Type",
  seriesType: "Series Type",
  secondaryAxis: "Secondary Axis",

  // ARIA
  ariaChecked: "checked",
  ariaColumn: "Column",
  ariaColumnGroup: "Column Group",
  ariaColumnList: "Column List",
  ariaColumnSelectAll: "Toggle Select All Columns",
  ariaDateFilterInput: "Date Filter Input",
  ariaDefaultListName: "List",
  ariaFilterColumnsInput: "Filter Columns Input",
  ariaFilterFromValue: "Filter from value",
  ariaFilterInput: "Filter Input",
  ariaFilterList: "Filter List",
  ariaFilterToValue: "Filter to value",
  ariaFilterValue: "Filter Value",
  ariaFilteringOperator: "Filtering Operator",
  ariaHidden: "hidden",
  ariaIndeterminate: "indeterminate",
  ariaInputEditor: "Input Editor",
  ariaMenuColumn: "Press CTRL ENTER to open column menu.",
  ariaRowDeselect: "Press SPACE to deselect this row",
  ariaRowSelectAll: "Press Space to toggle all rows selection",
  ariaRowToggleSelection: "Press Space to toggle row selection",
  ariaRowSelect: "Press SPACE to select this row",
  ariaSearch: "Search",
  ariaSortableColumn: "Press ENTER to sort",
  ariaToggleVisibility: "Press SPACE to toggle visibility",
  ariaUnchecked: "unchecked",
  ariaVisible: "visible",
  ariaSearchFilterValues: "Search filter values",

  // ARIA Labels for Drop Zones

  ariaRowGroupDropZonePanelLabel: "Row Groups",
  ariaValuesDropZonePanelLabel: "Values",
  ariaPivotDropZonePanelLabel: "Column Labels",
  ariaDropZoneColumnComponentDescription: "Press DELETE to remove",
  ariaDropZoneColumnValueItemDescription:
    "Press ENTER to change the aggregation type",
  ariaDropZoneColumnGroupItemDescription: "Press ENTER to sort",
  // used for aggregate drop zone, format: {aggregation}{ariaDropZoneColumnComponentAggFuncSeperator}{column name}
  ariaDropZoneColumnComponentAggFuncSeperator: " of ",
  ariaDropZoneColumnComponentSortAscending: "ascending",
  ariaDropZoneColumnComponentSortDescending: "descending",

  // ARIA Labels for Dialogs
  ariaLabelColumnMenu: "Column Menu",
  ariaLabelCellEditor: "Cell Editor",
  ariaLabelDialog: "Dialog",
  ariaLabelSelectField: "Select Field",
  ariaLabelTooltip: "Tooltip",
  ariaLabelContextMenu: "Context Menu",
  ariaLabelSubMenu: "SubMenu",
  ariaLabelAggregationFunction: "Aggregation Function",

  // Number Format (Status Bar, Pagination Panel)
  thousandSeparator: ",",
  decimalSeparator: ".",
};
