import { DocumentPlusIcon } from "@heroicons/react/24/outline";

const IconButtonDocumentPlus = ({ title }) => {
  return (
    <button title={title}>
      <DocumentPlusIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonDocumentPlus;
