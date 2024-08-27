import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

const IconButtonTest = ({ title }) => {
  return (
    <button title={title}>
      <BuildingOffice2Icon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonTest;
