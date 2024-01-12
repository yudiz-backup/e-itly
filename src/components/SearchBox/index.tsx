import { VNode } from "preact";
import { Form, InputGroup } from "react-bootstrap";
import React from "react";
import { iconSearch } from "src/assets/images";

const SearchBox = ({
  placeholder,
  handleSearch = () => { },
}: SearchBoxProps): VNode<any> => {
  return (
    <InputGroup className="search-box">
      <InputGroup.Text id="basic-addon1">
        <img src={iconSearch} alt="searchIcon" />
      </InputGroup.Text>
      <Form.Control
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter") {
            const inputElement = e.target as HTMLInputElement;
            handleSearch(inputElement.value);
          }
        }}
        placeholder={placeholder}
        type="text"
      />
    </InputGroup>
  );
};
type SearchBoxProps = {
  placeholder?: string;
  handleSearch?: (value: string) => void;
};
export default SearchBox;
