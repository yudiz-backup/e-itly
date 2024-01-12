import React, { useContext } from "react";
import ChatAttachmentsContext from "./ChatAttachmentsContext";
import { SvgUpload } from "src/assets/images";
type ButtonChatAttachmentsProps = {
  icon?: React.ReactNode;
  onChange?: (updatedFiles: File[], e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};
function ButtonChatAttachments({ icon, onChange, className = "" }: ButtonChatAttachmentsProps) {
  const { files, setFiles, fileUId } = useContext(ChatAttachmentsContext);
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles, e);
    }
  }
  return (
    <div className={`chat-buttons d-inline-block ${className}`}>
      <label className="attach" htmlFor={"file-upload" + fileUId}>
        <input type="file" accept=".pdf, .doc, .docx, image/*" id={"file-upload" + fileUId} multiple onChange={handleFileChange} />
        {icon || <SvgUpload />}
      </label>
    </div>
  );
}

export default ButtonChatAttachments;
