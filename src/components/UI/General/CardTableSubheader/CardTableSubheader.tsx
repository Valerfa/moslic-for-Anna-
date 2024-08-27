import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import { ReactNode } from "react";
import CardSubheader from "./CardSubheader";

const CardTableSubheader = (props: {
  name: ReactNode;
  children: ReactNode;
  buttons: React.ReactNode;
  headerButtons: React.ReactNode;
  onFiltersClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="w-full rounded-lg bg-white text-left dark:bg-boxdark">
      <CardHeader
          children={props.name}
          buttons={props.headerButtons}
          onClick={props.onFiltersClick}
      ></CardHeader>
      <CardSubheader buttons={props.buttons}></CardSubheader>
      <CardBody>{props.children}</CardBody>
    </div>
  );
};

export default CardTableSubheader;
