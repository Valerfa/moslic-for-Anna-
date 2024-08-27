import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import IconButtonWatch from "../../../../components/UI/General/Buttons/IconButtonWatch";

const History = () => {
  return (
    <>
      <div className="">
        Контент вкладки "История"
        <Link to="/licensing/exchange-fsrar/details-request" relative="path">
          <div className="text-primary">*детали запроса*</div>
        </Link>
        <Link to="/licensing/exchange-fsrar/details-license" relative="path">
          <IconButtonWatch title="Детальный просмотр лицензии"></IconButtonWatch>
        </Link>
      </div>
    </>
  );
};

export default History;
