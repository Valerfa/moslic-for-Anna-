interface ModalFooterProps {
  children: React.ReactNode;
}

const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="flex justify-end items-center border-t border-stroke py-2 px-5 dark:border-strokedark gap-3">
      {children}
    </div>
  );
};

export default ModalFooter;
