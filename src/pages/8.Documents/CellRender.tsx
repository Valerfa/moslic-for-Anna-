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
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";

//Иконки
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import {
  variables,
  AG_GRID_LOCALE_RU,
  VioLicDataColumns,
  showDate,
} from "../../variables";
import ButtonDanger from "../../components/UI/General/Buttons/ButtonDanger";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import CustomPopover from "../../components/UI/General/Inputs/Popover";
import CellRender2 from "../6.Admin/AdminCasesCell2";
import ModalFetch from "../6.Admin/AdminModal";

registerLocale("ru", ru);

export default function CellRender(
  params,
  onViewLogs,
  onDownloadClick,
  onUploadClick,
  fileInput
) {
  const [logs, setLogs] = useState(null);
  const [createDoc, setCreateDoc] = useState(null);

  const handleLogs = async (act_doc_id) => {
    const new_logs = await onViewLogs(act_doc_id);
    console.log(new_logs);
    setLogs(new_logs);
  };

  if (params.data === null || params.data === undefined) return <div></div>;
  return (
    <div className="flex p-2 gap-2">
      <ModalFetch
        title={"Просмотр операций"}
        textbutton={"Просмотр"}
        onClickText={"Просмотр"}
        onClick={() => handleLogs(params.data.act_doc_id)}
        onClickClassName={
          "-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
        }
        children={
          <>
            {logs === null ? null : (
              <>
                <div style={{ height: "100%", width: "100%" }}>
                  <div
                    className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{ height: 1000, width: "100%" }}
                  >
                    <AgGridReact
                      columnDefs={[
                        {
                          enableValue: true,
                          field: "operation_name",
                          headerName: "Вид операции",
                          resizable: true,
                          sortable: false,
                          filter: "agSetColumnFilter",
                        },
                        {
                          enableValue: true,
                          field: "log_date",
                          headerName: "Дата операции",
                          resizable: true,
                          sortable: false,
                          filter: "agDateColumnFilter",
                          cellRenderer: (params) => {
                            if (
                              params.getValue() === null ||
                              params.getValue() === undefined
                            )
                              return <div></div>;
                            return <div>{showDate(params.getValue())}</div>;
                          },
                        },
                        {
                          enableValue: true,
                          field: "log_email",
                          headerName: "Адрес электронной почты",
                          resizable: true,
                          sortable: false,
                          filter: "agSetColumnFilter",
                        },
                        {
                          enableValue: true,
                          field: "operation_note",
                          headerName: "Комментарий",
                          resizable: true,
                          sortable: false,
                          filter: "agTextColumnFilter",
                        },
                      ]}
                      rowData={logs}
                      localeText={AG_GRID_LOCALE_RU}
                      pagination={true}
                      paginationPageSize={10}
                      suppressRowClickSelection={true}
                      cacheBlockSize={10}
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
                                suppressRowGroups: true,
                                suppressValues: true,
                                suppressPivots: true,
                                suppressPivotMode: true,
                                suppressColumnFilter: true,
                                suppressColumnSelectAll: true,
                                suppressColumnExpandAll: true,
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
            )}
          </>
        }
      ></ModalFetch>
      <button
        key={"Выгрузка"}
        onClick={() =>
          onDownloadClick(params.data.act_doc_id, [
            params.data.inn,
            params.data.period_ucode,
            params.data.iswrong,
          ])
        }
      >
        <ArrowDownTrayIcon className="h-6 w-6 stroke-[#637381] hover:stroke-danger cursor-pointer" />
      </button>
      <DefaultIconModalWide
        icon={
          <>
            <ArrowUpTrayIcon className="h-6 w-6 stroke-[#637381] hover:stroke-danger cursor-pointer" />
          </>
        }
        title={"Загрузка"}
        name={"Загрузка"}
        onClickText={"Загрузка"}
        onClickClassName={"ag-menu-option"}
        children={
          <>
            <form action="#">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName"
                  >
                    Документ
                  </label>
                  <DocumentsInput
                    onChange={setCreateDoc}
                    fileInput={fileInput}
                  />
                </div>
              </div>
            </form>
          </>
        }
        onClick={() => onUploadClick(params.data.act_doc_id)}
      ></DefaultIconModalWide>
    </div>
  );
}
