interface CardFooterProps {
  page: Number;
  allPages: Number;
  onPageClick: Any;
}

const CardFooter = ({ page, allPages, onPageClick }: CardFooterProps) => {
  const onClick = (p) => {
    onPageClick(page + p);
  };

  return (
    <div className="flex justify-between border-t border-stroke px-5 py-4 dark:border-strokedark"></div>
  );
};

export default CardFooter;
