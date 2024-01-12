import React, { useRef } from "react";
import { useEffect } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { Strings } from "src/resources";
import { getDateInDDMMYYYYFormat, localTimeZoneTimeStamp } from "src/utils/date";

const Version = ({ versionData, handleChangeVersion, currentVersion }: VersionType) => {
  const versionRef = useRef('')
  useEffect(() => {
    if (currentVersion) {
      versionRef.current = `${Strings.version} ${currentVersion}`
    }
  }, [currentVersion])
  return (
    <div className="version">
      <Dropdown id="dropdown-button-drop-down">
        <Dropdown.Toggle className='r-btn-cls' id="dropdown-basic">
          {versionRef.current || Strings.version + (currentVersion || '')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            versionData?.map((item, index) => {
              return (
                <Form.Group className="form-group" key={index}>
                  <input
                    name="radio"
                    value={index}
                    id={`radio${index}`}
                    type="radio"
                    onChange={() => {
                      handleChangeVersion(item)
                      versionRef.current = `${Strings.version} ${item?.versionNumber}`
                    }}
                  />
                  <label htmlFor={`radio${index}`}>
                    <div>
                      <span>{Strings.version} {item?.versionNumber}</span>
                      <p>
                        {/* 16 Feb, 2023 • 12:47 PM Last edited by <span>Thomas J</span> */}
                        {getDateInDDMMYYYYFormat(item?.timeStamp)} • {localTimeZoneTimeStamp(item?.timeStamp)}
                      </p>
                    </div>
                  </label>
                </Form.Group>
              )
            })
          }

        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

type VersionType = {
  versionData: {
    versionNumber: number;
    timeStamp: string;
  }[];
  currentVersion: string
  handleChangeVersion: (item) => void
}

export default Version;
