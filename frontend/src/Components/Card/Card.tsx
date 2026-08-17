import React from "react";
import "./Card.css";

type Props = {};

const Card = (props: Props) => {
  return (
    <div className="card">
      <img
        src="https://png.pngtree.com/element_our/sm/20180417/sm_5ad5dd92336fd.png"
        alt="Image"
      />

      <div className="detail">
        {" "}
        <h2>AAPL</h2> <p>$100</p>
        <p className="info">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum,
          itaque!
        </p>
      </div>
    </div>
  );
};

export default Card;
