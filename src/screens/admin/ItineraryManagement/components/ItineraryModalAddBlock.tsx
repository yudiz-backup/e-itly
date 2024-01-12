import React, { ChangeEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { VNode } from "preact";

// component
import Button from "src/components/Button";

// query
import { extractImageSrc } from "src/services/UserService";
import { addBlock } from "src/Query/Block/block.mutation";
import { hasError } from "src/services/ApiHelpers";
import queryClient from "src/queryClient";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import UserProfileImage from "../../UserProfile/UserProfileImage";
import { SvgPenToEdit } from "src/assets/images";
import { Strings } from "src/resources";


const ItineraryModalAddBlock = ({
  updateBlockDraggedList,
  blockModalCloseHandler,
  isShowing,
  blockId,
  blockData,
}: ItineraryModalAddBlockProps): VNode<any> => {

  const [blockFields, setBlockFields] = useState<Array<InputFieldType>>([
    {
      type: "file",
      value: "",
      key: "blockImage",
      name: "Block Image",
      placeHolder: "",
      error: "",
      maxLength: 50,
      rules: "",
      dataCy: "blockImage",
      accept: "image/png, image/gif, image/jpeg",
      file: undefined,
    },
    {
      type: "text",
      value: "",
      key: "blockName",
      name: Strings.block_label,
      placeHolder: Strings.block_label,
      error: "",
      maxLength: 50,
      rules: "required|name|max:50",
      label: "Block Name",
      dataCy: "blockName",
    },
    {
      type: "text",
      value: "",
      key: "blockEditor",
      name: Strings.block_editor,
      placeHolder: Strings.block_editor,
      error: "",
      maxLength: 50,
      rules: "required|name",
      label: "Block Editor",
      dataCy: "blockEditor",
    },
  ]);


  useEffect(() => {    
    if (blockId?.dragId) {
      updateFields(1, "value", blockData?.blockName);
      updateFields(0, "value", blockData?.image);
      updateFields(0, "file", blockData?.image);
      updateFields(2, "value", blockData?.description);
    }
  }, [blockId?.dragId])


  //add block
  const addBlockMutation = useMutation(addBlock, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getBlock"]);
      handleCancelBlock()
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      // handleCancelBlock()
    },
  });

  // updateFields code
  function updateFields(index: number, fieldName: string, value: any): void {
    setBlockFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    updateFields(0, "value", URL.createObjectURL(file!));
    updateFields(0, "file", file);
  };


  const files: any = [];
  const formData = new FormData();

  const handleSubmitBlock = async (e: MouseEvent) => {
    e.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(blockFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {
      return;
    }

    formData.append("blockName", blockFields[1]?.value);
    formData.append("isActive", "true");

    const editorImageStore = await extractImageSrc(
      blockFields[2]?.value,
      formData,
      files,
      blockFields[2]?.value
    );
    if (blockFields[0]?.file) {
      formData.append("blockImage", blockFields[0]?.file);
    }
    if (editorImageStore?.success) {

      formData.delete("image");
      formData.append("description", blockFields[2]?.value);

      if (blockId?.dragId) {
        updateBlockDraggedList({ formData, blockId });
        handleCancelBlock()
      } else {
        addBlockMutation.mutate(formData);
      }
    }
  };

  function handleCancelBlock() {
    updateFields(1, "value", "");
    updateFields(0, "value", "");
    updateFields(2, "value", "");
    blockModalCloseHandler()    
  }
  return (
    <Modal
      show={isShowing}
      onHide={handleCancelBlock}
      centered
      size="xl"
      className="itinerary-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{blockId?.dragId ? Strings.edit_block : Strings.block_add_new}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-0">

        <div className="d-flex align-items-end justify-content-between mb-3 flex-wrap">
          <div>

            <UserProfileImage
              handleFileUpload={handleFileUpload}
              accept={blockFields[0]?.accept}
              value={blockFields[0]?.value}
              dataCy={blockFields[0]?.dataCy}
            />

            <Form.Control.Feedback type="invalid">
              {blockFields[0]?.error}
            </Form.Control.Feedback>

            <div className="block-m-head mb-0">
              <div className="editor-wrapper">
                <input
                  name="blockName"
                  placeholder={Strings.block_placeholder}
                  onChange={(e: any) => updateFields(1, "value", e.target?.value)}
                  value={blockFields[1]?.value}
                  data-cy={blockFields[1]?.dataCy}
                />
                <button>
                  <SvgPenToEdit size="24" />
                </button>
              </div>
              <Form.Control.Feedback type="invalid" data-cy="blockNameError">
                {blockFields[1]?.error}
              </Form.Control.Feedback>
            </div>

          </div>

          <div className="d-flex gap-3">
            <Button
              title={Strings.cancel}
              variant="outline"
              onClick={handleCancelBlock}
              dataCy="cancelBlockBtn"
            />
            <Button
              title={Strings.block_save}
              variant="primary"
              onClick={handleSubmitBlock}
              dataCy="addEditBlockBtn"
              isLoading={addBlockMutation?.isLoading}
              disabled={addBlockMutation?.isLoading}
            />
          </div>

        </div>

        <div>
          <Editor
            onEditorChange={(e) => {
              updateFields(2, "value", e);
            }}
            value={blockFields[2]?.value}
            // value={props?.value}
            // initialValue={defaultContent}
            apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
            init={{
              height: 500,
              menubar: "file view insert tools format table",
              browser_spellcheck: true,
              toolbar:
                "undo redo | blocks | quickimage | bold italic blockquote underline | bullist numlist outdent indent ",
              plugins:
                "lists link code preview charmap image media wordcount anchor fullscreen autolink  autosave  codesample directionality emoticons  help hr image  importcss insertdatetime  nonbreaking noneditable pagebreak paste print quickbars searchreplace tabfocus template textpattern visualblocks visualchars table",
              branding: false,
              toolbar_mode: "wrap",
            }}
          />
          <Form.Control.Feedback type="invalid" data-cy="blockEditorError">
            {blockFields[2]?.error}
          </Form.Control.Feedback>
        </div>
      </Modal.Body>
    </Modal>
  );
};
type ItineraryModalAddBlockProps = {
  updateBlockDraggedList: (newBlockDraggedList: any) => void;
  isShowing: boolean;
  blockId: {
    dragId?: string;
  },
  blockData?: any;
  blockModalCloseHandler?: () => void;
};
export default ItineraryModalAddBlock;
