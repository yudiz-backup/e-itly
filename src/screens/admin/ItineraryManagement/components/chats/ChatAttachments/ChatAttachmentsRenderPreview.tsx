import React from "react";
import { SvgClose } from "src/assets/images";

type FilePreviewProps = {
    index: number;
    fileType: string;
    file: File;
    handleRemoveFile: (index: number) => void;
};
const SWITCH_ACTIONS = {
    IMAGE: "image",
};

function ChatAttachmentsRenderPreview({ index, fileType, file, handleRemoveFile }: FilePreviewProps) {
    return (
        <div className={`chat-send-preview-${fileType === SWITCH_ACTIONS.IMAGE ? 'img' : 'document'}`}>
            {fileType === SWITCH_ACTIONS.IMAGE ? (
                <img src={URL.createObjectURL(file)} alt="" />
            ) : (
                <p>{file.name}</p>
            )}
            <button type="button" onClick={() => handleRemoveFile(index)}>
                <SvgClose />
            </button>
        </div>
    );
}

export default ChatAttachmentsRenderPreview;
