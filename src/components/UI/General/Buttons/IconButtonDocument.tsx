import { DocumentIcon } from "@heroicons/react/24/outline";

const IconButtonDocument = ({ title }) => {
  return (
    <button title={title}>
      <DocumentIcon className="h-5 w-5 stroke-[#637381] cursor-pointer" />
    </button>
  );
};

export default IconButtonDocument;
