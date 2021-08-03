import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  console.log(boxes, "what are boxes in FaceRecogniton");
  // the isse was the initial state = boxes was an object
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" heigh="auto" />

        {boxes.map((box, id) => {
          return (
            <div
              key={id}
              className="bounding-box"
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
