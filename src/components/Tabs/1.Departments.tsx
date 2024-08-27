import React, { useEffect, useRef, useState, createRef } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import axios from "axios";

import { Tab } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import Breadcrumb from "../UI/General/Breadcrumb";
import CardWithoutHeader from "../UI/General/Card/CardWithoutHeader";

// Уведомления
import ProcessNotification from "../UI/General/Notifications/Process.tsx";
import ErrorNotification from "../UI/General/Notifications/Error.tsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../variables";

var filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue.replace(" GMT", "");
    if (dateAsString == null) return -1;
    console.log(dateAsString);
    var cellDate = Date.parse(dateAsString);
    console.log(filterLocalDateAtMidnight.getTime(), cellDate);
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

// const frameworkComponents = {
//     agDateInput: CustomDateComponent,
// };

const waysColumns = [
  {
    enableValue: true,
    field: "prod_type",
    headerName: "Вид продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "prod_type_code",
    headerName: "Код вида продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    headerName: "Сведения о производителе/импортере",
    children: [
      {
        enableValue: true,
        field: "producer_title",
        headerName: "наименование",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "producer_inn",
        headerName: "ИНН",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "producer_kpp",
        headerName: "КПП",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
    ],
  },
  {
    enableValue: true,
    field: "stock_on_begin",
    headerName: "Остаток на начало отчетного периода",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    headerName: "Поступления",
    children: [
      {
        headerName: "закупки",
        children: [
          {
            headerName: "в том числе",
            children: [
              {
                enableValue: true,
                field: "purchase_from_prod",
                headerName: "от организаций-производителей",
                filter: "agNumberColumnFilter",
                minWidth: 50,
                resizable: true,
                sortable: true,
                width: 90,
              },
              {
                enableValue: true,
                field: "purchase_from_opt",
                headerName: "от организаций оптовой торговли",
                filter: "agNumberColumnFilter",
                minWidth: 50,
                resizable: true,
                sortable: true,
                width: 90,
              },
            ],
          },
          {
            enableValue: true,
            field: "purchase_total",
            headerName: "итого",
            filter: "agNumberColumnFilter",
            minWidth: 50,
            resizable: true,
            sortable: true,
            width: 90,
          },
        ],
      },
      {
        enableValue: true,
        field: "return_from_customer",
        headerName: "возврат от покупателя",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "in_other",
        headerName: "прочие поступления",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "in_movement",
        headerName: "перемещение внутри одной организации",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "in_total",
        headerName: "Всего",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
    ],
  },
  {
    headerName: "Расход",
    children: [
      {
        enableValue: true,
        field: "sales_volume",
        headerName: "объем розничной продажи",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "out_other",
        headerName: "прочий расход",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "return_to_supplier",
        headerName: "возврат поставщику",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "out_movement",
        headerName: "перемещение внутри одной организации",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "out_total",
        headerName: "Всего",
        filter: "agNumberColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
    ],
  },
  {
    enableValue: true,
    field: "stock_on_end",
    headerName: "Остаток продукции на конец",
    filter: "agNumberColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "stock_on_end_old_mark",
    headerName:
      "В том числе остаток продукции, маркированной федеральными специальными и (или) акцизными марками, требования к которым утрачивают силу",
    filter: "agNumberColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
];

const suppliesColumns = [
  {
    enableValue: true,
    field: "prod_type",
    headerName: "Вид продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "prod_type_code",
    headerName: "Код вида продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    headerName: "Сведения о производителе/импортере",
    children: [
      {
        enableValue: true,
        field: "producer_title",
        headerName: "наименование",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "producer_inn",
        headerName: "ИНН",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "producer_kpp",
        headerName: "КПП",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
    ],
  },
  {
    headerName: "Сведения о поставщике продукции",
    children: [
      {
        enableValue: true,
        field: "supplier_title",
        headerName: "наименование",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "supplier_inn",
        headerName: "ИНН",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "supplier_kpp",
        headerName: "КПП",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
    ],
  },
  {
    enableValue: true,
    field: "purchase_date",
    headerName: "Дата закупки",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return null;
      return showDate(params.getValue());
    },
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
  {
    enableValue: true,
    field: "bill_number",
    headerName: "Номер товарно-транспортной накладной",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "custom_decl_num",
    headerName: "Номер таможенной декларации",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "purchase_amount",
    headerName: "Объем закупленной продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
];

const returnsColumns = [
  {
    enableValue: true,
    field: "prod_type",
    headerName: "Вид продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "prod_type_code",
    headerName: "Код вида продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    headerName: "Сведения о производителе/импортере",
    children: [
      {
        enableValue: true,
        field: "producer_title",
        headerName: "наименование",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "producer_inn",
        headerName: "ИНН",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "producer_kpp",
        headerName: "КПП",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
    ],
  },
  {
    headerName: "Сведения о поставщике продукции",
    children: [
      {
        enableValue: true,
        field: "supplier_title",
        headerName: "наименование",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "supplier_inn",
        headerName: "ИНН",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
      {
        enableValue: true,
        field: "supplier_kpp",
        headerName: "КПП",
        filter: "agTextColumnFilter",
        minWidth: 50,
        resizable: true,
        sortable: true,
        width: 90,
      },
    ],
  },
  {
    enableValue: true,
    field: "purchase_date",
    headerName: "Дата возврата",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
    cellRenderer: (params) => {
      if (params.getValue() === null || params.getValue() === undefined)
        return null;
      return showDate(params.getValue());
    },
    filter: "agDateColumnFilter",
    filterParams: filterParams,
  },
  {
    enableValue: true,
    field: "bill_number",
    headerName: "Номер товарно-транспортной накладной",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "custom_decl_num",
    headerName: "Номер таможенной декларации",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
  {
    enableValue: true,
    field: "purchase_amount",
    headerName: "Объем возвращенной поставщику продукции",
    filter: "agTextColumnFilter",
    minWidth: 50,
    resizable: true,
    sortable: true,
    width: 90,
  },
];

const Departments = (props) => {
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");

  const [id, setId] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.id != id) {
      setData(props.data);
      setId(props.id);
    }
  }, []);

  const getDepartInfo = async (depart_id) => {
    setLoad(true);
    const table_list = [1, 2, 3];
    var info = [null, null, null];
    for (let i of table_list) {
      info[i - 1] = await getRecord(depart_id, i);
    }
    const new_data = data.map((depart) => {
      if (depart.id === depart_id) {
        depart.info = info;
      }
      return depart;
    });
    setData(new_data);
    console.log(new_data);
    setLoad(false);
  };

  const getRecord = async (depart_id, table_number) => {
    setLoad(true);
    let d = null;
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/record_data`,
        {
          decl_id: id,
          depart_id: depart_id,
          table_id: table_number,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      if (result.data.data.length === 0) d = null;
      else d = result.data.data;
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
    return d;
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
      <div className="mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <CardWithoutHeader>
          <div>
            <ul>
              {data?.map((depart) => (
                <li key={depart.id}>
                  <p className="mt-5">
                    <b>КПП</b>:{" "}
                    {depart.kpp === null ? "отсутствует" : depart.kpp}
                  </p>
                  <p>
                    <b>Адрес</b>:
                  </p>
                  <p>
                    <b>Почтовый индекс</b>:{" "}
                    {depart.post_index === null
                      ? "отсутствует"
                      : depart.post_index}
                  </p>
                  <p>
                    <b>Код региона</b>:{" "}
                    {depart.region_code === null
                      ? "отсутствует"
                      : depart.region_code}
                  </p>
                  <p>
                    <b>Район</b>:{" "}
                    {depart.area === null ? "отсутствует" : depart.area}
                  </p>
                  <p>
                    <b>Город/населеный пункт</b>:{" "}
                    {depart.city === null
                      ? depart.town === null
                        ? "отсутствует"
                        : depart.town
                      : depart.city}
                  </p>
                  <p>
                    <b>Улица</b>:{" "}
                    {depart.street === null ? "отсутствует" : depart.street}
                  </p>
                  <p>
                    <b>Дом, корпус</b>:{" "}
                    {depart.house === null ? "отсутствует" : depart.house}
                    {depart.korp === null ? "" : `, ${depart.korp}`}
                  </p>
                  {depart.info === undefined ? (
                    <button
                      className="underline decoration-dotted text-primary my-2"
                      onClick={() => getDepartInfo(depart.id)}
                    >
                      Подробности
                    </button>
                  ) : (
                    <>
                      <div className="w-full mt-5">
                        <Tab.Group>
                          <Tab.List className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
                            <Tab
                              className={({ selected }) =>
                                classNames(
                                  "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                                  " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                                  selected
                                    ? "bg-primary text-white "
                                    : "bg-gray text-black dark:bg-meta-4 dark:text-white"
                                )
                              }
                            >
                              Движение
                            </Tab>
                            <Tab
                              className={({ selected }) =>
                                classNames(
                                  "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                                  " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                                  selected
                                    ? "bg-primary text-white "
                                    : "bg-gray text-black dark:bg-meta-4 dark:text-white"
                                )
                              }
                            >
                              Поставки
                            </Tab>
                            <Tab
                              className={({ selected }) =>
                                classNames(
                                  "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                                  " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                                  selected
                                    ? "bg-primary text-white "
                                    : "bg-gray text-black dark:bg-meta-4 dark:text-white"
                                )
                              }
                            >
                              Возвраты
                            </Tab>
                          </Tab.List>
                          <Tab.Panels className="leading-relaxed block">
                            <Tab.Panel
                              className={classNames(
                                "rounded-xl",
                                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                              )}
                            >
                              {depart.info[0] === null ? (
                                <p>Пусто</p>
                              ) : (
                                <div
                                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                                  style={{ height: 400, width: "100%" }}
                                >
                                  <AgGridReact
                                    columnDefs={waysColumns}
                                    rowData={depart.info[0]}
                                    localeText={AG_GRID_LOCALE_RU}
                                    pagination={true}
                                    autosize={true}
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
                                  ></AgGridReact>
                                </div>
                              )}
                            </Tab.Panel>
                            <Tab.Panel
                              className={classNames(
                                "rounded-xl",
                                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                              )}
                            >
                              {depart.info[1] === null ? (
                                <p>Пусто</p>
                              ) : (
                                <div
                                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                                  style={{ height: 400, width: "100%" }}
                                >
                                  <AgGridReact
                                    columnDefs={suppliesColumns}
                                    rowData={depart.info[1]}
                                    localeText={AG_GRID_LOCALE_RU}
                                    pagination={true}
                                    autosize={true}
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
                                  ></AgGridReact>
                                </div>
                              )}
                            </Tab.Panel>
                            <Tab.Panel
                              className={classNames(
                                "rounded-xl",
                                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                              )}
                            >
                              {depart.info[2] === null ? (
                                <p>Пусто</p>
                              ) : (
                                <div
                                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                                  style={{ height: 400, width: "100%" }}
                                >
                                  <AgGridReact
                                    columnDefs={returnsColumns}
                                    rowData={depart.info[3]}
                                    localeText={AG_GRID_LOCALE_RU}
                                    pagination={true}
                                    autosize={true}
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
                                  ></AgGridReact>
                                </div>
                              )}
                            </Tab.Panel>
                          </Tab.Panels>
                        </Tab.Group>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </CardWithoutHeader>
      </div>
    </>
  );
};

export default Departments;
