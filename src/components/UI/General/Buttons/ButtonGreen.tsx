interface ButtonPrimaryProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  id: any;
}

const ButtonGreen = ({ children, onClick, id }: ButtonPrimaryProps) => {
  return (
    <button
      id={id}
      name={id}
      className="rounded-md py-2 px-4 text-sm font-medium md:text-base text-white bg-meta-3 hover:bg-meta-3 dark:hover:bg-meta-3 text-white cursor-pointer"
      onClick={onClick}
      type="button">
      {children}
    </button>
  );
};

export default ButtonGreen;
