import React from "react";
import "./loader.scss";
const Loader = () => {
  return (
    <div className="loader-block">
      <ul className="loader">
        <li className="center" />
        {new Array(8).fill("").map((_: unknown, index: number) => (
          <li className={`item item-${index + 1}`} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default Loader;
