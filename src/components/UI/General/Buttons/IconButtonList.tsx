import { DocumentTextIcon } from "@heroicons/react/24/outline";

const IconButtonList = ({ title }) => {
  return (
    <button title={title}>
      <DocumentTextIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonList;
