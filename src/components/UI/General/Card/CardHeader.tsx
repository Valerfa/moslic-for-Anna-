interface CardHeaderProps {
  children: React.ReactNode;
  buttons: React.ReactNode;
}

const CardHeader = ({ children, buttons }: CardHeaderProps) => {
  return (
    <div className="font-medium text-black dark:text-white">
      <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
        <h3>{children}</h3>
        <div className="flex items-center space-x-4">{buttons}</div>
      </div>
    </div>
  );
};

export default CardHeader;
