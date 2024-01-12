import React from 'react'
import { VNode } from "preact";
import { iconLogo } from "src/assets/images";
import Heading from "src/components/Heading";
import "./auth-form.scss";

const AuthForm = ({
  title,
  description,
  children,
}: AuthFromProps): VNode<any> => {
  return (
    <div className="auth-form">
      <img src={iconLogo} alt="icon" className="logo img-fluid" />
      <div className="auth-heading">
        {title && (
          <Heading
            title={title}
            className={description ? "active-description" : ""}
          />
        )}
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default AuthForm;
type AuthFromProps = {
  title: string;
  children: any;
  description?: string;
};
