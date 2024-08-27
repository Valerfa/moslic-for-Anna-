import Breadcrumb from "../../components/UI/General/Breadcrumb";

import axios from "axios";
import { Tab } from "@headlessui/react";
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";
import DeclarationInformation from "../../components/Tabs/2.DeclarationInformation";
import ObjectActive from "../../components/Tabs/2.ObjectActive";
import SubjectInformation from "../../components/Tabs/2.SubjectInformation";

// Кнопки для модального окна
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";

// Поле ввода для модального окна
import TextInput from "../../components/UI/General/Inputs/TextInput";
import { MouseEvent } from "react";
import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";
import SelectCustom from "../../components/UI/General/Inputs/Select";
//------------------MOY KOD-----------------------------------
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Select from "react-select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise"; //позволяет создавать группы, экспорт в Excel, CSV и многое другое
import { Link } from "react-router-dom";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

import {
  variables,
  showDate,
  AG_GRID_LOCALE_RU,
  getCurrentYear,
  getCurrentQuarter,
} from "../../variables";

const Violators = () => {
  const [GodKv, setCodKv] = useState("");
  const [rowData, setRowData] = useState();
  const [rowPeriod, setRowPeriod] = useState();
  const [valueS, setValueS] = useState("");
  const [is_open_filters, setFilters] = useState(true);

  // списки
  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);

  // значения по фильтрам
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);

  const current_date = new Date();
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [user] = useState("Департамент торговли и услуг города Москвы");

  const handleChangeS = (event) => {
    setValueS(event.target.value);
  };
  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const getQuarters = async () => {
    try {
      const result = await axios.get(variables.DOC_API_URL + `/quarters`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setQuarters(
        result.data?.map((i) => ({
          value: i.quarter,
          name: i.period_name,
          code: i.period_code,
        }))
      );
      setQuarter(getCurrentQuarter());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getYears = async () => {
    try {
      const result = await axios.get(variables.DOC_API_URL + `/years`, {
        headers: {
          Authorization: `Token ${token}`,
          User: "user",
        },
      });
      if (result.status !== 200) throw Error(result);
      setError(null);
      setYears(result.data.map((i) => ({ value: i.year, name: i.year })));
      setYear(getCurrentYear());
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const onSearchClick = async () => {
    if (quarter === null || year === null) {
      alert("Выберите год и квартал");
      return;
    }
    setCodKv(`${year.value}${quarter.value}`);
    setLoad(true);
    try {
      const result = await axios.get(
        variables.DOC_API_URL + `/violations/${year.value}${quarter.value}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            User: "user",
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      setError(null);
      setRowData(result.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  useEffect(() => {
    getQuarters();
    getYears();
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
      <Breadcrumb pageName="Нарушители представления декларации" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-4">
            <Card name="Нарушители представления деклараций за квартал">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Квартал
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={quarters}
                        value={quarter}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setQuarter(e)}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Год
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={years}
                        value={year}
                        placeholder={"Не заполнено"}
                        onChange={(e) => setYear(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="Список нарушителей"
            children={
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-meta-9 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3"></th>
                      <th scope="col" className="px-6 py-3">
                        Всего
                      </th>
                      <th scope="col" className="px-6 py-3">
                        РПА
                      </th>
                      <th scope="col" className="px-6 py-3">
                        РПО
                      </th>
                      <th scope="col" className="px-6 py-3">
                        И РПА, И РПО
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData &&
                      rowData.map((record, i) => (
                        <tr className="bg-white border-t border-[#EEEEEE]">
                          <th
                            scope="row"
                            className="px-6 py-4 w-40 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {record.num}
                          </th>
                          {record.sum ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_1}
                                to={`/ViolatorsList?id=${record.id_1}&godkv=${GodKv}&namecol=Всего&namerow=${record.num}`}
                              >
                                {record.sum}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.sum}</td>
                          )}
                          {record.rpa ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_3}
                                to={`/ViolatorsList?id=${record.id_3}&godkv=${GodKv}&namecol=РПА&namerow=${record.num}`}
                              >
                                {record.rpa}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.rpa}</td>
                          )}

                          {record.rpo ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_2}
                                to={`/ViolatorsList?id=${record.id_2}&godkv=${GodKv}&namecol=РПО&namerow=${record.num}`}
                              >
                                {record.rpo}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.rpo}</td>
                          )}
                          {record.rpo_rpa ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_4}
                                to={`/ViolatorsList?id=${record.id_4}&godkv=${GodKv}&namecol=И РПА, И РПО&namerow=${record.num}`}
                              >
                                {record.rpo_rpa}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.rpo_rpa}</td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
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

export default Violators;
