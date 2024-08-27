import CardBody from "./CardBody";
import { ReactNode } from "react";

const CardFilter = (props: {
  children: ReactNode;
}) => {
  return (
    <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
      <CardBody>{props.children}</CardBody>
    </div>
  );
};

export default CardFilter;
