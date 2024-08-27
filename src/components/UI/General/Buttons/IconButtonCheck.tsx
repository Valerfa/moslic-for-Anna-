import { CheckIcon } from "@heroicons/react/24/outline";

const IconButtonCheck = ({ title }) => {
  return (
    <button title={title}>
      <CheckIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonCheck;
