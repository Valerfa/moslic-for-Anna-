import { StopCircleIcon } from "@heroicons/react/24/outline";

const IconButtonStop = ({ title }) => {
  return (
    <button title={title}>
      <StopCircleIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonStop;
