import { FolderIcon } from "@heroicons/react/24/outline";

const IconButtonFolder = ({ title }) => {
  return (
    <button title={title}>
      <FolderIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonFolder;
