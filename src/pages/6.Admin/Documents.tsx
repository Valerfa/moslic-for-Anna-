import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
  useCallback,
} from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";

import Tabs from "../../components/Tabs/1.Tabs";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";

import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput.tsx";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import { variables, showDate, AG_GRID_LOCALE_RU } from "../../variables";
import CellRender2 from "./AdminCasesCell2";

const filter_use = false;

const Documents = (props) => {
  const gridRef = useRef<AgGridReact>(null);
  const fileInput = createRef();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const [data, setData] = useState([]);
  const [kinds_list, setKinds] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [dataCount, setCount] = useState(0);
  // data columns
  const [dataColumns] = useState([
    {
      enableValue: true,
      field: "operations",
      headerName: "Операции",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.data === null || params.data === undefined)
          return <div></div>;
        return CellRender2(
          params,
          onViewClick,
          onEditClick,
          onDeleteClick,
          uploadDocFile,
          fileInput
        );
      },
    },
    {
      enableValue: true,
      field: "act_doc_type_name",
      headerName: "Тип документа",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agNumberColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "doc_number",
      headerName: "Номер документа",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "doc_date",
      headerName: "Дата документа",
      resizable: true,
      sortable: false,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "save_date",
      headerName: "Дата сохранения",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "email",
      headerName: "Email декларанта",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "send_date",
      headerName: "Дата отправки по email",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "post_number",
      headerName: "Номер квитанции отправки заказного письма",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "send_date_bypost",
      headerName: "Дата отправки письмом",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "draw_date",
      headerName: "Дата оформления",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
    {
      enableValue: true,
      field: "inpresence",
      headerName: "В присутствии?",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
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
    },
    {
      enableValue: true,
      field: "issignedbyperson",
      headerName: "Подписан представителем?",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
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
    },
    {
      enableValue: true,
      field: "delivery_mode_name",
      headerName: "Вид доставки",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
    },
    {
      enableValue: true,
      field: "delivery_date",
      headerName: "Дата доставки",
      resizable: true,
      sortable: false,
      wrapText: true,
      autoHeight: true,
      filter: filter_use ? "agSetColumnFilter" : null,
      cellRenderer: (params) => {
        if (params.getValue() === null || params.getValue() === undefined)
          return <div></div>;
        return <div>{showDate(params.getValue())}</div>;
      },
    },
  ]);

  const onGridReady = useCallback((params) => {
    onSearchClick();
  }, []);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const getFirstData = async () => {
    const kinds = await getKinds();
    setKinds(kinds);
    if (props !== null && props !== undefined) {
      onSearchClick(
        params.get("inn"),
        params.get("period_ucode"),
        params.get("iswrong"),
        kinds
      );
    }
  };

  useEffect(() => {
    getFirstData();
  }, []);

  const getKinds = async () => {
    let data = [];
    try {
      const result = await axios.get(variables.ADM_API_URL + `/delivery`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      console.log(result.data);
      data = result.data;
    } catch (e) {
      console.log(e);
      setError(e);
    }
    return data;
  };

  const onSearchClick = async (inn, period_ucode, iswrong, kinds) => {
    setLoad(true);

    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/documents-list`,
        {
          INN: inn,
          PERIOD_UCODE: period_ucode,
          ISWRONG: iswrong,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      for (let i of result.data) {
        i.kinds = kinds;
      }
      setData(result.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  const onEditClick = async (
    id,
    email,
    doc_number,
    doc_date,
    draw_date,
    inpresence,
    issignedbyperson,
    send_date,
    send_date_bypost,
    post_number,
    delivery_mode_id,
    delivery_date,
    force_date
  ) => {
    setLoad(true);

    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/edit-doc-params`,
        {
          p_ID: id,
          p_OPERATOR: user,
          p_EMAIL: email,
          p_DOC_NUMBER: doc_number,
          p_DOC_DATE: doc_date,
          p_DRAW_DATE: draw_date,
          p_INPRESENCE: inpresence,
          p_ISSIGNEDBYPERSON: issignedbyperson,
          p_SEND_DATE: send_date,
          p_SEND_DATE_BYPOST: send_date_bypost,
          p_POST_NUMBER: post_number,
          p_DELIVERY_MODE_ID: delivery_mode_id,
          p_DELIVERY_DATE: delivery_date,
          p_FORCE_DATE: force_date,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  const onViewClick = async (doc_id, inn, period_ucode, iswrong) => {
    setLoad(true);
    let urlDoc = null;
    try {
      const result = await axios.post(
        variables.ADM_API_URL + `/export-admin-doc`,
        {
          p_ACT_DOC_IDS: [
            [
              doc_id,
              params.get("inn"),
              params.get("period_ucode"),
              params.get("iswrong"),
            ],
          ],
          p_OPERATOR: "user",
          p_PARENT_LOG_ID: 1,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);

      const fileType = result.headers["content-type"];
      urlDoc = window.URL.createObjectURL(
        new Blob([result.data], { type: fileType })
      );
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
    return urlDoc;
  };

  const onDeleteClick = async (doc_id) => {
    if (confirm("Вы уверены?")) {
      console.log("Выгрузка");
    } else {
      // Do nothing!
      return;
    }
    setLoad(true);
    let res = true;
    try {
      const result = await axios.delete(
        variables.ADM_API_URL + `/delete-doc-params/${doc_id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      ReloadSearch();
    } catch (e) {
      console.log(e);
      setError(e);
      res = false;
      setLoad(false);
    }
    return res;
  };

  const uploadDocFile = async (doc_id) => {
    console.log(doc_id, fileInput);
    if (fileInput.current.files.length === 0) {
      alert("Прикрепите файл!");
      return false;
    }

    setLoad(true);
    let result = true;
    const formData = new FormData();
    formData.append(
      "file",
      fileInput.current.files[0],
      fileInput.current.files[0].name
    );
    console.log(formData.get("p_BASEDOCDATA"));
    try {
      const result = await axios.post(
        variables.ADM_API_URL +
          `/save-document?ACT_DOC_ID=${doc_id}&OPERATION_NOTE=some`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
    } catch (e) {
      console.log(e);
      setError(e);
      result = false;
    }
    setLoad(false);
    return true;
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

  const ReloadSearch = () => {
    onSearchClick(
      params.get("inn"),
      params.get("period_ucode"),
      params.get("iswrong"),
      kinds_list
    );
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
      <Breadcrumb pageName="Сформированные документы" />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Cписок документов"
            children={
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: 600, width: "100%" }}
                >
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={dataColumns}
                    rowData={data}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
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
                        }
                      ],
                      position: "left",
                    }}
                  />
                </div>
              </div>
            }
            buttons={
              <button
                type="button"
                onClick={() => ReloadSearch()}
                className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Обновить
              </button>
            }
          ></CardTable>
        </div>
      </div>
    </>
  );
};

export default Documents;
