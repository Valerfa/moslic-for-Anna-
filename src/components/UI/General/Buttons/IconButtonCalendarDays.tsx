import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const IconButtonCalendarDays = ({ title }) => {
  return (
    <button title={title}>
      <CalendarDaysIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonCalendarDays;
