import { DocumentCheckIcon } from "@heroicons/react/24/outline";

const IconButtonDocumentCheck = ({ title }) => {
  return (
    <button title={title}>
      <DocumentCheckIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonDocumentCheck;
