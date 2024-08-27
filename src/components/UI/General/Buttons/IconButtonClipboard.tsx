import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const IconButtonClipboard = ({ title }) => {
  return (
    <button title={title}>
      <ClipboardDocumentCheckIcon className="h-5 w-5 stroke-[#637381] hover:stroke-primary cursor-pointer" />
    </button>
  );
};

export default IconButtonClipboard;
