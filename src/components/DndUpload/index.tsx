import { VNode } from "preact";
import React from "react";

const DndUpload = ({ title, image }: DndUploadProps): VNode<any> => {
  return (
    <div className="dashed-wrapper dnd-wrapper-upload-box">
      <div>
        <img src={image} alt={title} />
        <h5>{title}</h5>
      </div>
    </div>
  );
};
type DndUploadProps = {
  title: string;
  image: string;
};
export default DndUpload;
