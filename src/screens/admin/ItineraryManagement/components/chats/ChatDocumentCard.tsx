import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// query
import { getMessageImageUrl } from "src/Query/Message/message.query";

import { iconPDF, imgUser } from "src/assets/images";
import "../../MessageThread/chat.scss";
import { Strings } from "src/resources";
import { localTimeZoneTimeStamp } from "src/utils/date";

function ChatDocumentCard({ documentData, className, formate }: ChatDocumentCardType) {
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  // get Image
  const { data: imageData } = useQuery({
    queryKey: ["getThread", imageUrl],
    queryFn: () => getMessageImageUrl(imageUrl),
    select: (data) => data?.data,
    enabled: !!imageUrl,
  });

  // get Pdf
  useQuery({
    queryKey: ["getThread", pdfUrl],
    queryFn: () => getMessageImageUrl(pdfUrl),
    select: (data) => data?.data,
    enabled: !!pdfUrl,
    onSuccess: (data) => {
      if (pdfUrl) {
        const link = document.createElement("a");
        link.href = data;
        link.target = "_blank";
        link.download = "document.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  });

  function handleLoadImage(data) {
    setImageUrl(data);
  }

  const handleDownloadPDF = (pdfUrl) => {
    setPdfUrl(pdfUrl);
  };

  function displayTimeAndName(documentData) {
    return `${documentData?.senderName || ''}  ${localTimeZoneTimeStamp(documentData?.createdAt)}`
  }
  return (
    <>
      {formate && (
        <div className="chat-header-day">
          <span>{formate}</span>
        </div>
      )}

      {documentData?.message && (
        <div className={`chat-card-${className}`}>
          <div dangerouslySetInnerHTML={{ __html: documentData?.message }} />
          <div className="chat-time">{displayTimeAndName(documentData)}</div>
        </div>
      )}

      {documentData?.attachments?.map((documents, index) => {
        const fileExtension = documents?.split(".").pop().toLowerCase();
        if (fileExtension === "pdf") {
          return (
            <div key={index} className={`chat-pdf-preview chat-pdf-preview-${className}`}>
              <div>
                <div className="chat-pdf-preview-icon">
                  <img src={iconPDF} alt="" />
                </div>
                <p>{documents?.split("file-")[1]}</p>
                <button onClick={() => handleDownloadPDF(documents)}>Download PDF</button>
              </div>
              <div className="chat-time">{displayTimeAndName(documentData)}</div>
            </div>
          );
        } else if (fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png") {
          return (
            <div key={index} className={`chat-pdf-preview p-2 chat-pdf-preview-${className}`}>
              {imageData ? (
                <>
                  <div className="chat-pdf-preview-img">
                    <img src={imageData} alt="oops" />
                  </div>
                  <div className="chat-time">{displayTimeAndName(documentData)}</div>
                </>
              ) : (
                <>
                  <div className="chat-pdf-preview-icon" onClick={() => handleLoadImage(documents)}>
                    <img src={imgUser} alt="" />
                  </div>
                  <p>{documents?.split("file-")[1]}</p>
                  <div className="chat-time">{displayTimeAndName(documentData)}</div>
                </>
              )}
            </div>
          );
        } else {
          return (
            <div key={index}>
              <p>{Strings.unsupported_file_type}</p>
            </div>
          );
        }
      })}
    </>
  );
}
type ChatDocumentCardType = {
  documentData: {
    message: string;
    createdAt: string;
    attachments: string[];
    senderName?: string;
  };
  className: string;
  formate: string;
}

export default ChatDocumentCard;
