import { PrinterIcon } from "@heroicons/react/24/outline";

interface SubheaderButtonPrintProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SubheaderButtonPrint = ({ onClick }: SubheaderButtonPrintProps) => {
  return (
    <button
      onClick={onClick}
      title="Отправить на печать"
      className="inline-flex items-center gap-2 text-[#637381] bg-stroke hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-2.5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      <PrinterIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
      Отправить на печать
    </button>
  );
};

export default SubheaderButtonPrint;
