import React, { useEffect, useRef, useState } from "react";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import ScrollArea from "react-scrollbar";
import Button from "src/components/Button";
import ChatCard from "src/screens/admin/ItineraryManagement/components/chats/ChatCard";
import ChatSendInput from "src/screens/admin/ItineraryManagement/components/chats/ChatSendInput";
import { iconRefresh } from "src/assets/images";
import { Strings } from "src/resources";
import { formatTimestamp, getDateInDDMMYYYYFormat, localTimeZoneTimeStamp } from "src/utils/date";
import { Editor } from "@tinymce/tinymce-react";
import "./service-email-chat-panel.scss";
import { ItineraryScheduleType, ItineraryServiceType, ServiceEmailChatPanelProps } from "src/types/service-schedule";
import ChatAttachments from "src/screens/admin/ItineraryManagement/components/chats/ChatAttachments";

function getSupplierEmailData(
  itinerary: ItineraryScheduleType,
  serviceBookingData: ServiceEmailChatPanelProps["serviceBookingData"],
  serviceData: ItineraryServiceType
) {
  const subject = `${import.meta.env.VITE_APP_NAME}-${itinerary.itineraryName}-${serviceData.serviceName}`;
  const firstParticipant = itinerary.participantList[0];

  const body =
    serviceBookingData?.startDate && serviceBookingData?.startTime
      ? `<html><body>
      Hello ${serviceData.supplierName},
      <br/>
      Could you please confirm the following services for ${firstParticipant}, ${itinerary.participantList.length} passengers:
      <br/><br/>
      Date: ${getDateInDDMMYYYYFormat(serviceBookingData.startDate)}<br/>Time: ${localTimeZoneTimeStamp(serviceBookingData.startTime)}
      <br/><br/>
      InternalCost: ${Strings.euro}${serviceData?.internalCost} 
      <br/>
      Service: ${serviceData.serviceName}
      <br/><br/>
      Thank you.
      </body></html>`
      : "";
  return { subject, body };
}

function ChatLoader() {
  return (
    <div className="scrollarea w-100 d-flex overflow-hidden">
      <Spinner animation="border" role="status" className="border-bottom-0 text-primary m-auto fs-7" />
    </div>
  );
}

