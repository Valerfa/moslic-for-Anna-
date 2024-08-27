interface CardSubheaderProps {
  buttons: React.ReactNode;
}

const CardSubheader = ({ buttons }: CardSubheaderProps) => {
  return (
    <div className="font-medium text-black dark:text-white">
      <div className="flex items-center justify-left border-b border-stroke px-5 py-2 dark:border-strokedark gap-3">
        {buttons}
      </div>
    </div>
  );
};

export default CardSubheader;
