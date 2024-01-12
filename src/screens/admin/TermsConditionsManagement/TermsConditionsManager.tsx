import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";

// component
import CustomButton from "src/components/Button";
import { SvgPenToEdit } from "src/assets/images";

// query
import {
  addTermsCondition,
  updateTermsCondition,
} from "src/Query/TermsCondition/termsCondition.mutation";
import { getTermsConditionById } from "src/Query/TermsCondition/termsCondition.query";
import { extractImageSrc } from "src/services/UserService";
import queryClient from "src/queryClient";

import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import { allRoutes } from "src/constants/AllRoutes";
import "./terms-conditions.scss";
import { Strings } from "src/resources";
import { hasError } from "src/services/ApiHelpers";

const TermsConditionsManager = () => {
  const userRef: React.MutableRefObject<boolean | null> = useRef(null);
  const dirtyFieldRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("termsConditionId");

  const [tcFields, setTCFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: "",
      key: "title",
      name: Strings.terms_conditions,
      placeHolder: "Enter TermsCondition Name",
      error: "",
      maxLength: 50,
      rules: "required|name|max:50|min:3",
      label: "TermsCondition Name",
      dataCy: "title",
    },
    {
      type: "text",
      value: "",
      key: "description",
      name: Strings.terms_conditions_editor,
      placeHolder: "Enter TermsCondition Editor",
      error: "",
      maxLength: 50,
      rules: "required|name",
      label: "TermsCondition Editor",
      dataCy: "description",
    },
  ]);

  //  get  T&C By ID
  useQuery({
    queryKey: ["GetTermsAndCondition", id],
    queryFn: () => getTermsConditionById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(0, "value", data?.title);
      updateFields(1, "value", data?.description);
      userRef.current = data?.isActive;
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.termsConditions);
    },
  });

  //add TermsCondition
  const addTermsConditionMutation = useMutation(addTermsCondition, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getTermsCondition"]);
      navigate(allRoutes.termsConditions);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update TermsCondition
  const updateTermsConditionMutation = useMutation(updateTermsCondition, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getTermsCondition"]);
      navigate(allRoutes.termsConditions);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

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

    if (!dirtyFieldRef.current && id) {
      toast.error(Strings.toast_filed);
      return;
    }

    formData.append("title", tcFields[0]?.value);
    formData.append("isActive", "false");

    const editorImageStore = await extractImageSrc(
      tcFields[1]?.value,
      formData,
      files,
      tcFields[1]?.value
    );
    if (editorImageStore?.success) {
      const termsConditionData = {
        title: tcFields[0]?.value,
        description: tcFields[1]?.value,
        isActive: userRef.current !== null && id ? userRef.current : true,
      };

      if (id) {
        updateTermsConditionMutation.mutate({ termsConditionData, id });
      } else {
        addTermsConditionMutation.mutate(termsConditionData);
      }
    }
  };
  return (
    <section className="terms-conditions block-m-add">
      <div className="table-header">
        <div className="block-m-head">
          <div className="editor-wrapper">
            <input
              name="title"
              placeholder={Strings.terms_conditions_placeholder}
              onChange={(e: any) => {
                updateFields(0, "value", e.target?.value)
                if (id) {
                  dirtyFieldRef.current = true
                }
              }}
              data-cy={tcFields[0]?.dataCy}
              value={tcFields[0]?.value}
            />

            <button>
              <SvgPenToEdit size="24" />
            </button>
          </div>
          <div className="d-flex gap-3">
            <CustomButton
              title={Strings.cancel}
              variant="outline"
              onClick={() => {
                navigate(allRoutes.termsConditions);
              }}
              dataCy="cancelTermsConditionBtn"
            />
            <CustomButton
              title={
                id
                  ? Strings.terms_conditions_edit
                  : Strings.terms_conditions_save
              }
              isLoading={addTermsConditionMutation?.isLoading || updateTermsConditionMutation?.isLoading}
              disabled={addTermsConditionMutation?.isLoading || updateTermsConditionMutation?.isLoading}
              variant="primary"
              onClick={handleSubmitTermsCondition}
              dataCy="addEditTermsConditionBtn"
            />
          </div>
          <Form.Control.Feedback type="invalid">
            {tcFields[0]?.error}
          </Form.Control.Feedback>
        </div>
      </div>

      <div data-cy={"description"}>
        <Editor
          onEditorChange={(e, editor) => {
            updateFields(1, "value", e);
            if (id && !editor.isNotDirty) {
              dirtyFieldRef.current = true;
            }
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
        <Form.Control.Feedback type="invalid">
          {tcFields[1]?.error}
        </Form.Control.Feedback>
      </div>
    </section>
  );
};
export default TermsConditionsManager;
