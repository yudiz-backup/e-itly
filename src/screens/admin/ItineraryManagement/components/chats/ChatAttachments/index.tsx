import React, { useEffect, useId, useState } from "react";
import ChatAttachmentsContext from "./ChatAttachmentsContext";
import ButtonChatAttachments from "./ButtonChatAttachments";
import ChatAttachmentsPreview from "./ChatAttachmentsPreview";

type ChatAttachmentsProps = { children: React.ReactNode, resetFiles?: boolean };

function ChatAttachments({ children, resetFiles = false }: ChatAttachmentsProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileUId = useId();

  useEffect(() => {
    if (resetFiles) {
      setFiles([]);
    }
  }, [resetFiles]);

  return <ChatAttachmentsContext.Provider value={{ files, setFiles, fileUId }}>{children}</ChatAttachmentsContext.Provider>;
}

export default Object.assign(ChatAttachments, {
  Button: ButtonChatAttachments,
  Previews: ChatAttachmentsPreview,
});
