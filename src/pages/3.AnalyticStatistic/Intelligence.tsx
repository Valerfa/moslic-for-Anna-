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

const Intelligence = () => {
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
        variables.DOC_API_URL +
          `/licenses-report/${year.value}${quarter.value}`,
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
      <Breadcrumb pageName="Сведения о представлении деклараций" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          <div className="col-span-4">
            <Card name="Сведения о представлении деклараций лицензиатами и торговцами пивом">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
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
                      htmlFor="phoneNumber">
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
            name="Cписок сведений"
            children={
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-meta-9 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3"></th>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Всего в квартале
                      </th>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Представившие декларации в установленный срок
                      </th>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        %
                      </th>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Непредставившие в срок
                      </th>
                      <th scope="col" colSpan={2} className="px-6 py-3">
                        Кол-во декларантов, представивших декларации с
                        нарушением срока
                      </th>
                    </tr>
                    <tr>
                      <th scope="col" className="px-6 py-3"></th>
                      <th scope="col" className="px-6 py-3">
                        Ф.7
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.8
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.7
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.8
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.7
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.8
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.7
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.8
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.7
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Ф.8
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData &&
                      rowData.map((record, i) => (
                        <tr className="bg-white border-t border-[#EEEEEE]">
                          <th
                            scope="row"
                            className="px-6 py-4 w-40 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {record.title}
                          </th>
                          {record.value_1 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_1}
                                to={`/IntelligenceList?id=${record.id_1}&godkv=${GodKv}&namecol= всего в квартале - Ф7&namerow=${record.title}`}>
                                {record.value_1}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.value_1}</td>
                          )}
                          {record.value_2 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_2}
                                to={`/IntelligenceList?id=${record.id_2}&godkv=${GodKv}&namecol= всего в квартале - Ф8&namerow=${record.title}`}>
                                {record.value_2}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.value_2}</td>
                          )}
                          {record.value_3 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_3}
                                to={`/IntelligenceList?id=${record.id_3}&godkv=${GodKv}&namecol= представившие декларации в установленный срок - Ф7&namerow=${record.title}`}>
                                {record.value_3}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.value_3}</td>
                          )}
                          {record.value_4 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_4}
                                to={`/IntelligenceList?id=${record.id_4}&godkv=${GodKv}&namecol= представившие декларации в установленный срок - Ф8&namerow=${record.title}`}>
                                {record.value_4}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.value_4}</td>
                          )}
                          <td className="px-6 py-4">
                            {record.value_1 === 0
                              ? 0.0
                              : (
                                  (record.value_3 * 100) /
                                  record.value_1
                                ).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            {record.value_2 === 0
                              ? 0.0
                              : (
                                  (record.value_4 * 100) /
                                  record.value_1
                                ).toFixed(2)}
                          </td>
                          {record.value_7 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_7}
                                to={`/IntelligenceList?id=${record.id_7}&godkv=${GodKv}&namecol= непредставившие декларации в установленный срок - Ф7&namerow=${record.title}`}>
                                {record.value_7}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.value_7}</td>
                          )}
                          {record.value_8 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_8}
                                to={`/IntelligenceList?id=${record.id_8}&godkv=${GodKv}&namecol= непредставившие декларации в установленный срок - Ф8&namerow=${record.title}`}>
                                {record.value_8}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.value_8}</td>
                          )}
                          {record.value_9 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_9}
                                to={`/IntelligenceList?id=${record.id_9}&godkv=${GodKv}&namecol= кол-во декларантов, представивших декларации с нарушением срока - Ф7&namerow=${record.title}`}>
                                {record.value_9}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4">{record.value_9}</td>
                          )}
                          {record.value_10 ? (
                            <td className="px-6 py-4">
                              <Link
                                key={record.id_10}
                                to={`/IntelligenceList?id=${record.id_10}&godkv=${GodKv}&namecol= кол-во декларантов, представивших декларации с нарушением срока - Ф8&namerow=${record.title}`}>
                                {record.value_10}
                              </Link>
                            </td>
                          ) : (
                            <td className="px-6 py-4"> {record.value_10}</td>
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
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Поиск
                </button>
              </>
            }></CardTable>
        </div>
      </div>
    </>
  );
};

export default Intelligence;
