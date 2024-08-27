import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import axios from "axios";

import {Link} from "react-router-dom"
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../../ag-theme-acmecorp.css";

import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";

import CardFilter from "../../../components/UI/General/CardFilter/CardFilter.tsx";
import CardTable from "../../../components/UI/General/CardTable/CardTable.tsx";

// Уведомления
import ProcessNotification from "../../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../../components/UI/General/Notifications/Error.tsx";

import {
  variables,
  AG_GRID_LOCALE_RU,
  showDate,
  mathOperations,
} from "../../../variables.tsx";


import DateRangeCardWithoutCheck from "../../../components/UI/General/Inputs/Filters/DateRangeCardWithoutCheck.tsx";
import IconButtonDownload from "../../../components/UI/General/Buttons/IconButtonDownload.tsx";


let activeDataFilters = {};

const fixHeaders = [
    {id: 5, name: "Запрос сведений о задолженностях из ФНС"},
    {id: 6, name: "Запрос выписки из ЕГРЮЛ"},
    {id: 7, name: "Запрос сведений об оплатах из Федерального Казначейства"},
    {id: 8, name: "Запрос выписки из ЕГРП"},
    {id: 23, name: "Запрос краткой выписки из ЕГРЮЛ"},
]


const FOIV = ({token, personlog_id, resources}) => {

  const current_date = new Date();
  const last_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [is_open_filters, setFilters] = useState(true);
  const [headers, setHeaders] = useState([])
  const [data, setData] = useState([])
  const [counts, setCounts] = useState([])

  //Filters
  // Дата регистрации
  const [dateStart, onSetDateStart] = useState(last_date);
  const [dateEnd, onSetDateEnd] = useState(current_date);

  const openFilters = () => {
    setFilters(!is_open_filters);
  };

  const getFiltersData = async() => {
    return {
      DateStart: dateStart.toISOString().split('T')[0],
      DateEnd: dateEnd.toISOString().split('T')[0]
    }
  }

  const onSearchClick = async() => {
    setLoad(true);
    setError(null);
    activeDataFilters = await getFiltersData()
    console.log(activeDataFilters)
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/FOIV/export_tbl?personlog_id=${personlog_id}`,
        activeDataFilters,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      if (result.data < 3) {
        setData([])
        setHeaders([])
        setCounts([])
      } else {
        setData(result.data.slice(0, -1))
        setHeaders(result.data[0])
        console.log(Math.floor(result.data.length / 2), [...Array(Math.floor(result.data.length / 2)).keys()])
        setCounts([...Array(Math.floor(result.data.length / 2)).keys()])
      }
      setLoad(false);
    } catch (e) {
      console.log(e);
      setError(e);
      setLoad(false);
      return 0
    }
  }

  const Download = async () => {
    if (confirm("Вы уверены?")) {
      console.log("Выгрузка");
    } else {
      // Do nothing!
      return;
    }
    setLoad(true);
    setError(null);
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/Requests/export_to_excel?personlog_id=${personlog_id}`,
        activeDataFilters,
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      const fileType = result.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      console.log(fileType);
      link.setAttribute("download", "Заявки.xlsx"); //or any other extension
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
      <Breadcrumb pageName="ФОИВ" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            onFiltersClick={openFilters}
            name="ФОИВ"
            buttons={
              <>
                <IconButtonDownload
                    onClick={() => Download()}
                    title={"Выгрузить"}
                />
                <button
                    type="button"
                    onClick={() => onSearchClick()}
                    className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Поиск
                </button>
              </>
            }
          >
            <>
              <div className="flex flex-row ag-grid-h">
                <div
                    className="flex flex-col ag-theme-alpine ag-theme-acmecorp flex flex-col"
                    style={{height: "100%", width: "100%"}}
                >
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-meta-9 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" colSpan={-1} className="px-6 py-3">
                      </th>
                      {counts.map((number) =>
                          <th scope="col" colSpan={number} className="px-6 py-3">
                            {number}
                          </th>
                      )}
                    </tr>
                    </thead>
                    <tbody>
                    {headers &&
                        fixHeaders.map((header, i) => (
                            <tr className="bg-white border-t border-[#EEEEEE]">
                              <td className="px-6 py-3">
                                {header.name}
                              </td>
                              {counts.map((number) =>
                                  <td className="px-6 py-4">
                                    <>
                                    {data[number * 2].flag === 1 ? data[number * 2][`col_${header.id}`] : data[number * 2 + 1][`col_${header.id}`] == 0 ? 0
                                    :
                                      <Link
                                          key={`${header.id}_${number}+1`}
                                          target={"_blank"}
                                          to={`/gosuslugi/foiv/detail?DOC_TYPE=${header.id}&COUNT_DAY=${number}&START_DATE=${dateStart.toISOString().split('T')[0]}&END_DATE=${dateEnd.toISOString().split('T')[0]}&FLAG=2`}
                                      >
                                        {data[number * 2].flag === 1 ? data[number * 2][`col_${header.id}`] : data[number * 2 + 1][`col_${header.id}`]}
                                      </Link>
                                    }
                                    </>
                                    <br/>
                                    <>
                                      {data[number * 2].flag === 2 ? data[number * 2 + 1][`col_${header.id}`] : data[number * 2][`col_${header.id}`] == 0 ? 0
                                      :
                                        <Link
                                            key={`${header.id}_${number}+2`}
                                            target={"_blank"}
                                            to={`/gosuslugi/foiv/detail?DOC_TYPE=${header.id}&COUNT_DAY=${number}&START_DATE=${dateStart.toISOString().split('T')[0]}&END_DATE=${dateEnd.toISOString().split('T')[0]}&FLAG=2`}
                                        >
                                          {data[number * 2].flag === 2 ? data[number * 2 + 1][`col_${header.id}`] : data[number * 2][`col_${header.id}`]}
                                        </Link>
                                      }
                                    </>
                                  </td>
                              )}
                            </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {!is_open_filters ? null : (
                    <div className="basis-1/3 overflow-y-auto">
                      <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                        <CardFilter>
                          <form action="#">
                            <div className="w-full">
                              <div className="mx-auto w-full max-w-lg divide-y divide-stroke rounded-xl bg-white/5">
                                <DateRangeCardWithoutCheck
                                    inputValueMin={dateStart}
                                    inputChangeMin={onSetDateStart}
                                    inputValueMax={dateEnd}
                                    inputChangeMax={onSetDateEnd}
                                />
                              </div>
                            </div>
                          </form>
                        </CardFilter>
                      </div>
                    </div>
                )}
              </div>
            </>
          </CardTable>
        </div>
      </div>
    </>
  );
};

export default FOIV;
