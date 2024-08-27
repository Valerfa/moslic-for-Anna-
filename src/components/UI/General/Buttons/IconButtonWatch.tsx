import { EyeIcon } from "@heroicons/react/20/solid";

const IconButtonWatch = ({ title }) => {
  return (
    <button title={title}>
      <EyeIcon className="h-5 w-5 fill-[#637381] hover:fill-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonWatch;
