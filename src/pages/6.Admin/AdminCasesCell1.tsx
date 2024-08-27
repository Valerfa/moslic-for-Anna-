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

//Иконки
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

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
  const [paidAmount, setPaidAmount] = useState("");
  const [paidKind, setPaidKind] = useState(null);
  const [paidNumber, setPaidNumber] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [paidForce, setPaidForce] = useState(false);
  const [paidClose, setPaidClose] = useState(false);

  // close/terminate case
  const [closeType, setCloseType] = useState(1);

  const [currentPaidSum, setCurrentPaidSum] = useState(-1);

  useEffect(() => {}, [params]);

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
    if (paidAmount === null || paidAmount === "" || paidAmount === 0) {
      alert("Заполните размер штрафа");
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

  const parsePaidAmount = (e) => {
    console.log(e);
    if (e === "") {
      setPaidAmount("");
      return;
    }
    e = e.match(/^\d*/)[0];
    if (e === "") {
      return;
    }
    e = Number(e);
    e = e < 0 ? 0 : e;
    console.log(e);
    setPaidAmount(e);
  };

  if (params.data === null || params.data === undefined) return <div></div>;
  return (
    <div className="flex flex-col items-start gap-4 p-4 m-2">
      <div className="">
        <CustomPopover
          name={"Операции"}
          children={
            <div className="flex flex-col space-y-1">
              <DefaultModal
                title={"Оформление административного наказания"}
                textbutton={"Оформить административное наказание"}
                onClickText={"Оформить"}
                onClickClassName={
                  "flex items-center hover:bg-primary hover:text-white px-2 py-1"
                }
                children={
                  <>
                    <form action="#">
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                        <div className="w-full">
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
                      </div>

                      {penaltyState === null ? null : (
                        <div>
                          {penaltyState.value !== 0 ? null : (
                            <>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
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
                              </div>
                            </>
                          )}

                          {penaltyAlert ? null : (
                            <>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full">
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
                              </div>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full sm:w-1/2">
                                  <DateDefaultInput
                                    label={
                                      "Крайняя дата оплаты штрафа по постановлению"
                                    }
                                    selected={penaltyDate}
                                    placeholder={"dd.MM.yyyy"}
                                    onChange={(date) =>
                                      setPenaltyDate(date)
                                    }></DateDefaultInput>
                                </div>
                                <div className="w-full sm:w-1/2">
                                  <DateDefaultInput
                                    label={
                                      "Крайняя дата оплаты штрафа по доставке постановления"
                                    }
                                    selected={penaltyDate2}
                                    placeholder={"dd.MM.yyyy"}
                                    onChange={(date) =>
                                      setPenaltyDate2(date)
                                    }></DateDefaultInput>
                                </div>
                              </div>
                              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                                <div className="w-full">
                                  <DateDefaultInput
                                    label={"Дата вступления в силу"}
                                    selected={penaltyStartDate}
                                    placeholder={"dd.MM.yyyy"}
                                    onChange={(date) =>
                                      setPenaltyStartDate(date)
                                    }></DateDefaultInput>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </form>
                  </>
                }
                onClick={() => handleClick()}></DefaultModal>
              <DefaultModal
                title={"Регистрация оплаты по выставленному штрафу"}
                textbutton={"Зарегистрировать оплату по выставленному штрафу"}
                onClickText={"Зарегистировать"}
                onClickClassName={
                  "flex items-center hover:bg-primary hover:text-white px-2 py-1"
                }
                children={
                  <>
                    <form action="#">
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
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
                        </div>
                        <div className="w-full sm:w-1/2">
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
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                        <div className="w-full sm:w-1/2">
                          <TextInput
                            label={"Сумма оплаты"}
                            value={paidAmount}
                            name={"paidAmount"}
                            id={"paidAmount"}
                            placeholder={"Не заполнено"}
                            onChange={(e) => parsePaidAmount(e)}
                          />
                        </div>
                        <div className="w-full sm:w-1/2">
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
                        </div>
                      </div>
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                        <div className="w-full sm:w-1/2">
                          <NumberInput
                            label={"Номер платежного поручения/квитанции"}
                            value={paidNumber}
                            name={"paidNumber"}
                            id={"paidNumber"}
                            placeholder={"Не заполнено"}
                            onChange={(e) => setPaidNumber(e)}
                          />
                        </div>
                        <div className="w-full sm:w-1/2">
                          <DateDefaultInput
                            label={"Дата платежа"}
                            selected={paidDate}
                            placeholder={"dd.MM.yyyy"}
                            onChange={(date) =>
                              setPaidDate(date)
                            }></DateDefaultInput>
                        </div>
                      </div>
                    </form>
                  </>
                }
                onClick={() => handleClick2()}></DefaultModal>
              <button
                className="flex items-center hover:bg-primary hover:text-white px-2 py-1"
                onClick={() => handleClick3(0)}>
                Закрыть дело
              </button>
              <DefaultModal
                title={"Прекращение дела"}
                textbutton={"Прекратить дело"}
                onClickText={"Прекратить"}
                onClickClassName={
                  "flex items-center hover:bg-primary hover:text-white px-2 py-1"
                }
                children={
                  <>
                    <form action="#">
                      <div className="mb-5.5 flex flex-col gap-5.5 text-left">
                        <div>
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
                              onChange={() =>
                                setCloseType(1)
                              }></CheckboxDefault>
                          </div>
                        </div>
                        <div>
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
                              onChange={() =>
                                setCloseType(2)
                              }></CheckboxDefault>
                          </div>
                        </div>
                        <div>
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
                              onChange={() =>
                                setCloseType(3)
                              }></CheckboxDefault>
                          </div>
                        </div>
                      </div>
                    </form>
                  </>
                }
                onClick={() => handleClick3(1)}></DefaultModal>
            </div>
          }
        />
      </div>
      {!params.data.isactive ? (
        params.data.terminate_mode == 0 ? (
          <div title="Дело закрыто">
            {" "}
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
          </div>
        ) : params.data.terminate_mode == 1 ? (
          <div title="Дело прекращено">
            {" "}
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
            </svg>{" "}
          </div>
        ) : (
          <>
            <div title="Дело прекращено приставами">
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
            </div>
          </>
        )
      ) : (
        <div className="" title="Дело возбуждено">
          {" "}
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
        </div>
      )}
      <Link
        to={`documents?inn=${params.data.inn}&period_ucode=${params.data.period_ucode}&iswrong=${params.data.iswrong}`}
        target="_blank">
        <DocumentTextIcon
          title="Сформированные документы"
          className="h-6 w-6 stroke-[#637381] hover:stroke-primary cursor-pointer"
        />
      </Link>
      <Link
        to={`penalties?inn=${params.data.inn}&period_ucode=${params.data.period_ucode}&iswrong=${params.data.iswrong}`}
        target="_blank">
        <BanknotesIcon
          title="Сведения об оплатах по выставленному штрафу"
          className="h-6 w-6 stroke-[#637381] hover:stroke-primary cursor-pointer"
        />
      </Link>
    </div>
  );
}
