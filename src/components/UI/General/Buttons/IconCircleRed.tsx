import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

const IconCircleRed = ({ title }) => {
  return (
    <button title={title}>
      <ExclamationCircleIcon className="h-5 w-5 cursor-pointer fill-meta-1" />
    </button>
  );
};

export default IconCircleRed;
