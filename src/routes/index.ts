import { lazy } from "react";
import ControlCheckLicense from "../forms/ControlCheckLicense/Index";

const DashboardML = lazy(() => import("../pages/1.Dashboard/Licensing"));
const DashboardMD = lazy(() => import("../pages/1.Dashboard/Declaration"));

//1. Дашборды

//2. Подсистема приема и обработки деклараций
const Declarations = lazy(() => import("../pages/2.Declarations/Declarations"));
const ViewDeclaration = lazy(() => import("../pages/2.Declarations/View"));

//3.Подсистема контроля учета и анализа предоставляемых декларантами данных
// Нарушители
const ReestrViolators = lazy(
  () => import("../pages/5.Violators/ReestrViolators")
);
const HistoryCorrection = lazy(
  () => import("../pages/5.Violators/HistoryCorrection")
);
const ExceptionCorrection = lazy(
  () => import("../pages/5.Violators/ExceptionsCorrection")
);
const Declarants = lazy(() => import("../pages/5.Violators/Declarants"));
const Admin = lazy(() => import("../pages/6.Admin/AdmCases"));
const Documents = lazy(() => import("../pages/6.Admin/Documents"));
const Penalties = lazy(() => import("../pages/6.Admin/Penalties"));

//4. Подсистема хранения и ведения единого реестра лицензий и лицензиатов
const Licenses = lazy(() => import("../pages/4.Licenses/Licenses"));
const Summary = lazy(() => import("../pages/4.Licenses/Summary"));
const ArchiveLicensees = lazy(
  () => import("../pages/4.Licenses/ArchiveLicensees")
);
const ArchiveLicensee = lazy(
  () => import("../pages/4.Licenses/ArchiveLicensee")
);
const ArchiveLicense = lazy(() => import("../pages/4.Licenses/ArchiveLicense"));

//5. Подсистема оперативной аналитики и статистики
const AnalyticStatisticTabs = lazy(
  () => import("../pages/3.AnalyticStatistic/AnalyticStatisticTabs")
);
const DocumentsAll = lazy(() => import("../pages/8.Documents/Documents"));
const Violators = lazy(() => import("../pages/3.AnalyticStatistic/Violators"));
const Intelligence = lazy(
  () => import("../pages/3.AnalyticStatistic/Intelligence")
);
const ViolatorsList = lazy(
  () => import("../pages/3.AnalyticStatistic/ViolatorsList")
);
const IntelligenceList = lazy(
  () => import("../pages/3.AnalyticStatistic/IntelligenceList")
);
const LoadingFsrar = lazy(
  () => import("../pages/3.AnalyticStatistic/LoadingFsrar")
);

// 6.Реестры принятий, реализующих алкогольную продукцию
const Subjects = lazy(() => import("../pages/7.Subjects/Subjects"));
const DetailSubject = lazy(() => import("../pages/7.Subjects/DetailSubject"));

// Главная страница
const Main = lazy(() => import("../pages/Main"));

// 9. Одно окно
const InputCases = lazy(() => import("../pages/9.Okno/InputCases/index"));
const OutputCases = lazy(() => import("../pages/9.Okno/OutputCases/index"));
const OpisList = lazy(() => import("../pages/9.Okno/OpisList/index"));
const Otchety = lazy(() => import("../pages/9.Okno/Otchety/index"));
const RejectInputCases = lazy(
  () => import("../pages/9.Okno/RejectInputCases/index")
);
const RejectOutputCases = lazy(
  () => import("../pages/9.Okno/RejectOutputCases/index")
);
const NotSendedList = lazy(() => import("../pages/9.Okno/NotSendedList/index"));
const DetailRequest = lazy(
  () => import("../pages/9.Okno/NotSendedList/DetailsRequest")
);
const RequestStatus = lazy(() => import("../forms/RequestEdit/RequestStatus"));
const DemandDetails = lazy(() => import("../forms/RequestEdit/DemandDetails"));
const RequestList = lazy(() => import("../pages/9.Okno/RequestsList/index"));
const RequestCurrentDay = lazy(
  () => import("../pages/9.Okno/RequestCurrentDay/index")
);
const RequestView = lazy(() => import("../forms/RequestEdit/RequestView"));
const RequestEdit = lazy(() => import("./../forms/RequestEdit/index"));
const TransmittalList = lazy(
  () => import("../pages/9.Okno/TransmittalList/index")
);

