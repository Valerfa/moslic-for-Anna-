interface ButtonPrimaryProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  id: any;
}

const ButtonPrimary = ({ children, onClick, id }: ButtonPrimaryProps) => {
  return (
    <button
      id={id}
      name={id}
      className="rounded-md py-2 px-4 text-sm font-medium md:text-base text-white bg-primary hover:bg-primary dark:hover:bg-primary hover:bg-opacity-80 text-white cursor-pointer"
      onClick={onClick}
      type="button">
      {children}
    </button>
  );
};

export default ButtonPrimary;
