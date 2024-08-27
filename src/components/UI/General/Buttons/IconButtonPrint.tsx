import { PrinterIcon } from "@heroicons/react/24/outline";

const IconButtonPrint = ({ title }) => {
  return (
    <button title={title}>
      <PrinterIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonPrint;
