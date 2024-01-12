import React, { useContext } from "react";
import ChatAttachmentsContext from "./ChatAttachmentsContext";
import { SVGPlus } from "src/assets/images";
import ChatAttachmentsRenderPreview from "./ChatAttachmentsRenderPreview";

type ChatAttachmentsPreviewProps = {
  onRemove?: (updatedFiles: File[]) => void;
  className?: string;
};

function ChatAttachmentsPreview({ onRemove, className = '' }: ChatAttachmentsPreviewProps) {
  const { files, setFiles, fileUId } = useContext(ChatAttachmentsContext);

  function handleRemoveFile(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onRemove) {
      onRemove(updatedFiles);
    }
  }

  return (
    files.length > 0 && (
      <div className={`chat-send-preview ${className}`}>
        {files.map((file, index) => {
          const fileType = file.type.split("/")[0];
          return (
            <ChatAttachmentsRenderPreview
              key={index + fileType}
              index={index}
              fileType={fileType}
              file={file}
              handleRemoveFile={handleRemoveFile}
            />
          )
        })}
        <label htmlFor={"file-upload" + fileUId} className="chat-send-preview-created">
          <SVGPlus />
        </label>
      </div>
    )
  );
}

export default ChatAttachmentsPreview;
