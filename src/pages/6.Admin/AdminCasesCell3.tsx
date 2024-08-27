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
import ModalFetch from "./AdminModal";
import ModalSvg from "./AdminModal2";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

registerLocale("ru", ru);

export default function CellRender3(params, onEditClick, onDeleteClick) {
  const [paidDocList, setPaidDocList] = useState([
    { value: 0, name: "15.13" },
    { value: 1, name: "20.25" },
  ]);

  // create admin penalty
  const [paidState, setPaidState] = useState(null);
  const [paidAmount, setPaidAmount] = useState(false);
  const [paidKind, setPaidKind] = useState(null);
  const [paidNumber, setPaidNumber] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [paidForce, setPaidForce] = useState(false);

  useEffect(() => {
    if (params.data) {
      setPaidAmount(params.data.paym_sum);
      setPaidKind({
        value: params.data.paymdoc_type_id,
        name: params.data.paymdoc_type_name,
      });
      setPaidNumber(params.data.paymdoc_number);
      setPaidDate(
        params.data.paym_date === null ? null : new Date(params.data.paym_date)
      );
      setPaidForce(params.data.underpressure);
    }
  }, [params]);

  const handleClick = () => {
    onEditClick(
      params.data.admin_file_log_id,
      paidAmount,
      paidDate === "" || paidDate === null
        ? null
        : paidDate.toISOString().replace("000Z", "300Z"),
      paidKind,
      paidNumber,
      paidForce
    );
  };

  if (params.data === null || params.data === undefined) return <div></div>;
  return (
    <div className="flex gap-2 p-2">
      <ModalSvg
        title={"Редактирование параметров документа"}
        svgButton={
          <PencilSquareIcon className="h-6 w-6 stroke-[#637381] hover:stroke-primary cursor-pointer" />
        }
        onClickText={"Редактирование"}
        onClickClassName={
          "-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
        }
        children={
          <>
            <form action="#">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    ИНН
                  </label>
                  <p className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {params.data.inn}
                  </p>
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    Период
                  </label>
                  <p className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {params.data.period_ucode !== null
                      ? `${params.data.period_ucode % 10} квартал ${Number(
                          (params.data.period_ucode -
                            (params.data.period_ucode % 10)) /
                            10
                        ).toFixed(0)}`
                      : "нет"}
                  </p>
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    По статье
                  </label>
                  <p className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {params.data.penalty_mode === 0 ? "15.13" : "20.25"}
                  </p>
                </div>
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full sm:w-1/2">
                  <NumberInput
                    label={"Сумма оплаты"}
                    value={paidAmount}
                    name={"paidAmount"}
                    id={"paidAmount"}
                    placeholder={"Не заполнено"}
                    onChange={(e) => setPaidAmount(e < 0 ? 0 : e)}
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <DateDefaultInput
                    label={"Дата платежа"}
                    selected={paidDate}
                    placeholder={"dd.MM.yyyy"}
                    onChange={(date) => setPaidDate(date)}></DateDefaultInput>
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
                </div>
              </div>
            </form>
          </>
        }
        onClick={() => handleClick()}></ModalSvg>
      <button
        type="button"
        onClick={() => onDeleteClick(params.data.admin_file_log_id)}>
        <TrashIcon className="h-6 w-6 stroke-[#637381] hover:stroke-primary cursor-pointer" />
      </button>
    </div>
  );
}
