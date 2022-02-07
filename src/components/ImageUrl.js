import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./ImageUrl.css";

const ImageUrl = () => {

  const [data, setData] = useState()
  const [image, setImage] = useState("");

  const [previewImage, setPreviewImage] = useState(false);
  const [outputImage, setOutputImage] = useState(false);

  const faceRectangleStyle = (item) => {
    return ({
      position: 'absolute',
      top: `${item.faceRectangle.top}px`,
      left: `${item.faceRectangle.left}px`,
      width: `${item.faceRectangle.width}px`,
      height: `${item.faceRectangle.height}px`,
      border: '2px solid #BA0B93',
      textAlign: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold'
    });
  }

  useEffect(() => {
    console.log(data);
  }, [data])

  const handlePreview = () => {
    if (image) {
      setPreviewImage(!previewImage);
    }
  }

  const handleSubmit = async () => {
    try {
      const instance = axios.create({
        baseURL: "https://faceapilearning.cognitiveservices.azure.com",
        timeout: 50000,
        headers: {
          "Ocp-Apim-Subscription-Key": "ea88add05f4546258d17da1ded6db304",
          "Content-Type": "application/json"
        },
        params: {
          returnFaceId: true,
          returnFaceLandmarks: false,
          returnFaceAttributes: "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
          detectionModel: "detection_01"
        }
      });
      const response = await instance.post(
        `/face/v1.0/detect`,
        {
          url: image
        }
      );

      setData(response.data);
      setOutputImage(true);
      setPreviewImage(false);
    }
    catch (err) {
      console.log(err.response.data);
      window.alert("An error occured");
    }
  }

  const handleBack = () => {
    setOutputImage(false);
    setImage("");
  }

  return (
    <div>
      {(!outputImage && !previewImage) &&
        <div className="center">
          <div>
            <input type="text" placeholder="paste image url here" value={image} onChange={event => setImage(event.target.value)} />
            <button className={image ? 'preview-btn' : 'disabled-preview-btn'} type="button" onClick={handlePreview}>PREVIEW</button>
          </div>
        </div>
      }
      {(!outputImage && previewImage) &&
        <div className='center'>
          <div>
            <img className='input-img' src={image} alt="url from user" /><br />
            <div className='center'>
              <div>
                <button type="button" onClick={handlePreview}>BACK</button>
                <button className='submit-btn' type="button" onClick={handleSubmit}>SUBMIT</button>
              </div>
            </div>
          </div>
        </div>
      }
      {(outputImage) &&
        <div className="center">
          <div className='output-container'>
            <div className="center">
              <div className="center-output-image">
                <img src={image} alt="output from azure" />
                {data && data.map(item => {
                  return (
                    <div key={item.faceId} style={faceRectangleStyle(item)}>{data.indexOf(item) + 1}</div>
                  )
                })
                }
              </div>
            </div>
            {data &&
              <div className="description">
                {
                  data.map(item => {
                    return (

                      <div key={item.faceId} className="element">
                        <p style={{ textAlign: 'center' }}>{data.indexOf(item) + 1}</p>
                        <li>Gender: {item.faceAttributes.gender}</li>
                        <li>Age: {item.faceAttributes.age}</li>
                        <li>Glasses: {item.faceAttributes.glasses}</li>
                      </div>
                    )
                  })
                }
              </div>
            }
            <div className='center'>
              <button className='back-btn' type="button" onClick={handleBack}>BACK</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default ImageUrl;