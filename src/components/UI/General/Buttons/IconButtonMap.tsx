import { MapIcon } from "@heroicons/react/24/outline";

const IconButtonMap = ({ title }) => {
  return (
    <button title={title}>
      <MapIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonMap;