const LicenseList = lazy(() => import("../pages/9.Okno/LicenseList/index"));
const LicenseView = lazy(() => import("../forms/LicenseView/index"));
const SubjectView2 = lazy(
  () => import("../pages/9.Okno/LicenseList/SubjectView")
);
const InspectionView = lazy(() => import("../forms/Inspection/Index"));
const InspectionView2 = lazy(() => import("../forms/Inspection/Index2"));
const OtchetView = lazy(() => import("../pages/9.Okno/Otchety/OtchetView"));
const RequestsList = lazy(() => import("../pages/9.Okno/RequestsList/index"));

// 10. Госуслуги
const Gosuslugi = lazy(
  () => import("../pages/10.Gosuslugi/RequestsJournal/index")
);
const GosuslugiRequest = lazy(
  () => import("../pages/10.Gosuslugi/Requests/index")
);
const GosuslugiRequestFull = lazy(
  () => import("../pages/10.Gosuslugi/Requests/test")
);
const Objects = lazy(() => import("../pages/10.Gosuslugi/Objects/index"));
const DistributionList = lazy(
  () => import("../pages/10.Gosuslugi/DistributionList/index")
);
const RRO = lazy(() => import("../pages/10.Gosuslugi/RRO/index"));
const StopAndNull = lazy(
  () => import("../pages/10.Gosuslugi/StopAndNull/index")
);
const AllowedPersons = lazy(
  () => import("../pages/10.Gosuslugi/AllowedPersons/index")
);
const Active = lazy(() => import("../pages/10.Gosuslugi/Active/index"));
const RequestOfSubject = lazy(
  () => import("../pages/10.Gosuslugi/RequestOfSubject/index")
);
const MailingJournal = lazy(
  () => import("../pages/10.Gosuslugi/MailingJournal/index")
);
const RequestOfObbject = lazy(
  () => import("../pages/10.Gosuslugi/RequestOfObject/index")
);
const RequestPNIP = lazy(
  () => import("../pages/10.Gosuslugi/PequestPNIP/index")
);
const EmailingDocsList = lazy(
  () => import("../pages/10.Gosuslugi/EmailingDocsList/index")
);
const FOIV = lazy(() => import("../pages/10.Gosuslugi/FOIV/index"));
const DetailFOIV = lazy(() => import("../pages/10.Gosuslugi/FOIV/detail"));
const ExcludedObjects = lazy(
  () => import("../pages/10.Gosuslugi/ExcludedObjects/index")
);
const EmailingJournal = lazy(
  () => import("../pages/10.Gosuslugi/EmailingJournal/index")
);
const SignDocList = lazy(
  () => import("../pages/10.Gosuslugi/SignDocList/index")
);
const LicenseStateJournal = lazy(
  () => import("../pages/10.Gosuslugi/LicenseStateJournal/index")
);

// 11. Лицензирование

