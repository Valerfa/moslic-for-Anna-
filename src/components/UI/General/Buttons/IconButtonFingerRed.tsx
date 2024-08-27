import { FingerPrintIcon } from "@heroicons/react/24/outline";

const IconButtonFingerRed = ({ title }) => {
  return (
    <button title={title}>
      <FingerPrintIcon className="h-5 w-5 cursor-pointer stroke-meta-1" />
    </button>
  );
};

export default IconButtonFingerRed;
