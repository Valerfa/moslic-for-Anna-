interface ModalBodyProps {
  children: React.ReactNode;
}

const ModalBody = ({ children }: ModalBodyProps) => {
  return <div className="p-5">{children}</div>;
};

export default ModalBody;
