import Filter from "../Buttons/Filter.tsx";

interface CardHeaderProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  buttons: React.ReactNode;
}

const CardHeader = ({ children, onClick, buttons }: CardHeaderProps) => {
  return (
    <div className="font-medium text-black dark:text-white">
        <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
            {children}<br/>
            <div className="flex items-center space-x-4">
                <Filter setIsShowing={onClick}/>
                {buttons}
            </div>
        </div>
    </div>
  );
};

export default CardHeader;
