import Filter from "../Buttons/Filter";

interface CardHeaderProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  buttons: React.ReactNode;
}

const CardHeader = ({ onClick, children, buttons }: CardHeaderProps) => {
  return (
    <div className="font-medium text-black dark:text-white">
      <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
        {children}
        <div className="flex items-center space-x-4">
          <Filter setIsShowing={onClick} />
          {buttons}
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
