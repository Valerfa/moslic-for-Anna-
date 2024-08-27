import { PencilSquareIcon } from "@heroicons/react/24/outline";

const IconButtonEdit = ({ title }) => {
  return (
    <button title={title}>
      <PencilSquareIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonEdit;
