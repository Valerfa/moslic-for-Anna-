import CardTableSubheader from "../../../../../components/UI/General/CardTableSubheader/CardTableSubheader";

// Кнопки
import SubheaderButtonEdit from "../../../../../components/UI/General/Buttons/SubheaderButtonEdit";
import SubheaderButtonCalendar from "../../../../../components/UI/General/Buttons/SubheaderButtonCalendar";
import SubheaderButtonExportExcel from "../../../../../components/UI/General/Buttons/SubheaderButtonExportExcel";
import SubheaderButtonPrint from "../../../../../components/UI/General/Buttons/SubheaderButtonPrint";
import SubheaderButtonSign from "../../../../../components/UI/General/Buttons/SubheaderButtonSign";

// Карточки
import Card from "../../../../../components/UI/General/Card/Card";
import {AgGridReact} from "ag-grid-react";
import {AG_GRID_LOCALE_RU} from "../../../../../variables.tsx";
import React, {useMemo, forwardRef} from "react";


const Renewal = forwardRef(function Renewal(props, ref) {

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
          <CardTableSubheader
            headerButtons={
                    <button
                        type="button"
                        onClick={() => props.onSearchClick()}
                        className="text-white bg-primary hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        Поиск
                    </button>
                }
            children={
            <>
              <div
                    className="col-span-10"
                    style={{height: "100%", width: "100%"}}
                >
                    <div
                        className="ag-theme-alpine ag-theme-acmecorp flex flex-col"
                        style={{height: 1000, width: "100%"}}
                    >
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
                                                suppressColumnExpandAll: true,
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
            </>}
            buttons={
              <>
                <SubheaderButtonEdit />
                <SubheaderButtonCalendar />
                <SubheaderButtonExportExcel onClick={props.download}/>
                <SubheaderButtonPrint />
                <SubheaderButtonSign />
              </>
            }
          ></CardTableSubheader>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 2xl:gap-7.5">
            <div className="col-span-2">
              <Card name="ФНС Егрюл">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">1</div>
                  </div>
                </form>
              </Card>
            </div>
            <div className="col-span-2">
              <Card name="ФНС Задолженности">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">2</div>
                  </div>
                </form>
              </Card>
            </div>
            <div className="col-span-2">
              <Card name="Росреестр ЕГРП">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">3</div>
                  </div>
                </form>
              </Card>
            </div>
            <div className="col-span-2">
              <Card name="Оплата">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">4</div>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Renewal;
