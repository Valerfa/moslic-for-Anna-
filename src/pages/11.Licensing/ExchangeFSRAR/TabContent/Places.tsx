import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ButtonPrimary from "../../../../components/UI/General/Buttons/ButtonPrimary";
import ModalSimilResults from "../Modals/ModalSimilResults";
import ModalEditKPP from "../Modals/ModalEditKPP";

const Places = () => {
  return (
    <>
      <div className="">
        Контент вкладки "Места"
        <Link to="/licensing/exchange-fsrar/details-request" relative="path">
          <div className="text-primary">*детали запроса*</div>
        </Link>
        <div className="mt-4 flex flex-row gap-4">
          <ButtonPrimary
            children={undefined}
            onClick={function (
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void {
              throw new Error("Function not implemented.");
            }}
            id={undefined}>
            <ModalSimilResults
              name={"Сравнить"}
              title={"Результаты сравнения"}
              textbutton={"Сравнить"}
              icon={undefined}
              children={undefined}
              onClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
              onClickText={"Сравнить"}
              onClickClassName={""}></ModalSimilResults>
          </ButtonPrimary>
          <ButtonPrimary
            children={undefined}
            onClick={function (
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void {
              throw new Error("Function not implemented.");
            }}
            id={undefined}>
            <ModalEditKPP
              name={"Изменить КПП"}
              title={"Коррекция КПП"}
              textbutton={"Изменить КПП"}
              icon={undefined}
              children={undefined}
              onClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
              onClickText={"Изменить"}
              onClickClassName={""}></ModalEditKPP>
          </ButtonPrimary>
        </div>
      </div>
    </>
  );
};

export default Places;
