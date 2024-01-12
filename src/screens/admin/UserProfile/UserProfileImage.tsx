import React from "react";
import { VNode } from "preact";
import { ChangeEvent } from "react";
import { iconPenToEdit, defaultImage } from "src/assets/images";
import "./user-profile.scss";
const UserProfileImage = ({
  value,
  accept,
  dataCy,
  handleFileUpload = () => { },
}: userProfileImageProps): VNode<any> => {
  return (
    <div className="profile-upload" data-cy={dataCy}>
      <div className="profile-edit">
        <input
          type="file"
          id="imageUpload"
          onChange={handleFileUpload}
          accept={accept}
        />
        <label htmlFor="imageUpload">
          <img src={iconPenToEdit} alt="userProfileImage" />
        </label>
      </div>
      <div className="profile-preview">
        {value ? (
          <div id="imagePreview" style={`background-image: url(${value})`} />
        ) : (
          <div className="defaultImage">
            <div style={`background-image: url(${defaultImage})`} />
          </div>
        )}
      </div>
    </div>
  );
};
type userProfileImageProps = {
  value?: string;
  accept?: string;
  dataCy?: string;
  handleFileUpload?: (event: ChangeEvent<HTMLInputElement>) => void;
};
export default UserProfileImage;
