import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
  useCallback,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import { variables, showDate, AG_GRID_LOCALE_RU } from "../../variables";

const ArchiveLicensees = () => {
  const gridRef = useRef<AgGridReact>(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");

  const [jobs, setJobs] = useState([]);

  const [is_open_filters, setFilters] = useState(true);
  const [limit] = useState(1);

  const [inn, setInn] = useState("");
  const [okpo, setOKPO] = useState("");
  const [title, setTitle] = useState(null);
  const [addressUr, setAddressUr] = useState("");
  const [addressFact, setAddressFact] = useState("");
  const [number, setNumber] = useState("");
  const [contacts, setContacts] = useState("");

  const [job, setJob] = useState({value: null, name: "Не важно"})
  const [seriaL, setSeriaL] = useState("")
  const [numberL, setNumberL] = useState("")
  const [codeL, setCodeL] = useState("")
  const [dateStartStart, setDateStartStart] = useState("")
  const [dateStartEnd, setDateStartEnd] = useState("")
  const [dateEndStart, setDateEndStart] = useState("")
  const [dateEndEnd, setDateEndEnd] = useState("")
  const [groupLic, setGroupLic] = useState(true);

  const [dataColumns] = useState([
      {
        enableValue: true,
        field: "lcn_name",
        headerName: "Название",
        resizable: true,
        rowGroup: groupLic,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          if(params.data.lcn_inn === null)
              return <div>{params.getValue()}</div>
          const link_path = `ArchiveLicensee?inn=${params.data.lcn_inn}`;
          return <div><a href={link_path} target="_black" style={{'color': 'blue'}}>{params.getValue()}</a></div>;
        },
      },
      {
        enableValue: true,
        field: "lcn_uaddr",
        headerName: "Юридический адрес",
        resizable: true,
        rowGroup: false,
      },
      {
        enableValue: true,
        field: "lcn_reg_num",
        headerName: "Гос. регистация",
        resizable: true,
        rowGroup: false,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return <div>{params.getValue()} {showDate(params.data.lcn_reg_date)}</div>;
        },
      },
      {
        enableValue: true,
        field: "lcn_inn",
        headerName: "ИНН",
        resizable: true,
        rowGroup: false,
      },
      {
        enableValue: true,
        field: "seria",
        headerName: "Серия",
        resizable: true,
      },
      {
        enableValue: true,
        field: "nomer_lic",
        headerName: "Номер",
        resizable: true,
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
        resizable: true,
      },
      {
        enableValue: true,
        field: "startdate",
        headerName: "Начало действия",
        resizable: true,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return showDate(params.getValue());
        },
      },
      {
        enableValue: true,
        field: "stopdate",
        headerName: "Окончание действия",
        resizable: true,
        cellRenderer: (params) => {
          if (params.getValue() === null || params.getValue() === undefined)
            return <div></div>;
          return showDate(params.getValue());
        },
      },
      {
        enableValue: true,
        field: "place_action",
        headerName: "Область действия",
        resizable: true,
      },
      {
        enableValue: true,
        field: "filedb",
        headerName: "Хранилище",
        resizable: true,
      }
  ]);

  const [data, setData] = useState([]);
  const [dataCount, setCount] = useState(0);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  useEffect(() => {
    setLoad(true);
    getJobs();
    setLoad(false);
  }, []);

  const getJobs = async () => {
    setError(null);
    try {
      const result = await axios.get(variables.LIC_API_URL + `/jobs`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (result.status !== 200) throw Error(result);
      setJobs([{value: null, name: "Не важно"}, ...result.data.map((i) => ({ value: i.value, name: i.name }))]);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const parseInn = (e) => {
    if (e === '') {
        setInn('');
        return ;
    }
    e = e.match(/^\d*/)[0];
    if (e === '') {
        return ;
    }
    e = e.length > 12 ? e.slice(0, 12) : e;
    setInn(e);
  };

  const parseOkpo = (e) => {
    if (e === '') {
        setOKPO('');
        return ;
    }
    e = e.match(/^\d*/)[0];
    if (e === '') {
        return ;
    }
    e = e.length > 10 ? e.slice(0, 10) : e;
    setOKPO(e);
  };

  const onSearchClick = async () => {
//     if (quarter === null && year === null) return;
    if (inn !== "")
      if (inn.length !== 10 && inn.length !== 12) {
        alert("ИНН должен содержать 10 или 12 цифр!");
        return;
      }
    setLoad(true);
    setError(null);

    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-count-by-filter`,
        {
          lcn_name: title === '' ? null : title,
          lcn_uaddr: addressUr === '' ? null : addressUr,
          lcn_faddr: addressFact === '' ? null : addressFact,
          lcn_reg_num: number === '' ? null : number,
          lcn_inn: inn === '' ? null : inn,
          lcn_okpo: okpo === '' ? null : okpo,
          contacts: contacts === '' ? null : contacts,
          typetrade: job === null ? null : job.value,
          seria: seriaL === '' ? null : seriaL,
          nomer_lic: numberL === '' ? null : numberL,
          kod: codeL === '' ? null : codeL,
          startdatefrom: dateStartStart === '' || dateStartStart === null ? null : dateStartStart.toISOString().replace('000Z', '300Z'),
          startdateto: dateStartEnd === '' || dateStartEnd === null ? null : dateStartEnd.toISOString().replace('000Z', '300Z'),
          stopdatefrom: dateEndStart === '' || dateEndStart === null ? null : dateEndStart.toISOString().replace('000Z', '300Z'),
          stopdateto: dateEndEnd === '' || dateEndEnd === null ? null : dateEndEnd.toISOString().replace('000Z', '300Z'),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      var count = result.data.total_count;
      if (count > 0) {
        setCount(count);
      }
      console.log("this");
      var datasource = getServerSideDatasource(count);
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
    }
  };

  const getServerSideDatasource = (count) => {
    return {
      getRows: async (params) => {
        console.log(params)
        console.log("[Datasource] - rows requested by grid: ", params.request);
        const startRow = params.request.startRow;
        const endRow = params.request.endRow;
        const groupBy = params.request.rowGroupCols;
        const groupKeys = params.request.groupKeys
        setLoad(true);
        setError(null);
        try {
          let result = null;
          if (groupKeys.length !== 0) {
            result = await axios.post(
                variables.LIC_API_URL + `/license-list-by-group`,
                {
                  lcn_name: title === '' ? null : title,
                  lcn_uaddr: addressUr === '' ? null : addressUr,
                  lcn_faddr: addressFact === '' ? null : addressFact,
                  lcn_reg_num: number === '' ? null : number,
                  lcn_inn: inn === '' ? null : inn,
                  lcn_okpo: okpo === '' ? null : okpo,
                  contacts: contacts === '' ? null : contacts,
                  typetrade: job === null ? null : job.value,
                  seria: seriaL === '' ? null : seriaL,
                  nomer_lic: numberL === '' ? null : numberL,
                  kod: codeL === '' ? null : codeL,
                  startdatefrom: dateStartStart === '' || dateStartStart === null ? null : dateStartStart.toISOString().replace('000Z', '300Z'),
                  startdateto: dateStartEnd === '' || dateStartEnd === null ? null : dateStartEnd.toISOString().replace('000Z', '300Z'),
                  stopdatefrom: dateEndStart === '' || dateEndStart === null ? null : dateEndStart.toISOString().replace('000Z', '300Z'),
                  stopdateto: dateEndEnd === '' || dateEndEnd === null ? null : dateEndEnd.toISOString().replace('000Z', '300Z'),

                  limit: params.parentNode.data.cnt,
                  group_by: [...groupBy.map((i) => i.field), 'lcn_uaddr', 'lcn_reg_num', 'lcn_inn'],
                  group_keys: [...groupKeys, params.parentNode.data.lcn_uaddr,
                  params.parentNode.data.lcn_reg_num, params.parentNode.data.lcn_inn]
                },
                {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
                }
              );
          } else {
            result = await axios.post(
                variables.LIC_API_URL + `/license-list-by-filter`,
                {
                  lcn_name: title === '' ? null : title,
                  lcn_uaddr: addressUr === '' ? null : addressUr,
                  lcn_faddr: addressFact === '' ? null : addressFact,
                  lcn_reg_num: number === '' ? null : number,
                  lcn_inn: inn === '' ? null : inn,
                  lcn_okpo: okpo === '' ? null : okpo,
                  contacts: contacts === '' ? null : contacts,
                  typetrade: job === null ? null : job.value,
                  seria: seriaL === '' ? null : seriaL,
                  nomer_lic: numberL === '' ? null : numberL,
                  kod: codeL === '' ? null : codeL,
                  startdatefrom: dateStartStart === '' || dateStartStart === null ? null : dateStartStart.toISOString().replace('000Z', '300Z'),
                  startdateto: dateStartEnd === '' || dateStartEnd === null ? null : dateStartEnd.toISOString().replace('000Z', '300Z'),
                  stopdatefrom: dateEndStart === '' || dateEndStart === null ? null : dateEndStart.toISOString().replace('000Z', '300Z'),
                  stopdateto: dateEndEnd === '' || dateEndEnd === null ? null : dateEndEnd.toISOString().replace('000Z', '300Z'),

                  page: startRow / (endRow - startRow),
                  limit: endRow - startRow,
                },
                {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
                }
            );
          }
          if (result === null) throw Error('Ошибка в запросе');
          if (result.success) throw Error(result);
          params.success({
            rowData: result.data,
            rowCount: groupKeys.length === 0 ? count : params.parentNode.data.cnt,
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
      <Breadcrumb pageName="Архив лицензий" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-5">
            <Card name="Лицензиат">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Наименование лицензиата
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={title}
                        name={"title"}
                        id={"title"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setTitle(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Юридический адрес
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={addressUr}
                        name={"addressUr"}
                        id={"addressUr"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setAddressUr(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Фактический адрес
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={addressFact}
                        name={"addressFact"}
                        id={"addressFact"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setAddressFact(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      № свидетельства
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={number}
                        name={"number"}
                        id={"number"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setNumber(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <TextInput
                      label={"ИНН"}
                      value={inn}
                      name={"INN"}
                      id={"INN"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseInn(e)}
                    />
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <TextInput
                      label={"ОКПО"}
                      value={okpo}
                      name={"okpo"}
                      id={"okpo"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => parseOkpo(e)}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Контакты
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={contacts}
                        name={"contacts"}
                        id={"contacts"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setContacts(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          <div className="col-span-7">
            <Card name="Лицензия">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Тип работ
                    </label>
                    <SelectCustom
                      options={jobs}
                      value={job}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setJob(e)}
                    />
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Серия
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={seriaL}
                        name={"seriaL"}
                        id={"seriaL"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setSeriaL(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Номер
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={numberL}
                        name={"numberL"}
                        id={"numberL"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setNumberL(e)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Код
                    </label>
                    <div className="relative">
                      <TextInput
                        type={"text"}
                        value={codeL}
                        name={"codeL"}
                        id={"codeL"}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setCodeL(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <DateDefaultInput
                      label={"Начало действия C"}
                      selected={dateStartStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setDateStartStart(date)}
                    ></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <DateDefaultInput
                      label={"Начало действия По"}
                      selected={dateStartEnd}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setDateStartEnd(date)}
                    ></DateDefaultInput>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <DateDefaultInput
                      label={"Окончание действия C"}
                      selected={dateEndStart}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setDateEndStart(date)}
                    ></DateDefaultInput>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <DateDefaultInput
                      label={"Окончание действия"}
                      selected={dateEndEnd}
                      placeholder={"dd.MM.yyyy"}
                      onChange={(date) => setDateEndEnd(date)}
                    ></DateDefaultInput>
                  </div>
                </div>
                {/*
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Сгруппировать?
                    </label>
                    <div className="relative">
                      <CheckboxDefault
                        name={"groupLic"}
                        id={"groupLic"}
                        value={groupLic}
                        onChange={() => setGroupLic(!groupLic)}
                      ></CheckboxDefault>
                    </div>
                  </div>
                </div>
                */}
              </form>
            </Card>
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Cписок лицензиатов"
            children={
              <>
                <div style={{ height: "100%", width: "100%" }}>
                  <div
                    className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{ height: 600, width: "100%" }}
                  >
                    <AgGridReact
                      ref={gridRef}
                      columnDefs={dataColumns}
                      defaultColDef={defaultColDef}
                      autoGroupColumnDef={autoGroupColumnDef}
                      localeText={AG_GRID_LOCALE_RU}
                      rowModelType={"serverSide"}
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
              </>
            }
            buttons={
              <>
                <button
                  type="button"
                  onClick={() => onSearchClick()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Поиск
                </button>
              </>
            }
          ></CardTable>
        </div>
      </div>
    </>
  );
};

export default ArchiveLicensees;
