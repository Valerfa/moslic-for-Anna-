import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../variables";

// Ипорт компонент
import ButtonPrimary from "../UI/General/Buttons/ButtonPrimary";
import SelectCustom from "../UI/General/Inputs/Select";

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

const quarters = {
  "3": "1 Квартал",
  "6": "2 Квартал",
  "9": "3 Квартал",
  "0": "4 Квартал",
};

const quarters_codes = {
  "3": 1,
  "6": 2,
  "9": 3,
  "0": 4,
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

const times = {
  0: "Не представлена",
  1: "Вовремя",
  2: "Не вовремя",
};

const filter_use = true;

const DeclarationInformation = (props) => {
  const [is_open_filters, setFilters] = useState(false);
  const [token] = useState("");
  const [data, setData] = useState(null);
  const [columns] = useState([
    {
      enableValue: true,
      field: "intime",
      headerName: "Нарушения",
      filter: null,
      resizable: true,
      sortable: false,
      autoHeight: true,
      valueGetter: (params) => {
        if (params.data === null) return null;
        let violator_mask = 0;
        if (params.data.isviolator) violator_mask += params.data.isviolator;
        if (params.data.iswrong) violator_mask += params.data.iswrong * 10;
        switch (violator_mask) {
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
            return <span>Отсутствуют</span>;
          case 1:
            return <span>Предоставлена не вовремя</span>;
          case 2:
            return <span>Не предоставлена</span>;
          case 3:
            return <span>Недостоверные сведения</span>;
          case 4:
            return (
              <>
                <span>Недостоверные сведения, </span>
                <span>не предоставлена</span>
              </>
            );
          case 5:
            return (
              <>
                <span>Недостоверные сведения, </span>
                <span>не вовремя</span>
              </>
            );
        }
        return <div>Другое</div>;
      },
    },
    {
      enableValue: true,
      field: "detail",
      headerName: "",
      filter: null,
      resizable: true,
      sortable: false,
      autoHeight: true,
      minWigth: 200,
      width: 450,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined) return "";
        if (params.data.cnt_mode === 0) return "";
        if (params.data.detail === undefined) {
          return (
            <button
              className="text-white text-sm rounded-md bg-primary py-1.5 px-3"
              onClick={() => getDetail(params)}
            >
              Декларации
            </button>
          );
        } else if (params.data.detail === null) {
          return "";
        } else {
          return params.data.detail.length === 0 ? (
            "отсутствуют"
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Тип
                  </th>
                  <th scope="col" className="px-6 py-3">
                    № корр.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody>
                {params.data.detail?.map((row) => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{row.type_name}</td>
                    <td className="px-6 py-4">{row.corr_number}</td>
                    <td className="px-6 py-4">{showDate(row.decl_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
      },
    },
    {
      enableValue: true,
      field: "period_year",
      headerName: "Год",
      filter: filter_use ? "agSetColumnFilter" : null,
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "period_code",
      headerName: "Квартал",
      resizable: true,
      sortable: false,
      valueGetter: (params) => {
        if (
          params.data.period_code === null ||
          params.data.period_code === undefined
        )
          return "";
        return quarters[params.data.period_code];
      },
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "form_code",
      headerName: "Номер формы",
      filter: filter_use ? "agSetColumnFilter" : null,
      valueGetter: (params) => {
        if (
          params.data.form_code === null ||
          params.data.form_code === undefined
        )
          return "";
        return forms[params.data.form_code];
      },
      resizable: true,
      sortable: false,
    },
    {
      enableValue: true,
      field: "decl_date",
      headerName: "Дата",
      resizable: true,
      sortable: false,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return null;
        return showDate(params.getValue());
      },
      filter: filter_use ? "agDateColumnFilter" : null,
      filterParams: filterParams,
    },
  ]);

  const getDetail = async (params) => {
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-declarations-detail`,
        {
          INN: props.inn,
          PERIOD_UCODE:
            params.data.period_year * 10 +
            quarters_codes[params.data.period_code],
          FORM: params.data.form_code,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      const rowNode = props.gridRef.current!.api.getRowNode(params.rowIndex)!;
      const new_data = rowNode.data;
      new_data["detail"] = result.data;
      rowNode.updateData(new_data);
      setError(null);
      return null;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  useEffect(() => {
    console.log(props);
    setData(props.data);
  }, [props]);

  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      wrapHeaderText: true,
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 250,
      wrapHeaderText: true,
      //       autoHeaderHeight: true,
    };
  }, []);

  if (data === null) return null;
  return (
    <>
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12">
            <form action="#">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-full md:w-1/5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    С
                  </label>
                  <div className="relative">
                    <SelectCustom
                      options={
                        props.filters === null ? [] : props.filters.periods
                      }
                      value={props.period1}
                      placeholder={"Не заполнено"}
                      onChange={(e) => props.onChangePeriod1(e)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-full md:w-1/5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    По
                  </label>
                  <div className="relative">
                    <SelectCustom
                      options={
                        props.filters === null ? [] : props.filters.periods
                      }
                      value={props.period2}
                      placeholder={"Не заполнено"}
                      onChange={(e) => props.onChangePeriod2(e)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-full md:w-1/5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    Вид декларации
                  </label>
                  <div className="relative">
                    <SelectCustom
                      options={
                        props.filters === null ? [] : props.filters.forms
                      }
                      value={props.form}
                      placeholder={"Не заполнено"}
                      onChange={(e) => props.onChangeForm(e)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-full md:w-1/5">
                  <ButtonPrimary id={"LIC_VIEW_DECL"} onClick={props.onClick}>
                    Найти
                  </ButtonPrimary>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/*Юр. лицо*/}
      {data.declarant === null ? null : (
        <div>
          <p className="mb-1.5 font-medium text-black dark:text-white">
            Организация:
          </p>
          <h4 className="mb-3 text-xl font-bold text-black dark:text-white">
            {data.declarant.TITLE}
          </h4>
          <span className="mt-1.5 block">
            <span className="font-medium text-black dark:text-white">
              ИНН:{" "}
            </span>
            {data.declarant.INN}
          </span>
          <span className="block">
            <span className="font-medium text-black dark:text-white">
              КПП:{" "}
            </span>
            {data.declarant.KPP === null ? "отсутствует" : data.declarant.KPP}
          </span>
          <span className="block">
            <span className="font-medium text-black dark:text-white">
              Юридический адрес:{" "}
            </span>
            {data.declarant.ADDRESS === null
              ? "отсутствует"
              : data.declarant.ADDRESS}
          </span>
          <span className="block">
            <span className="font-medium text-black dark:text-white">
              Адрес электронной почты:{" "}
            </span>
            {data.declarant.EMAIL === null
              ? "отсутствует"
              : data.declarant.EMAIL}
          </span>
          <span className="block">
            <span className="font-medium text-black dark:text-white">
              Контактный телефон:{" "}
            </span>
            {data.declarant.PHONE === null
              ? "отсутствует"
              : data.declarant.PHONE}
          </span>
          <span className="block">
            <span className="font-medium text-black dark:text-white">
              Владелец:{" "}
            </span>
            {data.declarant.DIRECTOR === null
              ? "отсутствует"
              : data.declarant.DIRECTOR}
          </span>
          {data.declarations.length === 0 ? null : (
            <div className="mt-5">
              <ButtonPrimary onClick={() => props.Download()}>
                Выгрузить в Excel
              </ButtonPrimary>
            </div>
          )}
        </div>
      )}
      {/*Список деклараций*/}
      {data.declarations.length === 0 ? (
        "Декларации отсутствуют"
      ) : (
        <div className="mt-10 max-w-full overflow-x-auto">
          {/*Сведения о лицензиате*/}
          <div
            className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
            style={{ height: 450, width: "100%" }}
          >
            <AgGridReact
              ref={props.gridRef}
              columnDefs={columns}
              rowData={data.declarations}
              defaultColDef={defaultColDef}
              autoGroupColumnDef={autoGroupColumnDef}
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
        </div>
      )}
    </>
  );
};

export default DeclarationInformation;
