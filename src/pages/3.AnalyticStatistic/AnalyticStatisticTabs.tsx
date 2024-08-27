import React, {
  useEffect,
  useRef,
  useState,
  createRef,
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
import DatePicker from "react-datepicker";
import axios from "axios";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import { Tab } from "@headlessui/react";
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";
import DeclarationInformation from "../../components/Tabs/2.DeclarationInformation";
import ObjectActive from "../../components/Tabs/2.ObjectActive";
import SubjectInformation from "../../components/Tabs/2.SubjectInformation";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

// Поле ввода для модального окна
import TextInput from "../../components/UI/General/Inputs/TextInput";
import { MouseEvent } from "react";
import { variables, showDate } from "../../variables";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AnalyticStatisticTabs = () => {
  const gridRef = useRef<AgGridReact>(null);

  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");

  const params = new URLSearchParams(location.search);
  const [inn, setInn] = useState(null);
  const [licenses, setLicences] = useState([]);
  const [coords, setCoords] = useState([]);
  const [declarant_data, setDeclarant] = useState(null);
  const [declarations_data, setDeclarations] = useState([]);
  const [filters, setFilters] = useState(null);

  const [period1, setPeriod1] = useState(null);
  const [period2, setPeriod2] = useState(null);
  const [form, setForm] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const getLicenses = async (inn) => {
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-inn`,
        {
          INN: inn,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setLicences(result.data);
      return null;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const getCoords = async (inn) => {
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-maps`,
        {
          INN: inn,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setCoords(
        result.data.map((i, indx) => ({
          type: "Feature",
          id: indx,
          geometry: {
            type: "Point",
            coordinates: [i.LAT, i.LNG],
          },
          properties: {
            hintContent: i.FULLSUBJECTNAME,
            balloonContent: `${
              i.FULLADDRESS === null ? "" : i.FULLADDRESS
            } \n ${i.FULLOBJECTNAME === null ? "" : i.FULLOBJECTNAME} \n ${
              i.NUMBERINREESTR === null ? "" : i.NUMBERINREESTR
            } \n c ${showDate(i.LIC_START)} по ${showDate(i.LIC_STOP)}`,
          },
        }))
      );
      return null;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const getDeclInfo = async (inn) => {
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-declarations-1`,
        {
          INN: inn,
          PERIOD1: period1 === null ? null : period1.value,
          PERIOD2: period2 === null ? null : period2.value,
          FORM: form === null ? null : form.value,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setDeclarant(result.data);
      return null;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const getDeclList = async (inn) => {
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/license-declarations-2`,
        {
          INN: inn,
          PERIOD1: period1 === null ? null : period1.value,
          PERIOD2: period2 === null ? null : period2.value,
          FORM: form === null ? null : form.value,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setDeclarations(result.data);
      return null;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  useEffect(() => {
    const inn = params.get("inn");
    if (inn == null || inn == undefined) {
      return;
    }
    if (inn.match(/^\d{10,12}$/)[0] !== "") getInn(inn);
    parseInn(inn);
  }, []);

  const parseInn = (e) => {
    if (e === "") {
      setInn("");
      return;
    }
    e = e.length > 12 ? e.slice(0, 12) : e;
    let new_inn = '';
    for (let char of e) {
        if (char.match(/\d/, char) !== null)
            new_inn += char;
    }
    setInn(new_inn);
  };

  const getDeclarations = async (inn) => {
    setLoad(true);
    let err = null;
    err = await getDeclInfo(inn);
    if (err !== null) {
      setError(err);
      return true;
    }
    err = await getDeclList(inn);
    if (err !== null) {
      setError(err);
      return true;
    }
    setLoad(false);
  };

  const getInn = async (inn) => {
    setLoad(true);
    setSelectedIndex(0);
    let err = null;
    err = await getLicenses(inn);
    if (err !== null) {
      setError(err);
      setLicences([])
      return true;
    }
    err = await getCoords(inn);
    if (err !== null) {
      setError(err);
      setCoords([])
      return true;
    }
    err = await getFilters();
    if (err !== null) {
      setError(err);
      setFilters([])
      return true;
    }
    err = await getDeclInfo(inn);
    if (err !== null) {
      setError(err);
      setDeclarant(null)
      return true;
    }
    err = await getDeclList(inn);
    if (err !== null) {
      setError(err);
      setDeclarations([])
      return true;
    }
    setLoad(false);
    return true;
  };

  const getFilters = async () => {
    try {
      const result = await axios.get(
        variables.LIC_API_URL + `/license-declaration-filters`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setFilters(result.data);
      return null;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const getExcelId = async () => {
    try {
      const result = await axios.get(
        variables.LIC_API_URL + `/license-declaration-filters`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setFilters(result.data);
      return null;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const Download = async () => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.LIC_API_URL + "/download-excel-license",
        {
          INN: inn,
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
      setError(null);
      if (result.status !== 200) throw Error(result.data.error);
      const fileType = result.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      console.log(fileType);
      link.setAttribute("download", "Сведения о декларировании.xlsx"); //or any other extension
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
      <Breadcrumb pageName="Сведения о декларанте" />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="w-full rounded-lg bg-white py-4 px-7 text-left dark:bg-boxdark">
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}>
              <Tab.List className="mb-7.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
                <div className="flex justify-between w-full">
                  <div className="flex flex-wrap gap-3">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6 ",
                          " hover:bg-primary hover:text-white dark:hover:bg-primary ",
                          selected
                            ? "bg-primary text-white "
                            : "bg-gray text-black dark:bg-meta-4 dark:text-white"
                        )
                      }>
                      Сведения о лицензиях
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
                      }>
                      Объекты действующих лицензий
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
                      }>
                      Сведения о декларировании
                    </Tab>
                  </div>
                  <DefaultIconModalWide
                    name={"Параметры запроса"}
                    textbutton={"Поиск по ИНН"}
                    onClickText={"Поиск"}
                    icon={
                      <>
                        <div className="border border-bodydark bg-gray hidden sm:block rounded-md py-3 px-4 text-sm font-medium  md:text-base lg:px-6">
                          <form
                            action="https://formbold.com/s/unique_form_id"
                            method="POST">
                            <div className="relative">
                              <button className="absolute top-1/2 left-0 -translate-y-1/2">
                                <svg
                                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                    fill=""
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                    fill=""
                                  />
                                </svg>
                              </button>

                              <input
                                type="text"
                                placeholder="Поиск по ИНН..."
                                className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
                                title="Укажите ИНН"
                              />
                            </div>
                          </form>
                        </div>
                      </>
                    }
                    children={
                      <>
                        <TextInput
                          label={"ИНН"}
                          type={"text"}
                          onChange={(e) => parseInn(e)}
                          value={inn}
                          name={"INN_DECL_LIC"}
                          id={"INN_DECL_LIC"}
                          placeholder={
                            "Введите ИНН организации или предпринимателя"
                          }
                        />
                      </>
                    }
                    onClick={() => getInn(inn)}
                  />
                </div>
              </Tab.List>
              <Tab.Panels className="leading-relaxed block">
                <Tab.Panel>
                  <SubjectInformation data={licenses.length === 0? declarant_data === null ? [] : [{INN: declarant_data.INN, KPPUR: declarant_data.KPP, EMAIL: declarant_data.EMAIL, PHONE: declarant_data.PHONE, FULLADDRESSUR: declarant_data.ADDRESS, FULLSUBJECTNAME: declarant_data.TITLE, info: []}]: licenses} />
                </Tab.Panel>
                <Tab.Panel>
                  <ObjectActive data={coords} />
                </Tab.Panel>
                <Tab.Panel>
                  <DeclarationInformation
                    filters={filters}
                    data={{
                      declarant: declarant_data,
                      declarations: declarations_data,
                    }}
                    onClick={() => getDeclarations(inn)}
                    form={form}
                    period1={period1}
                    period2={period2}
                    onChangeForm={(e) => setForm(e)}
                    onChangePeriod1={(e) => setPeriod1(e)}
                    onChangePeriod2={(e) => setPeriod2(e)}
                    Download={Download}
                    gridRef={gridRef}
                    inn={inn}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticStatisticTabs;
