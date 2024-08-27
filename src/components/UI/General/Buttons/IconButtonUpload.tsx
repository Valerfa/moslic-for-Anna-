import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface IconButtonUploadProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: any;
}

const IconButtonUpload = ({ title, onClick }: IconButtonUploadProps) => {
  return (
    <button onClick={onClick} title={title}>
      <ArrowDownTrayIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonUpload;
