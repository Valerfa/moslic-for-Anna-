import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const IconButtonCopy = ({ title }) => {
  return (
    <button title={title}>
      <DocumentDuplicateIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonCopy;
