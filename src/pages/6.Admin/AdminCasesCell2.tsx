import React, {
  useEffect,
  useState,
} from "react";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import TextInput from "../../components/UI/General/Inputs/TextInput";

// Поля ввода параметров филтров
import DateDefaultInput from "../../components/UI/General/Inputs/DateDefaultInput";
import NumberInput from "../../components/UI/General/Inputs/NumberInput";
import SelectCustom from "../../components/UI/General/Inputs/Select";

//Иконки
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import CheckboxDefault from "../../components/UI/General/Inputs/CheckboxDefault";
import ModalSvg from "./AdminModal2";

registerLocale("ru", ru);

export default function CellRender2(
  params,
  onViewClick,
  onEditClick,
  onDeleteClick,
  uploadDoc,
  fileInput
) {
  const [paidDocList, setPaidDocList] = useState([
    { value: 0, name: "15.13" },
    { value: 1, name: "20.25" },
  ]);

  // view Doc
  const [currentDoc, setCurrentDoc] = useState(null);
  const [currentLinkMic, setCurrentLinkMic] = useState(null);
  const [currentLinkGoo, setCurrentLinkGoo] = useState(null);
  const [currentType, setCurrentType] = useState(null);

  //edit doc
  const [editNumber, setEditNumber] = useState(null);
  const [editDocDate, setEditDocDate] = useState(null);
  const [editEmail, setEditEmail] = useState(null);
  const [editEmailDate, setEditEmailDate] = useState(null);
  const [editPostDate, setEditPostDate] = useState(null);
  const [editNumberMail, setEditNumberMail] = useState(null);
  const [editCreateDate, setEditCreateDate] = useState(null);
  const [editExist, setEditExist] = useState(null);
  const [editWrite, setEditWrite] = useState(null);
  const [editKind, setEditKind] = useState(null);
  const [editDelDate, setEditDelDate] = useState(null);

  // uploadFile
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    if (params.data) {
      setEditNumber(params.data.doc_number);
      setEditDocDate(
        params.data.doc_date === null ? null : new Date(params.data.doc_date)
      );
      setEditEmail(params.data.email);
      setEditEmailDate(
        params.data.send_date === null ? null : new Date(params.data.send_date)
      );
      setEditPostDate(
        params.data.send_date_bypost === null
          ? null
          : new Date(params.data.send_date_bypost)
      );
      setEditNumberMail(params.data.post_number);
      setEditCreateDate(
        params.data.draw_date === null ? null : new Date(params.data.draw_date)
      );
      setEditExist(params.data.inpresence);
      setEditWrite(params.data.issignedbyperson);
      setEditKind(params.data.delivery_mode_name);
      setEditDelDate(
        params.data.delivery_date === null
          ? null
          : new Date(params.data.delivery_date)
      );
    }
  }, [params]);

  const handleClick1 = async (doc_id) => {
    const result = await onViewClick(doc_id);
    console.log(result.slice(5, -1));
    setCurrentDoc(result);
    const url1 = new URL(`https://view.officeapps.live.com/op/embed.aspx?`);
    url1.search = new URLSearchParams({ src: result });
    console.log(url1);
    setCurrentLinkMic(url1.href);
    const url2 = new URL("https://docs.google.com/gview");
    url2.search = new URLSearchParams({ url: result, embedded: true });
    console.log(url2);
    //     setCurrentLinkGoo(`https://docs.google.com/gview?url=${result}&embedded=true`)
    setCurrentLinkGoo(url2.href);
  };

  const handleClick2 = () => {
    onEditClick(
      params.data.act_doc_id,
      editEmail,
      editNumber,
      editDocDate === "" || editDocDate === null
        ? null
        : editDocDate.toISOString().replace("000Z", "300Z"),
      editCreateDate === "" || editCreateDate === null
        ? null
        : editCreateDate.toISOString().replace("000Z", "300Z"),
      editExist,
      editWrite,
      editEmailDate === "" || editEmailDate === null
        ? null
        : editEmailDate.toISOString().replace("000Z", "300Z"),
      editPostDate === "" || editPostDate === null
        ? null
        : editPostDate.toISOString().replace("000Z", "300Z"),
      editNumberMail,
      editKind == null ? null : editKind.value,
      editDelDate === "" || editDelDate === null
        ? null
        : editDelDate.toISOString().replace("000Z", "300Z"),
      new Date().toISOString().slice(0, -4) + "300Z"
    );
  };

  const handleClick22 = async (doc_id) => {
    const result = await onViewClick(doc_id);
    if (result === null) {
      return;
    }
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = result;

    link.setAttribute("download", `${params.data.doc_number}.docx`); //or any other extension
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleClick3 = async (doc_id) => {
    const result = await onDeleteClick(doc_id);
    return result;
  };

  const handleClick4 = async (doc_id) => {
    const result = await uploadDoc(doc_id);
    return result;
  };

  if (params.data === null || params.data === undefined) return <div></div>;
  return (
    <div className="mb-5.5 flex gap-2 p-2">
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
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    ИНН
                  </label>
                  <p className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {params.data.inn}
                  </p>
                </div>
                <div className="w-full sm:w-1/2">
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
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full sm:w-1/3">
                <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    Тип документа
                  </label>
                  <p className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {params.data.act_doc_type_name}
                  </p>
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress">
                    Номер документа
                  </label>
                  <div className="relative">
                    <TextInput
                      type={"text"}
                      value={editNumber}
                      name={"editNumber"}
                      id={"editNumber"}
                      placeholder={"Не заполнено"}
                      onChange={(e) => setEditNumber(e)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3">
                  <DateDefaultInput
                    label={"Дата документа"}
                    selected={editDocDate}
                    placeholder={"dd.MM.yyyy"}
                    onChange={(date) =>
                      setEditDocDate(date)
                    }></DateDefaultInput>
                </div>
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress">
                    Email отправителя
                  </label>
                  <TextInput
                    type={"email"}
                    value={editEmail}
                    name={"editEmail"}
                    id={"editEmail"}
                    placeholder={"Не заполнено"}
                    onChange={(e) => setEditEmail(e)}
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <DateDefaultInput
                    label={"Дата отправки по email"}
                    selected={editEmailDate}
                    placeholder={"dd.MM.yyyy"}
                    onChange={(date) =>
                      setEditEmailDate(date)
                    }></DateDefaultInput>
                </div>
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full sm:w-1/2">
                  <DateDefaultInput
                    label={"Дата отправки заказным письмом"}
                    selected={editPostDate}
                    placeholder={"dd.MM.yyyy"}
                    onChange={(date) =>
                      setEditPostDate(date)
                    }></DateDefaultInput>
                </div>
                <div className="w-full sm:w-1/2">
                  <NumberInput
                    label={"Номер квитанции отправки заказным письмом"}
                    value={editNumberMail}
                    name={"editNumberMail"}
                    id={"editNumberMail"}
                    placeholder={"Не заполнено"}
                    onChange={(e) => setEditNumberMail(e)}
                  />
                </div>
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full sm:w-1/3">
                  <DateDefaultInput
                    label={"Дата оформления"}
                    selected={editCreateDate}
                    placeholder={"dd.MM.yyyy"}
                    onChange={(date) =>
                      setEditCreateDate(date)
                    }></DateDefaultInput>
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    Вид доставки
                  </label>
                  <div className="relative">
                    <SelectCustom
                      options={params.data.kinds}
                      value={editKind}
                      onChange={(e) => setEditKind(e)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3">
                  <DateDefaultInput
                    label={"Дата доставки"}
                    selected={editDelDate}
                    placeholder={"dd.MM.yyyy"}
                    onChange={(date) =>
                      setEditDelDate(date)
                    }></DateDefaultInput>
                </div>
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row text-left">
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    В присутствии
                  </label>
                  <div className="relative">
                    <CheckboxDefault
                      label={"Да"}
                      name={"editExist_1"}
                      id={"editExist_1"}
                      value={editExist === 1}
                      onChange={() =>
                        setEditExist(editExist === 1 ? null : 1)
                      }></CheckboxDefault>
                    <CheckboxDefault
                      label={"Нет"}
                      name={"editExist_2"}
                      id={"editExist_2"}
                      value={editExist === 0}
                      onChange={() =>
                        setEditExist(editExist === 0 ? null : 0)
                      }></CheckboxDefault>
                  </div>
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName">
                    Подписан представителем
                  </label>
                  <div className="relative">
                    <CheckboxDefault
                      label={"Да"}
                      name={"EditWrite_1"}
                      id={"EditWrite_1"}
                      value={editWrite === 1}
                      onChange={() =>
                        setEditWrite(editWrite === 1 ? null : 1)
                      }></CheckboxDefault>
                    <CheckboxDefault
                      label={"Нет"}
                      name={"EditWrite_2"}
                      id={"EditWrite_2"}
                      value={editWrite === 0}
                      onChange={() =>
                        setEditWrite(editWrite === 0 ? null : 0)
                      }></CheckboxDefault>
                  </div>
                </div>
              </div>
            </form>
          </>
        }
        onClick={() => handleClick2()}></ModalSvg>
      <button
        type="button"
        title="Удалить"
        onClick={() => handleClick3(params.data.act_doc_id)}>
        <TrashIcon className="h-6 w-6 stroke-[#637381] hover:stroke-danger cursor-pointer" />
      </button>
      <button
        type="button"
        title="Выгрузить"
        onClick={() => handleClick22(params.data.act_doc_id)}>
        <ArrowUpTrayIcon className="h-6 w-6 stroke-[#637381] hover:stroke-primary cursor-pointer" />
      </button>
      {/*<ModalFetch
        title={"Просмотр"}
        textbutton={"Просмотр"}
        onClickText={"Просмотр"}
        onClick={() => handleClick1(params.data.act_doc_id)}
        onClickClassName={
          "-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
        }
        children={
          <>
            {currentDoc === null ? null : (
              <>
                <DocViewer
                  documents={[
                    {
                      uri: currentDoc,
                      fileName: "Viewer test http//...",
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                />
                <DocViewer
                  documents={[
                    {
                      uri: currentDoc.slice(5, -1),
                      fileName: "Viewer test blob:http//...",
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                />
                <p>{currentLinkMic}</p>
                <iframe
                  src={currentLinkMic}
                  width="100%"
                  height="100%"
                  frameBorder="0">
                  This is an embedded{" "}
                  <a target="_blank" href="http://office.com">
                    Microsoft Office
                  </a>{" "}
                  document, powered by{" "}
                  <a target="_blank" href="http://office.com/webapps">
                    Office Online
                  </a>
                  .
                </iframe>
                <p>{currentLinkGoo}</p>
                <iframe src={currentLinkGoo} frameBorder="0"></iframe>
              </>
            )}
          </>
        }></ModalFetch>*/}
    </div>
  );
}
