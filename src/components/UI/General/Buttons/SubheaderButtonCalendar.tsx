import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface SubheaderButtonCalendarProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SubheaderButtonCalendar = ({ onClick }: SubheaderButtonCalendarProps) => {
  return (
    <button
      onClick={onClick}
      title="Изменить дату"
      className="inline-flex items-center gap-2 text-[#637381] bg-stroke hover:bg-opacity-90 focus:ring-4 font-medium rounded-lg text-sm px-2.5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      <CalendarDaysIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
      Изменить дату
    </button>
  );
};

export default SubheaderButtonCalendar;
