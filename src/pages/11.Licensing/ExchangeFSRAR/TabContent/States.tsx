import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const States = () => {
  return (
    <>
      <div className="">
        Контент вкладки "Состояния"
        <Link to="/licensing/exchange-fsrar/details-request" relative="path">
          <div className="text-primary">*детали запроса*</div>
        </Link>
      </div>
    </>
  );
};

export default States;
