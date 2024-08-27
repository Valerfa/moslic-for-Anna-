import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

const IconCircleGreen = ({ title }) => {
  return (
    <button title={title}>
      <ExclamationCircleIcon className="h-5 w-5 cursor-pointer fill-meta-3" />
    </button>
  );
};

export default IconCircleGreen;