const ExchangeFSRAR = lazy(
  () => import("../pages/11.Licensing/ExchangeFSRAR/index")
);
const DetailsRequest = lazy(
  () => import("../pages/11.Licensing/ExchangeFSRAR/DetailsRequest")
);
const DetailsLicense = lazy(
  () => import("../pages/11.Licensing/ExchangeFSRAR/DetailsLicense")
);
const CautionRemains = lazy(
  () => import("../pages/11.Licensing/CautionRemains/index")
);
const SubjectView = lazy(() => import("../forms/SubjectView/index"));
const LicenseViewRemains = lazy(
  () => import("../pages/11.Licensing/CautionRemains/LicenseView")
);
const SubjectAdd = lazy(() => import("./../forms/RequestEdit/SubjectAdd"));
const NoticeGoverment = lazy(
  () => import("../pages/11.Licensing/NoticeGoverment/index")
);
const LicenseState = lazy(
  () => import("../pages/11.Licensing/NoticeGoverment/")
);
const StopNoticesList = lazy(
  () => import("../pages/11.Licensing/StopNoticesList/Index")
);
const Requests = lazy(() => import("../pages/11.Licensing/Requests/Index"));
const RequestExpertise = lazy(
  () => import("../pages/11.Licensing/Requests/RequestExpertise")
);
const RequestView2 = lazy(
  () => import("../pages/11.Licensing/Requests/RequestView")
);
const ControlCheckLicense = lazy(
  () => import("../forms/ControlCheckLicense/Index")
);
const CaseMaterial = lazy(() => import("../forms/CaseMaterial/Index"));

