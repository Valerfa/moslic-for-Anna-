import { Cog8ToothIcon } from "@heroicons/react/24/outline";

const IconButtonFix = ({ title }) => {
  return (
    <button title={title}>
      <Cog8ToothIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonFix;
