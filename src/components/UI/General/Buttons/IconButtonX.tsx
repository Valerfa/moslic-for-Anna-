import { XMarkIcon } from "@heroicons/react/24/outline";

interface IconButtonXProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: string;
}

const IconButtonX = ({ title, onClick }: IconButtonXProps) => {
  return (
    <button title={title} onClick={onClick}>
      <XMarkIcon className="h-5 w-5 stroke-[#637381] hover:stroke-danger cursor-pointer" />
    </button>
  );
};

export default IconButtonX;
