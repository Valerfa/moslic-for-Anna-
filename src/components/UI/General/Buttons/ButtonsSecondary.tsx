interface ButtonsSecondaryProps {
  children: React.ReactNode;
}

const ButtonsSecondary = ({ children }: ButtonsSecondaryProps) => {
  return (
    <button className="flex items-center justify-center rounded border border-primary py-2 px-4 text-center text-sm md:text-base font-medium text-primary hover:opacity-90 cursor-pointer">
      {children}
    </button>
  );
};

export default ButtonsSecondary;
