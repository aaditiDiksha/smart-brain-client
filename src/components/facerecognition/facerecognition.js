import React from 'react';
import './facerecognition.css';



const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      
      <div className="absolute mt5">
        <img id="inputimage" alt="" src={imageUrl} width="500px" heigh="50vh" />
        {box.map((boundingBox,index) => {
          return (
            <div
             key={index}
              className="bounding-box"
              style={{
                top: boundingBox.topRow,
                right: boundingBox.rightCol,
                bottom: boundingBox.bottomRow,
                left: boundingBox.leftCol,
              }}
            ></div>
          );
        })}
      </div>
      <div className="absolute f3">
        <p> {`Number of faces in your image are ${box.length}`}</p>
      </div>
    </div>
  );
}

export default FaceRecognition; 