import { FolderMinusIcon } from "@heroicons/react/24/outline";

const IconButtonFolderMinus = ({ title }) => {
  return (
    <button title={title}>
      <FolderMinusIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonFolderMinus;
