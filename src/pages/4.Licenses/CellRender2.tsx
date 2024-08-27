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

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../ag-theme-acmecorp.css";

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

import { variables, AG_GRID_LOCALE_RU, showDate } from "../../variables";
import ButtonDanger from "../../components/UI/General/Buttons/ButtonDanger";
import ButtonPrimary from "../../components/UI/General/Buttons/ButtonPrimary";
import ButtonsSecondary from "../../components/UI/General/Buttons/ButtonsSecondary";
import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import CustomPopover from "../../components/UI/General/Inputs/Popover";

import ModalFetch from "./LicenseModal";

registerLocale("ru", ru);

export default function CellRender2(params) {

  if (params.data === null || params.data === undefined)
    return <div></div>;
  return (
    <>
      <p>Документ: Оформление лицензии (HI#{params.data.docum_type} - Заявка#{params.data.docum_id})</p>
      <p>Серия, Номер, Код: {params.data.seria}, {params.data.nomer_lic}, {params.data.kod}</p>
      <br/>
      <p>Лицензиат: {params.data.lcn_name}</p>
      <p>ИНН: {params.data.lcn_inn}</p>
      <p>Юр. адрес: {params.data.lcn_uaddr}</p>
      <p>Сведетельство о рег.: {params.data.lcn_reg_num} {showDate(params.data.lcn_reg_date)}</p>
      <p>Орган регистрации: {params.data.lcn_reg_name}</p>
      <p>Контакт: {params.data.contacts}</p>
      <br/>
      <p>Срок действия документа: {params.data.startdate} по {params.data.stopdate}</p>
      <p>Виды работ/услуг: {params.data.typetrade}</p>
      <br/>
      <p>Область действия: {params.data.admarea}</p>
      <p>Виды объекта: {params.data.type_object}</p>
      <p>Вид расчета: {params.data.paymode}</p>
      <p>Дата подачи заявки: {params.data.dateapp}</p>
      <p>Дата решения: {params.data.datesol}</p>
      <p>Дата выдачи: {params.data.dateget}</p>
      <p>Дата контрольной проверки: </p>
      <p>Примечение: {params.data.note}</p>
      <p>Документ подписан: {params.data.chief}</p>
    </>
  )
}
