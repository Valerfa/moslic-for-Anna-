import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import { ReactNode } from "react";

const CardTable = (props: {
  onFiltersClick: React.MouseEventHandler<HTMLButtonElement>;
  name: ReactNode;
  children: ReactNode;
  buttons: React.ReactNode;
}) => {
  return (
    <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
      <CardHeader
        onClick={props.onFiltersClick}
        children={props.name}
        buttons={props.buttons}
      ></CardHeader>
      <CardBody>{props.children}</CardBody>
    </div>
  );
};

export default CardTable;
