import CardBody from "./CardBody";
import { ReactNode } from "react";

const CardWithoutHeader = (props: { name: string; children: ReactNode }) => {
  return (
    <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
      <CardBody>{props.children}</CardBody>
    </div>
  );
};

export default CardWithoutHeader;
