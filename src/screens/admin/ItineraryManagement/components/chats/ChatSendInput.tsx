import { VNode } from "preact";
import React, { useState } from "react";
import { Form, FormControl, FormGroup } from "react-bootstrap";

// component
import Button from "src/components/Button";

import { Strings } from "src/resources";
import ChatAttachments from "./ChatAttachments";

type ChatSendInputPropsType = {
  placeholder: string;
  showUploadIcon?: boolean;
  onSend: (data: { message: string; files: File[] }) => void;
};

const ChatSendInput: React.FC<ChatSendInputPropsType> = ({ placeholder, showUploadIcon = true, onSend }: ChatSendInputPropsType): VNode<any> => {
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  function handleFileChange(fileList) {
    setFiles(fileList);
  }

  const handleSend = (e: any) => {
    e.preventDefault();
    if (message?.trim() || files?.length > 0) {
      onSend({ message, files });
      setMessage("");
      setFiles([]);
    }
  };

  return (
    <div className="position-relative">
      <Form className="chat-send-input" onSubmit={handleSend}>
        <ChatAttachments resetFiles={!files.length}>
          <ChatAttachments.Previews onRemove={handleFileChange} className="rounded-start" />
          <FormGroup className="form-group bg-white rounded py-1 px-2">
            <FormControl placeholder={placeholder} type="text" value={message} onChange={(e: any) => setMessage(e.target.value)} />
            <div className="chat-buttons">
              {showUploadIcon && (
                <ChatAttachments.Button onChange={handleFileChange} />
              )}
              <Button title={Strings.send} variant="primary" size="medium" type="submit" />
            </div>
          </FormGroup>
        </ChatAttachments>
      </Form>
    </div>
  );
};

export default ChatSendInput;
