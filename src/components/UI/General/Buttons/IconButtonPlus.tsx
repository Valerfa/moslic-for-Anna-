import { PlusIcon } from "@heroicons/react/24/outline";

const IconButtonPlus = () => {
  return (
    <button title="Редактировать">
      <PlusIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonPlus;
