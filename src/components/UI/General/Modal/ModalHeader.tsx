import { DialogTitle } from "@headlessui/react";

interface ModalHeaderProps {
  children: React.ReactNode;
}
const ModalHeader = ({ children }: ModalHeaderProps) => {
  return (
    <DialogTitle as="h3" className="font-medium text-black dark:text-white">
      <div className="flex items-center justify-between border-b border-stroke py-4 px-5 dark:border-strokedark">
        {children}
      </div>
    </DialogTitle>
  );
};

export default ModalHeader;
