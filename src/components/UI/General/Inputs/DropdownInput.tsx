import { ReactNode } from "react";

interface DropdownInputProps {
  leftChildren: ReactNode;
  rightChildren: ReactNode;
}

const DropdownInput = ({ leftChildren, rightChildren }: DropdownInputProps) => {

  return (
    <>
      <div className="relative flex">
        {leftChildren}
        {rightChildren}
      </div>
    </>
  );
};

export default DropdownInput;
