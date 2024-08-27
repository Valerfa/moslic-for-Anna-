import Letter from "../../../../images/icon/icon-letter.svg";

const IconButtonLetter = ({ title }) => {
  return (
    <button title={title}>
      <img src={Letter} className="w-5 h-5"></img>
    </button>
  );
};

export default IconButtonLetter;
