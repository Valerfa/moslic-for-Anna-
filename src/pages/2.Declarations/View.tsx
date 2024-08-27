import React, { useEffect, useRef, useState, createRef } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

import Card from "../../components/UI/General/Card/Card";
import { Tab } from "@headlessui/react";
import General from "../../components/Tabs/1.General";
import Manuals from "../../components/Tabs/1.Manuals";
import Departments from "../../components/Tabs/1.Departments";
import { variables } from "../../variables";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ViewDeclaration = () => {
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);
  const [token] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [id, setId] = useState(0);
  const [declarationData, setDeclaration] = useState(null);
  const [manuals, setManuals] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [excel_id, setExcel] = useState(null);

  const getDeclarant = async (data) => {
    let err = null;
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/declarant_info`,
        {
          inn: data.declaration.inn,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      data.declarant = result.data;
    } catch (e) {
      console.log(e);
      err = e;
    }
    console.log(err);
    return err;
  };

  const getManuals = async (delc_id) => {
    let err = null;
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/reference_books`,
        {
          decl_id: delc_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setManuals(result.data);
    } catch (e) {
      console.log(e);
      err = e;
    }
    return err;
  };

  const getDepartments = async (delc_id) => {
    let err = null;
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/license_objects`,
        {
          decl_id: delc_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setDepartments(result.data);
    } catch (e) {
      console.log(e);
      err = e;
    }
    return err;
  };

  const getExcelId = async (excel_id) => {
    let err = null;
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/excel_printed`,
        {
          excel_id: excel_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setExcel(result.data.status);
    } catch (e) {
      console.log(e);
      err = e;
    }
    return err;
  };

  const getExcelIdNull = async (decl_id) => {
    let err = null;
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/check_excel_id`,
        {
          decl_id: decl_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setExcel(result.data.status);
    } catch (e) {
      console.log(e);
      err = e;
    }
    return err;
  };

  const getData = async () => {
    var data = {
      declaration: {
        inn: params.get("inn"),
        id: Number(params.get("id")),
        type_code: params.get("type_code"),
        corr_number: params.get("corr_number"),
        form_code: params.get("form_code"),
        period_year: params.get("period_year"),
        period_code: params.get("period_code"),
        decl_mode: params.get("decl_mode"),
        decl_date: params.get("decl_date"),
        is_null: params.get("is_null"),
        is_right_stocks: params.get("is_right_stocks"),
      },
      declarant: null,
    };
    let err = await getDeclarant(data);
    if (err !== null) {
      setError(err);
      return;
    }
    setDeclaration(data);
    if (err !== null) {
      setError(err);
      return;
    }
    err = await getManuals(Number(params.get("id")));
    if (err !== null) {
      setError(err);
      return;
    }
    err = await getDepartments(Number(params.get("id")));
    if (err !== null) {
      setError(err);
      return;
    }
    setId(Number(params.get("id")));
    if (params.get("excel_id") !== "null") {
      err = await getExcelId(Number(params.get("excel_id")));
      if (err !== null) {
        setError(err);
        return;
      }
    } else {
      err = await getExcelIdNull(Number(params.get("id")));
      if (err !== null) {
        setError(err);
        return;
      }
    }
    setLoad(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  const RequestPrint = async () => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/request_excel_generation`,
        {
          decl_id: id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setDepartments(result.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setExcel(0);
    setLoad(false);
  };

  const Download = async (path) => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.DECL_API_URL + `/retrieve_excel`,
        {
          decl_id: id,
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
      const fileType = result.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      console.log(fileType);
      link.setAttribute("download", `declaration_${id}.xlsx`); //or any other extension
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
      <div className="gap-4 md:gap-6 2xl:gap-7.5">
        <Card name="Содержимое декларации">
          <div className="w-full">
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
                  Общая информация
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
                  Справочники
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
                  Оборот
                </Tab>
                <>
                  {id === 0 ? null : excel_id === null ? (
                    <button
                      type="button"
                      onClick={() => RequestPrint()}
                      className="text-white bg-boxdark hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Сформировать запрос на печать
                    </button>
                  ) : excel_id === 1 ? (
                    <button
                      type="button"
                      onClick={() => Download()}
                      className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Выгрузить в excel
                    </button>
                  ) : excel_id === -1 ? (
                    <button
                      type="button"
                      onClick={() => RequestPrint()}
                      className="text-white bg-boxdark hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Ошибка при печати, еще раз?
                    </button>
                  ) : excel_id === 0 ? (
                    <>
                      <button
                        type="button"
                        className="text-white bg-success hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Запрос обрабатывается
                      </button>
                    </>
                  ) : null}
                </>
              </Tab.List>
              <Tab.Panels className="grow leading-relaxed block">
                <Tab.Panel>
                  <General id={id} data={declarationData} />
                </Tab.Panel>
                <Tab.Panel>
                  <Manuals id={id} data={manuals} />
                </Tab.Panel>
                <Tab.Panel>
                  <Departments id={id} data={departments} />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ViewDeclaration;
