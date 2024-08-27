import { AgGridReact } from "ag-grid-react";

import { AG_GRID_LOCALE_RU } from "../../../../variables.tsx";
import React, { useMemo, forwardRef } from "react";
import CardTable from "../../../../components/UI/General/CardTable/CardTable.tsx";
import IconButtonDownload from "../../../../components/UI/General/Buttons/IconButtonDownload.tsx";
import { Link } from "react-router-dom";
import ButtonPrimary from "../../../../components/UI/General/Buttons/ButtonPrimary.tsx";
import IconButtonWatch from "../../../../components/UI/General/Buttons/IconButtonWatch.tsx";
import IconButtonX from "../../../../components/UI/General/Buttons/IconButtonX.tsx";
import TextInput from "../../../../components/UI/General/Inputs/TextInput.tsx";
import DefaultModal from "../../../../components/UI/General/Modal/DefaultModal.tsx";
import DialogModal from "../../LicenseList/DialogModal2.tsx";
import DefaultModalNarrow from "../../../../components/UI/General/Modal/DefaultModalNarrow.tsx";

const Output = forwardRef(function Output(props, ref) {
  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 170,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardTable
            name="Избранные"
            buttons={
              <>
                <IconButtonDownload
                  onClick={() => Download()}
                  title={"Выгрузить"}
                />
                <button
                  type="button"
                  onClick={() => props.onSearchClick()}
                  className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Поиск
                </button>
                <Link to="/okno/report-view" relative="path">
                  <IconButtonWatch title={"Посмотреть отчет"}></IconButtonWatch>
                </Link>{" "}
                <IconButtonX />
                <ButtonPrimary
                  children={
                    <DefaultModalNarrow
                      title={"Добавление закладки"}
                      textbutton={"Добавить закладку"}
                      children={
                        <TextInput
                          label={"Наименование"}
                          type={""}
                          value={""}
                          name={""}
                          id={""}
                          placeholder={""}
                          defaultvalue={""}
                          onChange={undefined}
                          disable={false}
                        />
                      }
                      onClick={function (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Добавить"}
                      onClickClassName={""}></DefaultModalNarrow>
                  }
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  id={undefined}></ButtonPrimary>
                <ButtonPrimary
                  children={
                    <DefaultModal
                      title={"Выбрать отчет"}
                      textbutton={"Добавить отчет"}
                      children={undefined}
                      onClick={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                      onClickText={"Выбрать"}
                      onClickClassName={""}
                    />
                  }
                  onClick={function (
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  id={undefined}></ButtonPrimary>
              </>
            }>
            <>
              <div className="flex flex-row ag-grid-h">
                <div
                  className="flex flex-col ag-theme-alpine ag-theme-acmecorp flex flex-col"
                  style={{ height: "100%", width: "100%" }}>
                  <AgGridReact
                    ref={ref}
                    columnDefs={props.DataColumns}
                    defaultColDef={defaultColDef}
                    pivotMode={false}
                    autoGroupColumnDef={autoGroupColumnDef}
                    localeText={AG_GRID_LOCALE_RU}
                    rowModelType={"serverSide"}
                    pagination={true}
                    paginationPageSize={100}
                    cacheBlockSize={100}
                    suppressApplyFilter={true}
                    autosize={true}
                    rowSelection={"single"}
                    sideBar={{
                      toolPanels: [
                        {
                          enablePivot: false,
                          id: "columns",
                          labelDefault: "Columns",
                          labelKey: "columns",
                          iconKey: "columns",
                          toolPanel: "agColumnsToolPanel",
                          minWidth: 225,
                          width: 225,
                          toolPanelParams: {
                            suppressRowGroups: true,
                            suppressValues: true,
                            suppressPivots: true,
                            suppressPivotMode: true,
                            suppressColumnFilter: false,
                            suppressColumnSelectAll: false,
                            suppressColumnExpandAll: false,
                          },
                        },
                        {
                          id: "filters",
                          labelDefault: "Filters",
                          labelKey: "filters",
                          iconKey: "filter",
                          toolPanel: "agFiltersToolPanel",
                          minWidth: 180,
                          maxWidth: 400,
                          width: 250,
                        },
                      ],
                      position: "left",
                    }}
                  />
                </div>
              </div>
            </>
          </CardTable>
        </div>
        <div className="col-span-12"></div>
      </div>
    </>
  );
});

export default Output;