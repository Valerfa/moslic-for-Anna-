import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface IconButtonDownloadProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: any;
}

const IconButtonDownload = ({ title, onClick }: IconButtonDownloadProps) => {
  return (
    <button onClick={onClick} title={"Выгрузить"}>
      <ArrowUpTrayIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonDownload;
