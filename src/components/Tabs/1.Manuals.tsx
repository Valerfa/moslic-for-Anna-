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

const Manuals = (props) => {
  const [id, setId] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log(props.data);
    if (props.id != id) {
      setData(props.data);
      setId(props.id);
    }
  }, []);

  if (data === null) return null;
  return (
    <>
      <div className="mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <CardWithoutHeader>
          <div>
            <h2 className="text-xl text-primary my-2">
              <b>Производители-импортеры</b>
            </h2>
            <ul>
              {data.companies?.map((comp) => (
                <li>
                  <b>Название</b>: {comp.comp_name} <b>ИНН</b>: {comp.comp_inn}{" "}
                  <b>КПП</b>: {comp.comp_kpp}
                </li>
              ))}
            </ul>
            <h2 className="text-xl text-primary my-2">
              <b>Поставщики</b>
            </h2>
            <ul>
              {data.suppliers?.map((comp) => (
                <li>
                  <b>Название</b>: {comp.supp_name} <b>ИНН</b>: {comp.supp_inn}{" "}
                  <b>КПП</b>: {comp.supp_code_reas_state}
                </li>
              ))}
            </ul>
          </div>
        </CardWithoutHeader>
      </div>
    </>
  );
};

export default Manuals;
