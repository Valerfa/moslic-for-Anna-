import { HandRaisedIcon } from "@heroicons/react/24/outline";

const IconButtonHand = ({ title }) => {
  return (
    <button title={title}>
      <HandRaisedIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonHand;
