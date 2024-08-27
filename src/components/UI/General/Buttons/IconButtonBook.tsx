import { BookOpenIcon } from "@heroicons/react/20/solid";

const IconButtonBook = ({ title }) => {
  return (
    <button title={title}>
      <BookOpenIcon className="h-5 w-5 fill-[#637381] hover:fill-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonBook;
