import React, { ChangeEvent, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

// component
import CustomButton from "src/components/Button";

// query
import { addBlock, updateBlock } from "src/Query/Block/block.mutation";
import { extractImageSrc } from "src/services/UserService";
import { getBlockById } from "src/Query/Block/block.query";
import queryClient from "src/queryClient";

import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import UserProfileImage from "../UserProfile/UserProfileImage";
import { allRoutes } from "src/constants/AllRoutes";
import { SvgPenToEdit } from "src/assets/images";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";
import "./block-management.scss";

const BlockManager = () => {
  const userRef: React.MutableRefObject<boolean | null> = useRef(null);
  const dirtyFieldRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const blockId = queryParams.get("blockId");

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
      rules: "required|name|max:50|min:3",
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

  //new code
  function updateFields(index: number, fieldName: string, value: any): void {
    setBlockFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  //  get  Block By ID
  useQuery({
    queryKey: ["getBlockById", blockId],
    queryFn: () => getBlockById(blockId as string),
    enabled: !!blockId,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(1, "value", data?.blockName);
      updateFields(0, "value", data?.image);
      updateFields(2, "value", data?.description);
      userRef.current = data?.isActive;
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.blocks);
    },
  });

  //add block
  const addBlockMutation = useMutation(addBlock, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getBlock"]);
      navigate(allRoutes.blocks);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update block
  const updateBlockMutation = useMutation(updateBlock, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getBlock"]);
      navigate(allRoutes.blocks);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    updateFields(0, "value", URL.createObjectURL(file!));
    updateFields(0, "file", file);
    if (blockId) {
      dirtyFieldRef.current = true
    }
  };

  function checkIsActive() {
    const data =
      userRef.current !== null && blockId && userRef.current === true
        ? "true"
        : userRef.current !== null && blockId && userRef.current === false
          ? "false"
          : "true";
    return data;
  }

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

    if (!dirtyFieldRef.current && blockId) {
      toast.error(Strings.toast_filed);
      return;
    }

    formData.append("blockName", blockFields[1]?.value);
    formData.append("isActive", checkIsActive());

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

      if (blockId) {
        updateBlockMutation.mutate({ formData, blockId });
      } else {
        addBlockMutation.mutate(formData);
      }
    }
  };
  return (
    <section className="block-m-add">
      <div className="table-header">
        <div className="block-m-head">

          <div className="editor-wrapper">
            <input
              name="blockName"
              placeholder={Strings.block_placeholder}
              onChange={(e: any) => {
                updateFields(1, "value", e.target?.value)
                if (blockId) {
                  dirtyFieldRef.current = true;
                }
              }}
              value={blockFields[1]?.value}
              data-cy={blockFields[1]?.dataCy}
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
                navigate(allRoutes.blocks);
              }}
              dataCy="cancelBlockBtn"
            />
            <CustomButton
              title={blockId ? Strings.block_edit : Strings.block_save}
              variant="primary"
              onClick={handleSubmitBlock}
              dataCy="addEditBlockBtn"
              isLoading={addBlockMutation?.isLoading || updateBlockMutation?.isLoading}
              disabled={addBlockMutation?.isLoading || updateBlockMutation?.isLoading}
            />
          </div>

          <Form.Control.Feedback type="invalid" data-cy="blockNameError">
            {blockFields[1]?.error}
          </Form.Control.Feedback>

        </div>
      </div>

      <UserProfileImage
        handleFileUpload={handleFileUpload}
        accept={blockFields[0]?.accept}
        value={blockFields[0]?.value}
        dataCy={blockFields[0]?.dataCy}
      />

      <Form.Control.Feedback type="invalid">
        {blockFields[0]?.error}
      </Form.Control.Feedback>

      <div>
        <Editor
          onEditorChange={(e, editor) => {
            updateFields(2, "value", e);
            if (blockId && !editor.isNotDirty) {
              dirtyFieldRef.current = true;
            }
          }}
          value={blockFields[2]?.value}
          // value={props?.value}
          // initialValue={defaultContent}
          apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
          init={{
            height: 500,
            menubar: "file view insert tools format table",
            browser_spellcheck: true,
            toolbar: "undo redo | blocks | quickimage | bold italic blockquote underline | bullist numlist outdent indent ",
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
    </section>
  );
};
export default BlockManager;
