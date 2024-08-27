import { YMaps, Map, GeoObject, Placemark } from "@pbe/react-yandex-maps";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

import {
  variables,
  showDate,
  getCurrentYear,
  getCurrentQuarter,
} from "../../variables";

import Breadcrumb from "../../components/UI/General/Breadcrumb";

import { Tab } from "@headlessui/react";
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";
import DeclarationInformation from "../../components/Tabs/2.DeclarationInformation";
import ObjectActive from "../../components/Tabs/2.ObjectActive";
import IconButtonDownload from "../../components/UI/General/Buttons/IconButtonDownload";
import SubjectInformation from "../../components/Tabs/2.SubjectInformation";

// Кнопки для модального окна
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";

import Card from "../../components/UI/General/Card/Card";
import CardTable from "../../components/UI/General/CardTable/CardTable";
import Tabs from "../../components/Tabs/Tabs";

import InputDefault from "../../components/UI/General/Inputs/Input";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";

// Уведомления
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";

// Поле ввода для модального окна
import TextInput from "../../components/UI/General/Inputs/TextInput";
import { MouseEvent } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Summary = () => {
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useState("");
  const [current_date] = useState(new Date());

  const params = new URLSearchParams(location.search);
  const [inn, setInn] = useState(null);

  const [is_open_filters, setFilters] = useState(true);

  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);

  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (params.get("quarter") && params.get("year"))
      onSearchClick(params.get("quarter"), params.get("year"));
    getYears(params.get("year") ? params.get("year") : null);
    getQuarters(params.get("quarter") ? params.get("quarter") : null);
  }, []);

  const onSearchClick = async (p_quarter, p_year) => {
    setLoad(true);
    try {
      const result = await axios.post(
        variables.LIC_API_URL + `/filtered-data`,
        {
          PERIOD_CODE: p_quarter,
          PERIOD_YEAR: p_year,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setData(result.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoad(false);
  };

  const getQuarters = async (current_q) => {
    try {
      const result = await axios.get(variables.LIC_API_URL + `/quarters`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setQuarters(
        result.data?.map((i) => ({
          value: i.quarter,
          name: i.period_name,
          code: i.period_code,
        }))
      );
      console.log(current_q);
      if (current_q) {
        for (let q of result.data) {
          if (current_q == q.period_code) {
            setQuarter({
              value: q.quarter,
              name: q.period_name,
              code: q.period_code,
            });
            break;
          }
        }
      } else {
        setQuarter(getCurrentQuarter());
      }
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const getYears = async (current_y) => {
    try {
      const result = await axios.get(variables.LIC_API_URL + `/years`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (result.status !== 200) throw Error(result.data.error);
      setError(null);
      setYears(result.data.map((i) => ({ value: i.year, name: i.year })));
      console.log(current_y);
      if (current_y) {
        for (let y of result.data) {
          if (current_y == y.year) {
            setYear({ value: y.year, name: y.year });
            break;
          }
        }
      } else {
        setYear(getCurrentYear());
      }
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const openFilters = () => {
    setFilters(!is_open_filters);
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
      <Breadcrumb pageName="Сводка лицензий" />
      {!is_open_filters ? null : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
          {/*Карточка 1*/}
          <div className="col-span-4">
            <Card name="Период">
              <form action="#">
                <div className="mb-5.5 flex flex-row gap-5.5">
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
                        onChange={(e) => setQuarter(e)}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress">
                      Год
                    </label>
                    <div className="relative">
                      <SelectCustom
                        options={years}
                        value={year}
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
            name={`Сводка лицензий`}
            onFiltersClick={openFilters}
            children={
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-meta-9 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Состояние лицензии
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Вид работ
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Кол-во лицензий
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Кол-во объектов
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    <>
                      {data.slice(0, -1)?.map((row, indx) => (
                        <tr
                            className={
                              row.KINDNAME === 'всего'?
                                "text-xs text-black font-semibold"
                              :
                                "bg-white border-t border-[#EEEEEE]"
                            }
                        >
                          <td className="px-6 py-4">
                            {row.LICENSESTATETYPENAME}
                          </td>
                          <td className="px-6 py-4">{row.KINDNAME}</td>
                          <td className="px-6 py-4">{row.LICCOUNT}</td>
                          <td className="px-6 py-4">{row.OBJCOUNT}</td>
                        </tr>
                      ))}
                      <tr className="text-xs text-black font-semibold uppercase bg-meta-9 bg-opacity-80 dark:bg-gray-700 dark:text-gray-400">
                        <td className="px-6 py-4">
                          {data[data.length - 1].LICENSESTATETYPENAME}
                        </td>
                        <td className="px-6 py-4">
                          {data[data.length - 1].KINDNAME}
                        </td>
                        <td className="px-6 py-4">
                          {data[data.length - 1].LICCOUNT}
                        </td>
                        <td className="px-6 py-4">
                          {data[data.length - 1].OBJCOUNT}
                        </td>
                      </tr>
                    </>
                  ) : null}
                </tbody>
              </table>
            }
            buttons={
              <>
                <button
                  type="button"
                  onClick={() =>
                    onSearchClick(
                      quarter === null ? null : quarter.code,
                      year === null ? null : year.value
                    )
                  }
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

export default Summary;
