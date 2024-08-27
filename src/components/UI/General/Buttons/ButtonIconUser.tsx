import { UserIcon } from "@heroicons/react/24/outline";

const IconButtonUser = ({ title }) => {
  return (
    <button title={title}>
      <UserIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonUser;
