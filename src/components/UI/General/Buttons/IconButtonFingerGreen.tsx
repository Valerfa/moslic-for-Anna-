import { FingerPrintIcon } from "@heroicons/react/24/outline";

const IconButtonFingerGreen = ({ title }) => {
  return (
    <button title={title}>
      <FingerPrintIcon className="h-5 w-5 cursor-pointer stroke-meta-3" />
    </button>
  );
};

export default IconButtonFingerGreen;
