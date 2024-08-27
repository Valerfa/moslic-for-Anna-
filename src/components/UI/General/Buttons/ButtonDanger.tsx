interface ButtonDangerProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  id: any;
}

const ButtonDanger = ({ children, onClick, id }: ButtonDangerProps) => {
  return (
    <button
      id={id}
      name={id}
      className="rounded-md py-2 px-4 text-sm font-medium md:text-base hover:bg-danger hover:text-white dark:hover:bg-danger bg-danger text-white cursor-pointer"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default ButtonDanger;
