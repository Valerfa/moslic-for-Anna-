import { HomeIcon } from "@heroicons/react/24/outline";

const IconButtonHouse = ({ title }) => {
  return (
    <button title={title}>
      <HomeIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonHouse;
