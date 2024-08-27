interface CardBodyProps {
  children: React.ReactNode;
}

const CardBody = ({ children }: CardBodyProps) => {
  return (
    <>
      <div className="px-5 py-4">{children}</div>
    </>
  );
};

export default CardBody;
