import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

const IconButtonWarning = ({ title }) => {
  return (
    <button title={title}>
      <ExclamationTriangleIcon className="h-5 w-5 cursor-pointer hover:fill-primary" />
    </button>
  );
};

export default IconButtonWarning;
