import { TrashIcon } from "@heroicons/react/24/outline";
interface IconButtonTrashProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: string;
}

const IconButtonTrash = ({ title, onClick }: IconButtonTrashProps) => {
  return (
    <button title={title} onClick={onClick}>
      <TrashIcon className="h-5 w-5 stroke-[#637381] hover:stroke-danger cursor-pointer" />
    </button>
  );
};

export default IconButtonTrash;
