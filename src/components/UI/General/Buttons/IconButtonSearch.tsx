import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const IconButtonSearch = ({ title }) => {
  return (
    <button title={title}>
      <MagnifyingGlassIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonSearch;
