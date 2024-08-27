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
import DefaultModal from "../../components/UI/General/Modal/DefaultModal";
import DefaultIconModalWide from "../../components/UI/General/Modal/DefaultIconModalWide";

//Иконки
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { StopCircleIcon } from "@heroicons/react/24/outline";

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
import IconButtonX from "../../components/UI/General/Buttons/IconButtonX";

registerLocale("ru", ru);

export default function CellRender1(
  params,
  onClickCreate,
  onClickPaid,
  onClickClose
) {
  const [paidDocList, setPaidDocList] = useState([
    { value: 0, name: "15.13" },
    { value: 1, name: "20.25" },
  ]);

  // create admin penalty
  const [penaltyState, setPenaltyState] = useState(null);
  const [penaltyAlert, setPenaltyAlert] = useState(false);
  const [penaltyAmount, setPenaltyAmount2] = useState(null);
  const [penaltyDate, setPenaltyDate] = useState("");
  const [penaltyDate2, setPenaltyDate2] = useState("");
  const [penaltyStartDate, setPenaltyStartDate] = useState("");

  // create admin penalty
  const [paidState, setPaidState] = useState(null);
  const [paidAmount, setPaidAmount] = useState(false);
  const [paidKind, setPaidKind] = useState(null);
  const [paidNumber, setPaidNumber] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [paidForce, setPaidForce] = useState(false);
  const [paidClose, setPaidClose] = useState(false);

  // close/terminate case
  const [closeType, setCloseType] = useState(1);

  const [currentPaidSum, setCurrentPaidSum] = useState(-1);

  useEffect(() => {
    console.log(params);
  }, [params]);

  const handleClick = () => {
    if (penaltyState === null) {
      alert("Выберите статью");
      return;
    }
    if (penaltyAlert && penaltyState.value === 0) {
      onClickCreate(
        params.data.inn,
        params.data.period_ucode,
        params.data.iswrong,
        2,
        0,
        1,
        null,
        null,
        null
      );
      return;
    }

    if (penaltyAmount === null) {
      alert("Выберите размер штрафа");
      return;
    }
    if (penaltyDate === null || penaltyDate === "") {
      alert("Заполните крайнюю дату оплаты штрафа по постановлению");
      return;
    }
    if (penaltyDate2 === null || penaltyDate2 === "") {
      alert("Заполните крайнюю дату оплаты штрафа по доставке постановлении");
      return;
    }
    if (penaltyStartDate === null || penaltyStartDate === "") {
      alert("Заполните дату вступления в силу");
      return;
    }
    onClickCreate(
      params.data.inn,
      params.data.period_ucode,
      params.data.iswrong,
      penaltyState.value,
      penaltyAmount.value,
      0,
      penaltyStartDate,
      penaltyDate,
      penaltyDate2
    );
  };

  const handleClick2 = () => {
    if (paidState === null) {
      alert("Выберите статью");
      return;
    }
    if (paidAmount === null) {
      alert("Выберите размер штрафа");
      return;
    }
    if (paidDate === null || paidDate === "") {
      alert("Заполните дату оплаты");
      return;
    }
    if (paidKind === null) {
      alert("Выберите тип");
      return;
    }
    if (paidNumber === null || paidNumber === "") {
      alert("Заполните номер");
      return;
    }
    onClickPaid(
      params.data.inn,
      params.data.period_ucode,
      params.data.iswrong,
      paidState,
      paidAmount,
      paidDate,
      paidKind,
      paidNumber,
      paidForce,
      paidClose
    );
  };

  const handleClick3 = (close_type) => {
    if (confirm("Вы уверены?")) {
      console.log("Прекращение");
    } else {
      // Do nothing!
      return;
    }
    onClickClose(
      params.data.inn,
      params.data.period_ucode,
      params.data.iswrong,
      close_type == 0 ? 0 : closeType
    );
  };

  const setPaidStateClass = (value) => {
    console.log(
      value.value,
      params.data.penalty2025_amount,
      params.data.penalty_amount
    );
    if (value.value === 1)
      if (
        params.data.penalty2025_amount !== null &&
        params.data.penalty2025_paidsum !== null
      )
        setCurrentPaidSum(
          params.data.penalty2025_amount -
            Number(params.data.penalty2025_paidsum)
        );
      else if (
        params.data.penalty_amount !== null &&
        params.data.penalty_paidsum !== null
      )
        setCurrentPaidSum(
          params.data.penalty_amount - Number(params.data.penalty_paidsum)
        );
    setPaidState(value);
  };

  const changePenaltyState = (value) => {
    if (params.data.ispenalty !== 0 && value.value === 1)
      setPenaltyState(value);
    else if (value.value === 0) setPenaltyState(value);
    else alert("Штраф по 15.13 не оформлен");
    setPenaltyAlert(false);
  };

  if (params.data === null || params.data === undefined) return <div></div>;
  return (
    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
      <div className="flex flex-col items-center sm:flex-row w-full sm:w-3/6">
        {!params.data.isactive ? (
          params.data.terminate_mode == 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          ) : params.data.terminate_mode == 1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </>
          )
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>
        )}
        <Link
          to={`documents?inn=${params.data.inn}&period_ucode=${params.data.period_ucode}&iswrong=${params.data.iswrong}`}
          target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            sstrokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </Link>
        <Link
          to={`penalties?inn=${params.data.inn}&period_ucode=${params.data.period_ucode}&iswrong=${params.data.iswrong}`}
          target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            sstrokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </Link>
      </div>
      <div className="w-full sm:w-3/6">
        <div className="flex gap-2/Users/chigakss/Downloads/reestr_lic-client 8/src/pages/6.Admin/AdminCasesCell1.tsx">
          <DefaultIconModalWide
            icon={
              <>
                <BuildingLibraryIcon className="h-6 w-6 stroke-[#637381] hover:stroke-danger cursor-pointer" />
              </>
            }
            title={"Оформление административного наказания"}
            name={"Оформление административного наказания"}
            textbutton={"Оформить"}
            onClickText={"Оформить"}
            onClickClassName={
              "m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
            }
            children={
              <>
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                    <div className="w-full">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          По статье
                        </label>
                        <div className="relative">
                          <SelectCustom
                            options={paidDocList}
                            value={penaltyState}
                            onChange={(e) => changePenaltyState(e)}
                          />
                        </div>
                      </div>
                      {penaltyState === null ? null : (
                        <>
                          {penaltyState.value !== 0 ? null : (
                            <div>
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName">
                                Вынесено предупреждение
                              </label>
                              <div className="relative">
                                <CheckboxDefault
                                  name={"penaltyAlert_null"}
                                  id={"penaltyAlert_null"}
                                  value={penaltyAlert}
                                  onChange={() =>
                                    setPenaltyAlert(!penaltyAlert)
                                  }></CheckboxDefault>
                              </div>
                            </div>
                          )}
                          {penaltyAlert ? null : (
                            <>
                              <div>
                                <label
                                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                                  htmlFor="fullName">
                                  Штраф в размере (тыс. рублей)
                                </label>
                                <div className="relative">
                                  <SelectCustom
                                    options={params.data.amounts}
                                    value={penaltyAmount}
                                    onChange={(e) => setPenaltyAmount2(e)}
                                  />
                                </div>
                              </div>
                              <div>
                                <DateDefaultInput
                                  label={
                                    "Крайняя дата оплаты штрафа по постановлению"
                                  }
                                  selected={penaltyDate}
                                  placeholder={"dd.MM.yyyy"}
                                  onChange={(date) =>
                                    setPenaltyDate(date)
                                  }></DateDefaultInput>
                                <DateDefaultInput
                                  label={
                                    "Крайняя дата оплаты штрафа по доставке постановления"
                                  }
                                  selected={penaltyDate2}
                                  placeholder={"dd.MM.yyyy"}
                                  onChange={(date) =>
                                    setPenaltyDate2(date)
                                  }></DateDefaultInput>
                                <DateDefaultInput
                                  label={"Дата вступления в силу"}
                                  selected={penaltyStartDate}
                                  placeholder={"dd.MM.yyyy"}
                                  onChange={(date) =>
                                    setPenaltyStartDate(date)
                                  }></DateDefaultInput>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </form>
              </>
            }
            onClickText={"Оформить"}
            onClickClassName={"ag-menu-option"}
            onClick={() => handleClick()}></DefaultIconModalWide>
          <DefaultIconModalWide
            icon={
              <>
                <CheckBadgeIcon className="h-6 w-6 stroke-[#637381] hover:stroke-success cursor-pointer" />
              </>
            }
            title={"Регистрация оплаты по выставленному штрафу"}
            name={"Регистрация оплаты по выставленному штрафу"}
            textbutton={"Зарегистрировать"}
            onClickText={"Зарегистрировать"}
            onClickClassName={
              "-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
            }
            children={
              <>
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                    <div className="w-full">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          По статье
                        </label>
                        <div className="relative">
                          <SelectCustom
                            options={paidDocList}
                            value={paidState}
                            onChange={(e) => setPaidStateClass(e)}
                          />
                        </div>
                        <NumberInput
                          label={"Сумма оплаты"}
                          value={paidAmount}
                          name={"paidAmount"}
                          id={"paidAmount"}
                          placeholder={"Не заполнено"}
                          onChange={(e) => setPaidAmount(e < 0 ? 0 : e)}
                        />
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          Вид платежного элемента
                        </label>
                        <div className="relative">
                          <SelectCustom
                            options={params.data.paydoc_types}
                            value={paidKind}
                            onChange={(e) => setPaidKind(e)}
                          />
                        </div>
                        <NumberInput
                          label={"Номер платежного поручения/квитанции"}
                          value={paidNumber}
                          name={"paidNumber"}
                          id={"paidNumber"}
                          placeholder={"Не заполнено"}
                          onChange={(e) => setPaidNumber(e)}
                        />
                        <DateDefaultInput
                          label={"Дата платежа"}
                          selected={paidDate}
                          placeholder={"dd.MM.yyyy"}
                          onChange={(date) =>
                            setPaidDate(date)
                          }></DateDefaultInput>
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          Под воздействием приставов
                        </label>
                        <div className="relative">
                          <CheckboxDefault
                            name={"paidForce"}
                            id={"paidForce"}
                            value={paidForce}
                            onChange={() =>
                              setPaidForce(!paidForce)
                            }></CheckboxDefault>
                        </div>
                        {currentPaidSum !== -1 &&
                        currentPaidSum -
                          Number(
                            paidAmount === null ? 0 : Number(paidAmount)
                          ) <=
                          0 ? (
                          <>
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="fullName">
                              Закрыть дело?
                            </label>
                            <div className="relative">
                              <CheckboxDefault
                                name={"paidClose"}
                                id={"paidClose"}
                                value={paidClose}
                                onChange={() =>
                                  setPaidClose(!paidClose)
                                }></CheckboxDefault>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </form>
              </>
            }
            onClickText={"Оформить"}
            onClickClassName={"ag-menu-option"}
            onClick={() => handleClick2()}></DefaultIconModalWide>
          <IconButtonX
            onClick={() => handleClick3(0)}
            title={"Закрытие дела"}></IconButtonX>
          <DefaultIconModalWide
            icon={
              <>
                <StopCircleIcon className="h-6 w-6 stroke-[#637381] hover:stroke-warning cursor-pointer" />
              </>
            }
            title={"Прекращение дела"}
            name={"Прекращение дела"}
            textbutton={"Прекратить"}
            children={
              <>
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                    <div className="w-full">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          Дело прекращено сотрудником департамента?
                        </label>
                        <div className="relative">
                          <CheckboxDefault
                            name={"closeUser"}
                            id={"closeUser"}
                            value={closeType === 1}
                            onChange={() => setCloseType(1)}></CheckboxDefault>
                        </div>
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          Дело прекращено приставами(временно)
                        </label>
                        <div className="relative">
                          <CheckboxDefault
                            name={"closeTime"}
                            id={"closeTime"}
                            value={closeType === 2}
                            onChange={() => setCloseType(2)}></CheckboxDefault>
                        </div>
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName">
                          Дело прекращено приставами(окончательно)
                        </label>
                        <div className="relative">
                          <CheckboxDefault
                            name={"closeExter"}
                            id={"closeExter"}
                            value={closeType === 3}
                            onChange={() => setCloseType(3)}></CheckboxDefault>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            }
            onClickText={"Прекратить"}
            onClickClassName={
              "-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
            }
            onClick={() => handleClick3(1)}></DefaultIconModalWide>
        </div>
      </div>
    </div>
  );
}
