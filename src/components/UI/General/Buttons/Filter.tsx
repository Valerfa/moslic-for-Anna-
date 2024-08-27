import { UI } from "@pdftron/webviewer";
import on = UI.Hotkeys.on;

const Filter = ({ setIsShowing }) => {
  const onClick = () => {
    setIsShowing();
  };
  if (setIsShowing === null || setIsShowing === undefined) return null;
  return (
    <button title="Показать/Скрыть фильтры" onClick={onClick}>
      <svg
        className="fill-[#637381] hover:fill-primary cursor-pointer"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3018_1095)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.25 3C8.25 3.41421 7.91421 3.75 7.5 3.75L2.25 3.75C1.83578 3.75 1.5 3.41421 1.5 3C1.5 2.58579 1.83578 2.25 2.25 2.25L7.5 2.25C7.91421 2.25 8.25 2.58579 8.25 3Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.5 3C16.5 3.41421 16.1642 3.75 15.75 3.75L10.5 3.75C10.0858 3.75 9.75 3.41421 9.75 3C9.75 2.58579 10.0858 2.25 10.5 2.25L15.75 2.25C16.1642 2.25 16.5 2.58579 16.5 3Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.75 9C9.75 9.41421 9.41421 9.75 9 9.75L2.25 9.75C1.83579 9.75 1.5 9.41421 1.5 9C1.5 8.58579 1.83579 8.25 2.25 8.25L9 8.25C9.41421 8.25 9.75 8.58579 9.75 9Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.5 9C16.5 9.41421 16.1642 9.75 15.75 9.75L12 9.75C11.5858 9.75 11.25 9.41421 11.25 9C11.25 8.58579 11.5858 8.25 12 8.25L15.75 8.25C16.1642 8.25 16.5 8.58579 16.5 9Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.75 15C6.75 15.4142 6.41421 15.75 6 15.75L2.25 15.75C1.83578 15.75 1.5 15.4142 1.5 15C1.5 14.5858 1.83578 14.25 2.25 14.25L6 14.25C6.41421 14.25 6.75 14.5858 6.75 15Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.5 15C16.5 15.4142 16.1642 15.75 15.75 15.75L9 15.75C8.58579 15.75 8.25 15.4142 8.25 15C8.25 14.5858 8.58579 14.25 9 14.25L15.75 14.25C16.1642 14.25 16.5 14.5858 16.5 15Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.5 -3.27835e-08C7.91421 -1.46777e-08 8.25 0.335786 8.25 0.75L8.25 5.25C8.25 5.66421 7.91421 6 7.5 6C7.08579 6 6.75 5.66421 6.75 5.25L6.75 0.75C6.75 0.335786 7.08579 -5.08894e-08 7.5 -3.27835e-08Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 6C12.4142 6 12.75 6.33579 12.75 6.75L12.75 11.25C12.75 11.6642 12.4142 12 12 12C11.5858 12 11.25 11.6642 11.25 11.25L11.25 6.75C11.25 6.33579 11.5858 6 12 6Z"
            fill=""></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6 12C6.41421 12 6.75 12.3358 6.75 12.75L6.75 17.25C6.75 17.6642 6.41421 18 6 18C5.58579 18 5.25 17.6642 5.25 17.25L5.25 12.75C5.25 12.3358 5.58579 12 6 12Z"
            fill=""></path>
        </g>
        <defs>
          <clipPath id="clip0_3018_1095">
            <rect
              width="18"
              height="18"
              fill="white"
              transform="translate(18) rotate(90)"></rect>
          </clipPath>
        </defs>
      </svg>
    </button>
  );
};

export default Filter;