function ServiceEmailChatPanel({
  serviceData,
  serviceBookingData,
  messageData,
  eiMessageData,
  refTime,
  itineraryData,
  isServiceBooked = false,
  serviceScheduleMutation,
  handleSupplierRefresh,
  handleScrollSupplierFetch,
  handleSupplierMessageSend,
  handleEiRefresh,
  handleScrollEiFetch,
  handleExternalMessageSend,
}: ServiceEmailChatPanelProps) {
  const editorRef = useRef<any>();
  const [editorFocused, setEditorFocused] = useState(false);
  const { subject } = getSupplierEmailData(itineraryData, serviceBookingData, serviceData);
  const [supplierFiles, setSupplierFiles] = useState([]);
  function handleSendSupplierEmail() {
    if (editorRef.current?.editor) {
      const emailBody = editorRef.current.editor.getContent();
      handleSupplierMessageSend({ email: emailBody, files: supplierFiles, isServiceBooked });
    }
  }

  function handleSupplierFileChange(files) {
    setSupplierFiles(files);
  }

  function handleResetSupplierContent() {
    editorRef.current?.editor?.setContent("");
    setSupplierFiles([]);
  }

  useEffect(() => {
    if (isServiceBooked && editorRef.current.editor) {
      const { body } = getSupplierEmailData(itineraryData, serviceBookingData, serviceData);
      editorRef.current.editor.setContent(body);
      editorRef.current?.editor?.fire("focus");
    } else if (!isServiceBooked) {
      handleResetSupplierContent();
      editorRef.current?.editor?.fire("blur");
    }
  }, [isServiceBooked, serviceData, itineraryData, serviceBookingData]);

  useEffect(() => {
    if (serviceData || serviceScheduleMutation?.isSuccess) {
      // reset content on service tab change
      handleResetSupplierContent();
    }
  }, [serviceData, serviceScheduleMutation?.isSuccess]);

  return (
    <div className="itinerary-chat-system">
      <div className="tabs-list">
        <Tabs
          defaultActiveKey="supplier-chat"
          id="profile-tabs"
          onSelect={(eventKey) => {
            if (eventKey === "eI-chat") {
              handleEiRefresh();
            } else if (eventKey === "supplier-chat") {
              handleSupplierRefresh();
            }
          }}
        >
          <Tab eventKey="supplier-chat" title={Strings.email_supplier}>
            <div className="itinerary-chat-w py-1">
              <div className="py-3 px-4 border-bottom">
                <div className="d-flex justify-content-between align-item-center fw-normal">
                  <table>
                    <tr>
                      <td width={70} className="text-black-50">
                        {Strings.to}:
                      </td>
                      <td className="py-1">{serviceData?.supplierName}</td>
                    </tr>
                    <tr>
                      <td className="text-black-50">{Strings.subject}:</td>
                      <td className="py-1">{subject}</td>
                    </tr>
                  </table>
                  <Button icon={iconRefresh} title="" className="refresh-icon" onClick={handleSupplierRefresh} />
                </div>
              </div>
              <div className="chat-wrapper-container py-3 px-4">
                <ScrollArea onScroll={handleScrollSupplierFetch} smoothScrolling={true}>
                  <div className="flex-column d-flex justify-content-start align-items-end h-100 gap-3">
                    {!messageData && <ChatLoader />}
                    {messageData
                      ?.filter((message) => message.type === "Supplier")
                      ?.map((message, mIndex) => {
                        const formate = formatTimestamp(message.createdAt, refTime);
                        return <ChatCard key={message.createdAt + mIndex} chatData={message} formate={formate} className="w-100" />;
                      })}
                  </div>
                </ScrollArea>
                <ChatAttachments resetFiles={!supplierFiles.length}>
                  <ChatAttachments.Previews onRemove={handleSupplierFileChange} />
                  <div className={`mb-3 email-box ${editorFocused ? "active" : ""}`}>
                    <Editor
                      ref={editorRef}
                      id="emailEditor"
                      onFocus={() => {
                        setEditorFocused(true);
                      }}
                      onBlur={() => {
                        setEditorFocused(false);
                      }}
                      apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
                      toolbar="undo redo | blocks | bold italic blockquote underline | bullist numlist outdent indent"
                      init={{
                        menubar: false,
                        placeholder: Strings.add_comments_placeholder,
                        browser_spellcheck: true,
                        plugins:
                          "lists link code preview charmap wordcount anchor fullscreen autolink  autosave  codesample directionality emoticons  help hr image  importcss insertdatetime  nonbreaking noneditable pagebreak paste print quickbars searchreplace tabfocus template textpattern visualblocks visualchars table",
                        branding: false,
                        toolbar_mode: "wrap",
                      }}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-end">
                    <ChatAttachments.Button className="me-2" onChange={handleSupplierFileChange} />
                    <Button
                      title={Strings.send}
                      variant="primary"
                      size="medium"
                      type="button"
                      onClick={handleSendSupplierEmail}
                      disabled={serviceScheduleMutation?.isLoading}
                      isLoading={serviceScheduleMutation?.isLoading}
                    />
                  </div>
                </ChatAttachments>
              </div>
              {/* } */}
            </div>
          </Tab>
          <Tab eventKey="eI-chat" title={Strings.ei_notes}>
            <div className="itinerary-chat-w py-3 px-4">
              {/* <div className={"d-flex justify-content-between align-item-center"}>
                <Button icon={iconRefresh} title="" className="refresh-icon" onClick={handleEiRefresh} />
              </div> */}
              <div className="chat-wrapper-container">
                <ScrollArea onScroll={handleScrollEiFetch} smoothScrolling={true}>
                  <div className="flex-column d-flex justify-content-start h-100 gap-3 mb-4">
                    {!eiMessageData && <ChatLoader />}
                    {eiMessageData
                      ?.filter((message) => message.type === "external")
                      ?.map((message) => {
                        return <ChatCard key={message.createdAt} chatData={message} />;
                      })}
                  </div>
                </ScrollArea>
                <ChatSendInput showUploadIcon placeholder={Strings.add_comments_placeholder} onSend={handleExternalMessageSend} />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ServiceEmailChatPanel;
