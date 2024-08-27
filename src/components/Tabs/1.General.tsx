import React, { useEffect, useRef, useState, createRef } from "react";
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

import { Tab } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import Breadcrumb from "../UI/General/Breadcrumb";
import CardWithoutHeader from "../UI/General/Card/CardWithoutHeader";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { variables } from "../variables";

const printPeriod = (code) => {
  switch (code) {
    case "3":
      return "1 Квартал";
    case "6":
      return "2 Квартал";
    case "9":
      return "3 Квартал";
    case "0":
      return "4 Квартал";
  }
};

const printForm = (form) => {
  switch (form) {
    case "12":
    case "8":
    case "38":
    case "08":
      return "№8";
    case "11":
    case "7":
    case "07":
    case "37":
      return "№7";
    default:
      return "Другая";
  }
};

const General = (props) => {
  const [id, setId] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log(props.data);
    if (props.id != id) {
      setData(props.data);
      setId(props.id);
    }
  }, [props.id]);

  if (data === null) return null;
  return (
    <>
      <div className="mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <CardWithoutHeader>
          {data.declaration && data.declarant ? (
            <div>
              <p>
                <b>Форма</b>: {printForm(data.declaration.form_code)}
              </p>
              <p>
                <b>ИНН</b>: {data.declarant.inn === null ? "отсутствует" : data.declarant.inn}
              </p>
              <p>
                <b>КПП</b>: {data.declarant.kpp === null ? "отсутствует" : data.declarant.kpp}
              </p>
              <p>
                <b>Вид документа</b>:{" "}
                {data.declaration.type_code === "1"
                  ? "Первичный"
                  : "Корректирующий"}
              </p>
              <p>
                {data.declaration.type_code === "1"
                  ? "0"
                  : `номер корректировки ${data.declaration.corr_number}`}
              </p>
              <p>
                <b>Отчетный период</b>:{" "}
                {printPeriod(data.declaration.period_code)}
              </p>
              <p>
                <b>Отчетный год</b>: {data.declaration.period_year}
              </p>
              <p>
                <b>Адресс</b>:{" "}
              </p>
              <p>
                <b>Почтовый индекс</b>: {data.declarant.post_index === null ? "отсутствует" : data.declarant.post_index}
              </p>
              <p>
                <b>Код региона</b>: {data.declarant.region_code === null ? "отсутствует" : data.declarant.region_code}
              </p>
              <p>
                <b>Район</b>: {data.declarant.area === null ? "отсутствует" : data.declarant.area}
              </p>
              <p>
                <b>Город/населеный пункт</b>:{" "}
                {data.declarant.city === null
                  ? data.declarant.town === null ?
                    "отсутствует"
                    :
                    data.declarant.town
                  : data.declarant.city}
              </p>
              <p>
                <b>Улица</b>: {data.declarant.street === null ? "отсутствует" : data.declarant.street}
              </p>
              <p>
                <b>Дом, корпус</b>: {data.declarant.house === null ? "отсутствует" : data.declarant.house}
                {data.declarant.korp === "" ? null : `, ${data.declarant.korp}`}
              </p>
              <p>
                <b>Телефон</b>: {data.declarant.phone === null ? "отсутствует" : data.declarant.phone}
              </p>
              <p>
                <b>Адресс электронной почты</b>: {data.declarant.email === null ? "отсутствует" : data.declarant.email}
              </p>
              <p>
                <b>Владелец</b>: {data.declarant.director_f === null ? "отсутствует":
                    `${data.declarant.director_f} ${data.declarant.director_i} ${data.declarant.director_o}`
                }
              </p>
              <p>
                <b>Бухгалтер</b>: {data.declarant.bookkeeper_f === null ? "отсутствует":
                    `${data.declarant.bookkeeper_f} ${data.declarant.bookkeeper_i} ${data.declarant.bookkeeper_o}`
                }
              </p>
            </div>
          ) : null}
        </CardWithoutHeader>
      </div>
    </>
  );
};

export default General;
