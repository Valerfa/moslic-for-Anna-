import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const IconButtonQuestion = ({ title }) => {
  return (
    <button title={title}>
      <QuestionMarkCircleIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonQuestion;
