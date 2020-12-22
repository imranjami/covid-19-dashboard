import React from "react";
import { Card, 
        CardContent, 
        Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent >
        <h3 className="infoBox__text">{title}</h3>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
        <h4 className="infoBox__text">{total} Total</h4>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
