import React, { createContext } from "react";

const ChatAttachmentsContext = createContext<{
  files: File[];
  setFiles: React.SetStateAction<File[]>;
  fileUId: string;
}>({
  files: [],
  setFiles: () => [],
  fileUId: "",
});
export default ChatAttachmentsContext;
