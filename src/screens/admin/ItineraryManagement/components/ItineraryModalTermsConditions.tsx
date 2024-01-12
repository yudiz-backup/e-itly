import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { VNode } from "preact";

// component
import Button from "src/components/Button";

// query
import { addTermsCondition } from "src/Query/TermsCondition/termsCondition.mutation";
import { extractImageSrc } from "src/services/UserService";
import { hasError } from "src/services/ApiHelpers";
import queryClient from "src/queryClient";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { SvgPenToEdit } from "src/assets/images";
import { Strings } from "src/resources";

const ItineraryModalTermsConditions = ({
  updateTermsDraggedList,
  TermsModalCloseHandler,
  isShowing,
  termsConditionId,
  termsConditionData,
}: ItineraryModalTermsConditionsProps): VNode<any> => {

  const [tcFields, setTCFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: "",
      key: "title",
      name: Strings.terms_conditions,
      placeHolder: Strings.terms_conditions,
      error: "",
      maxLength: 50,
      rules: "required|name|max:50|min:3",
      label: Strings.terms_conditions,
      dataCy: "title",
    },
    {
      type: "text",
      value: "",
      key: "description",
      name: Strings.terms_conditions_editor,
      placeHolder: Strings.terms_conditions_editor,
      error: "",
      maxLength: 50,
      rules: "required|name",
      label: Strings.terms_conditions_editor,
      dataCy: "description",
    },
  ]);

  useEffect(() => {
    if (termsConditionId?.dragId) {
      updateFields(0, "value", termsConditionData?.title);
      updateFields(1, "value", termsConditionData?.description);
    }
  }, [termsConditionId?.dragId])


  //add TermsCondition
  const addTermsConditionMutation = useMutation(addTermsCondition, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getTermsCondition"]);
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
    setTCFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  const files: any = [];
  const formData = new FormData();
  const handleSubmitTermsCondition = async (e: MouseEvent) => {
    e.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(tcFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {
      return;
    }

    formData.append("title", tcFields[0]?.value);
    formData.append("isActive", "true");

    const editorImageStore = await extractImageSrc(
      tcFields[1]?.value,
      formData,
      files,
      tcFields[1]?.value
    );
    if (editorImageStore?.success) {
      const newTermsConditionData = {
        title: tcFields[0]?.value,
        description: tcFields[1]?.value,
        isActive: true,
      };

      if (termsConditionId?.dragId || termsConditionData) {
        updateTermsDraggedList({ newTermsConditionData, termsConditionId })
        handleCancelBlock()
      } else {
        addTermsConditionMutation.mutate(newTermsConditionData);
      }
    }
  };

  function handleCancelBlock() {
    updateFields(1, "value", "");
    updateFields(0, "value", "");
    TermsModalCloseHandler()
  }

  return (
    <Modal
      show={isShowing}
      onHide={handleCancelBlock}
      centered
      size="xl"
      className="itinerary-modal modal-terms-conditions"
    >
      <Modal.Header closeButton>
        <Modal.Title>{Strings.terms_conditions_add}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-0">

        <div className="d-flex align-items-end justify-content-between mb-3 flex-wrap">
          <div>
            <div className="block-m-head mb-0">
              <div className="editor-wrapper">
                <input
                  name="blockName"
                  placeholder={Strings.terms_conditions_placeholder}
                  onChange={(e: any) => updateFields(0, "value", e.target?.value)}
                  data-cy={tcFields[0]?.dataCy}
                  value={tcFields[0]?.value}
                />
                <button>
                  <SvgPenToEdit size="24" />
                </button>
              </div>
              <Form.Control.Feedback type="invalid" data-cy="blockNameError">
                {tcFields[0]?.error}
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
              title={Strings.terms_conditions_save}
              variant="primary"
              onClick={handleSubmitTermsCondition}
              dataCy="addEditBlockBtn"
            />
          </div>

        </div>

        <div>
          <Editor
            onEditorChange={(e) => {
              updateFields(1, "value", e);
            }}
            value={tcFields[1]?.value}
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
            {tcFields[1]?.error}
          </Form.Control.Feedback>
        </div>
      </Modal.Body>
    </Modal>
  );
};
type ItineraryModalTermsConditionsProps = {
  updateTermsDraggedList: (newBlockDraggedList: any) => void;
  isShowing: boolean;
  termsConditionId: {
    dragId?: string;
  },
  termsConditionData?: any;
  TermsModalCloseHandler?: () => void;
};
export default ItineraryModalTermsConditions;