const coreRoutes = [
  {
    path: "/gosuslugi/emailing-journal",
    title: "Журнал рассылки документов по заявкам",
    component: EmailingJournal,
  },
  {
    path: "/gosuslugi/not-sended-list",
    title: "Неотправленные статусы",
    component: NotSendedList,
  },
  {
    path: "/gosuslugi/excluded-objects",
    title: "Остатки по исключенным из лицензий объектам",
    component: ExcludedObjects,
  },
  {
    path: "/gosuslugi/foiv/detail",
    title: "детальная таблица ФОИВ",
    component: DetailFOIV,
  },
  {
    path: "/gosuslugi/foiv",
    title: "ФОИВ",
    component: FOIV,
  },
  {
    path: "/gosuslugi/emailing-journal",
    title: "Рассылка предостережений",
    component: EmailingDocsList,
  },
  {
    path: "/gosuslugi/request-list",
    title: "Список запросов",
    component: RequestList,
  },
  {
    path: "/gosuslugi/request-in-rnip",
    title: "Запросы в РНИП",
    component: RequestPNIP,
  },
  {
    path: "/gosuslugi/request-of-object",
    title: "Запросы по объекту",
    component: RequestOfObbject,
  },
  {
    path: "/gosuslugi/mailing-journal",
    title: "Журнал рассылок отказов от МВО",
    component: MailingJournal,
  },
  {
    path: "/gosuslugi/request-of-subject",
    title: "Запросы по субъекту",
    component: RequestOfSubject,
  },
  {
    path: "/gosuslugi/active",
    title: "Действующие",
    component: Active,
  },
  {
    path: "/gosuslugi/allowed-persons",
    title: "Допущенные лица (обследования)",
    component: AllowedPersons,
  },
  {
    path: "/gosuslugi/priem-po-opisi",
    title: "Прием по описи",
    component: RejectInputCases,
  },
  {
    path: "/gosuslugi/stop-and-null",
    title: "Приостановленные и аннулированные",
    component: StopAndNull,
  },
  {
    path: "/gosuslugi/rro",
    title: "Список оформленных РРО",
    component: RRO,
  },
  {
    path: "/gosuslugi/license-state-journal",
    title: "Журнал состояний лицензий",
    component: LicenseStateJournal,
  },
  {
    path: "/gosuslugi/sign-doc-list-leader",
    title: "Находятся на подписи у руководства",
    component: SignDocList,
  },
  {
    path: "/gosuslugi/sign-doc-list",
    title: "Находятся на подписи",
    component: SignDocList,
  },
  {
    path: "/okno/otchety",
    title: "Отчеты",
    component: Otchety,
  },
  {
    path: "/gosuslugi/oper-license-list",
    title: "Оперативный список лицензий",
    component: LicenseList,
  },
  {
    path: "/okno/opis-list",
    title: "Приемо-передаточная опись",
    component: OpisList,
  },
  {
    path: "/okno/reject-output-cases",
    title: "Непринятые исходящие дела",
    component: RejectOutputCases,
  },
  {
    path: "/okno/reject-input-cases",
    title: "Непринятые входящие дела",
    component: RejectInputCases,
  },
  {
    path: "/gosuslugi/output-cases",
    title: "Исходящие дела",
    component: OutputCases,
  },
  {
    path: "/gosuslugi/input-cases",
    title: "Входящие дела",
    component: InputCases,
  },
  {
    path: "/okno/output-cases",
    title: "Исходящие дела",
    component: OutputCases,
  },
  {
    path: "/okno/request-list",
    title: "Список запросов",
    component: RequestList,
  },
  {
    path: "/okno/not-sended-list",
    title: "Неотправленные статусы на МПГУ",
    component: NotSendedList,
  },
  {
    path: "/okno/request-list/details",
    title: "Детальный просмотр",
    component: DetailRequest,
  },
  {
    path: "/okno/status-request",
    title: "Статус заявки",
    component: RequestStatus,
  },
  {
    path: "/okno/demand-details",
    title: "Детали запроса (одно окно)",
    component: DemandDetails,
  },
  {
    path: "/okno/input-cases",
    title: "Входящие дела",
    component: InputCases,
  },
  {
    path: "/gosuslugi/distribution-list",
    title: "Распределение дел по исполнителям",
    component: DistributionList,
  },
  {
    path: "/gosuslugi/objects",
    title: "Объекты",
    component: Objects,
  },
  {
    path: "/okno/license-list",
    title: "Список лицензий",
    component: LicenseList,
  },
  {
    path: "/license-view",
    title: "Просмотр лицензии",
    component: LicenseView,
  },
  {
    path: "/subject-view2",
    title: "Просмотр субъекта второй вариант",
    component: SubjectView2,
  },
  {
    path: "/inspection-view",
    title: "Сведения о проверках (пустая)",
    component: InspectionView,
  },
  {
    path: "/inspection-view-2",
    title: "Сведения о проверках (с контентом)",
    component: InspectionView2,
  },

  {
    path: "/okno/otchet-view",
    title: "Просмотр отчета",
    component: OtchetView,
  },

  {
    path: "/request_list",
    title: "Список запросов",
    component: RequestsList,
  },
  {
    path: "/okno/request-current-day",
    title: "Заявки текущего дня",
    component: RequestCurrentDay,
  },
  {
    path: "/okno/request-edit",
    title: "Редактирование заявки",
    component: RequestEdit,
  },
  {
    path: "/licensing/request-expertise",
    title: "Экспертиза заявки",
    component: RequestExpertise,
  },
  {
    path: "/licensing/request-view",
    title: "Просмотр заявки (управление лицензирования)",
    component: RequestView2,
  },
  {
    path: "/request-view",
    title: "Просмотр заявки",
    component: RequestView,
  },
  {
    path: "/okno/transmittal-list",
    title: "Приемо-передаточная опись",
    component: TransmittalList,
  },
  {
    path: "/gosuslugi/request-jornal",
    title: "Журнал обработки заявок",
    component: Gosuslugi,
  },
  {
    path: "/gosuslugi/request",
    title: "Список заявок",
    component: GosuslugiRequest,
  },
  {
    path: "/gosuslugi/request-full",
    title: "Список заявок тестовый",
    component: GosuslugiRequestFull,
  },

  {
    path: "/licenses",
    title: "Список лицензий",
    component: Licenses,
  },
  {
    path: "/licensesSummary",
    title: "Список лицензий",
    component: Summary,
  },
  {
    path: "/licenseInfo",
    title: "Аналитика и статистика",
    component: AnalyticStatisticTabs,
  },
  {
    path: "/",
    title: "Главная страница",
    component: Main,
  },
  {
    path: "/declarations",
    title: "Список деклараций",
    component: Declarations,
  },
  {
    path: "/declaration",
    title: "Декларация",
    component: ViewDeclaration,
  },
  {
    path: "/reestVioLic",
    title: "Нарушители-лицензиаты",
    component: ReestrViolators,
  },
  {
    path: "/historyCorrection",
    title: "История коррекции реестра нарушителей",
    component: HistoryCorrection,
  },
  {
    path: "/exceptionsCorrection",
    title: "Исключение из реестра нарушителей",
    component: ExceptionCorrection,
  },
  {
    path: "/declarants",
    title: "Сведения о декларантах",
    component: Declarants,
  },
  {
    path: "/adminCases",
    title: "Административные дела",
    component: Admin,
  },
  {
    path: "/adminCases/documents",
    title: "Документы",
    component: Documents,
  },
  {
    path: "/adminCases/penalties",
    title: "Оплаты по штрафам",
    component: Penalties,
  },
  {
    path: "/Subjects",
    title: "Реестр субъектов",
    component: Subjects,
  },
  {
    path: "/Subjects/subject",
    title: "Субъект",
    component: DetailSubject,
  },
  {
    path: "/Documents",
    title: "Субъект",
    component: DocumentsAll,
  },
  {
    path: "/Violators",
    title: "Нарушители представления декларации",
    component: Violators,
  },
  {
    path: "/Intelligence",
    title: "Сведения о представлении деклараций",
    component: Intelligence,
  },
  {
    path: "/ViolatorsList",
    title: "Детализация нарушителей",
    component: ViolatorsList,
  },
  {
    path: "/IntelligenceList",
    title: "Детализация представлений деклараций за квартал",
    component: IntelligenceList,
  },
  {
    path: "/LoadingFsrar",
    title: "Загрузка файлов с отчетами ФСРАР",
    component: LoadingFsrar,
  },
  {
    path: "/ArchiveLicensees",
    title: "Архив лицензий",
    component: ArchiveLicensees,
  },
  {
    path: "/ArchiveLicensee",
    title: "Архив лицензий",
    component: ArchiveLicensee,
  },
  {
    path: "/ArchiveLicense",
    title: "Архив лицензий",
    component: ArchiveLicense,
  },
  {
    path: "/licensing/exchange-fsrar",
    title: "Обмен с ФСРАР",
    component: ExchangeFSRAR,
  },
  {
    path: "/licensing/exchange-fsrar/details-request",
    title: "Детали запроса ФСРАР",
    component: DetailsRequest,
  },
  {
    path: "/licensing/exchange-fsrar/details-license",
    title: "Детальный просмотр лицензии",
    component: DetailsLicense,
  },
  {
    path: "/licensing/caution-remains",
    title: "Предостережения об остатках",
    component: CautionRemains,
  },
  {
    path: "/subject-view",
    title: "Просмотр субъекта",
    component: SubjectView,
  },
  {
    path: "/licensing/caution-remains/license-view",
    title: "Просмотр лицензии",
    component: LicenseViewRemains,
  },
  {
    path: "/licensing/notice-goverment",
    title: "Уведомления в управы и префектуры",
    component: NoticeGoverment,
  },
  {
    path: "/licensing/notice-goverment/license-state",
    title: "Состояние лицензии",
    component: LicenseState,
  },
  {
    path: "/licensing/stop-notices-list",
    title: "Список приостановленных заявок",
    component: StopNoticesList,
  },
  {
    path: "/subject-add",
    title: "Добавление субъекта",
    component: SubjectAdd,
  },
  {
    path: "/control-check-license",
    title: "Контрольная лицензионная проверка",
    component: ControlCheckLicense,
  },
  {
    path: "/case-material",
    title: "Материалы дела",
    component: CaseMaterial,
  },
  {
    path: "/licensing/requests",
    title: "Заявки",
    component: Requests,
  },
];

const routes = [...coreRoutes];
export default routes;
