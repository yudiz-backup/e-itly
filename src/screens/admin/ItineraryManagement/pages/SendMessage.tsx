
import React, { useState } from "react";
import { Form, Col, Row, FloatingLabel } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// component
import CustomSelect from "src/components/CustomSelect";
import TableHeader from "src/components/TableHeader";
import Button from "src/components/Button";

// query
import { addMessage } from "src/Query/Message/message.mutation";
import { getAgent } from "src/Query/Agent/agent.query";
import queryClient from "src/queryClient";

import { SVGPlus, SvgUpload, SvgClose } from "src/assets/images";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

const switchActions = {
  IMAGE: 'image',
  APPLICATION: 'application',
}

const SendMessage = () => {
  const navigate = useNavigate()

  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const [agentFilter, ] = useState({
    limit: 100,
    search: "",
  });


  // get Agent
  const { data } = useQuery({
    queryKey: ["getAgent", agentFilter],
    queryFn: () => getAgent(agentFilter),
    select: (data) => data?.data,
  });

  //add Thread Message
  const addMessageMutation = useMutation(addMessage, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getThread"]);
      queryClient.invalidateQueries(["getThreadChat"]);
      navigate(allRoutes.messageThread)
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  function handleSelect(e: any) {
    setSelectedOption(e)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderPreview = (file: File, index: number) => {
    const fileType = file.type.split('/')[0];

    switch (fileType) {
      case switchActions.IMAGE:
        return (
          <div key={index} className="chat-send-preview-img">
            <img src={URL.createObjectURL(file)} alt="" />
            <button type="button" onClick={() => handleRemoveFile(index)}>
              <SvgClose />
            </button>
          </div>
        );

      case switchActions.APPLICATION:
        // PDF or Excel
        return (
          <div key={index} className="chat-send-preview-document">
            <p>{file.name}</p>
            <button type="button" onClick={() => handleRemoveFile(index)}>
              <SvgClose />
            </button>
          </div>
        );

      default:
        // Other file types
        return (
          <div key={index} className="chat-send-preview-file">
            <p>{file.name}</p>
            <button type="button" onClick={() => handleRemoveFile(index)}>
              <SvgClose />
            </button>
          </div>
        );
    }
  };

  const handleSend = (e: any) => {
    e.preventDefault();
    if (message?.trim() || files?.length > 0) {

      const newMessage = new FormData();

      newMessage.append('type', 'Thread');
      newMessage.append('agentId', selectedOption?.id);
      newMessage.append('agentName', selectedOption?.name);
      newMessage.append('message', message);

      files.forEach((file) => {
        newMessage.append('attachment', file);
      });
      addMessageMutation.mutate(newMessage)
    }
  };

  return (
    <section className="itinerary-bc">
      <TableHeader title={Strings.send_msg} />
      <Form>
        <Row>
          <Col lg={12}>
            <div className="mb-3">
              <CustomSelect
                onChange={handleSelect}
                options={data?.agents}
                placeholder={Strings.agent_label}
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.id}
              />
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              {" "}
              <FloatingLabel
                controlId="floatingTextarea2"
                label={Strings.enter_msg}
              >
                <Form.Control
                  as="textarea"
                  placeholder={Strings.enter_msg}
                  className='height-152'
                  value={message}
                  onChange={(e: any) =>
                    setMessage(e.target.value)
                  }
                />
              </FloatingLabel>
            </div>
          </Col>
          <Col lg={12}>
            {files.length > 0 && (
              <div className="chat-send-preview position-relative bottom-0">
                {files.map((file, index) => renderPreview(file, index))}
                <label htmlFor="attach-document" className="chat-send-preview-created">
                  <SVGPlus />
                </label>
              </div>
            )}
          </Col>
          <Col lg={12}>
            <div>
              <label htmlFor="attach-document" className="attach-document">
                <span className="upload-button">
                  <SvgUpload />
                </span>
                {Strings.attach_document}
                <input
                  type="file"
                  id="attach-document"
                  accept=".pdf, .doc, .docx, image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </Col>
          <Col md={12}>
            <div className="gap-3 d-flex mt-3">
              <Button
                title={Strings.send}
                variant="primary"
                onClick={handleSend}
              />
              <Link
                to={allRoutes.messageThread}
              >
                <Button title={Strings.cancel} variant="outline" />
              </Link>
            </div>
          </Col>
        </Row>
      </Form>
    </section>
  );
};

export default SendMessage;
