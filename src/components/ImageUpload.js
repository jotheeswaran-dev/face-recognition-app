import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ImageUpload.css";

const ImageUpload = () => {

  const [data, setData] = useState([])

  const [file, setFile] = useState({});
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState(false);
  const [outputImage, setOutputImage] = useState(false);

  const imgElement = useRef(null);
  const [imgDimensions, setImgDimensions] = useState({});

  const imgLoad = (width, height) => {
    setImgDimensions({
      width: width,
      height: height
    });
  }

  const backgroundImageStyle = {
    backgroundImage: `url("${image}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  }

  const outputImgBoxStyle = (item) => {
    const faceRectangleProperties = {
      top: Math.round(item.faceRectangle.top * (500 / imgDimensions.height)),
      left: Math.round(item.faceRectangle.left * (500 / imgDimensions.width)),
      width: Math.round(item.faceRectangle.width * (500 / imgDimensions.width)),
      height: Math.round(item.faceRectangle.height * (500 / imgDimensions.height)),
    }
    console.log(faceRectangleProperties);
    return ({
      position: 'relative',
      top: `${faceRectangleProperties.top}px`,
      left: `${faceRectangleProperties.left}px`,
      width: `${faceRectangleProperties.width}px`,
      height: `${faceRectangleProperties.height}px`,
      border: '2px solid #BA0B93'
    });
  }

  useEffect(() => {
    if (file.name) {
      setImage(URL.createObjectURL(file));
    }
    console.log(data)
  }, [file, data])

  const handleUpload = (event) => {
    setFile(event.target.files[0]);
  }

  const handlePreview = () => {
    if (file.name) {
      setPreviewImage(!previewImage);
    }
  }

  const handleSubmit = async () => {
    try {
      const instance = axios.create({
        baseURL: "https://faceapilearning.cognitiveservices.azure.com",
        timeout: 50000,
        headers: {
          "Ocp-Apim-Subscription-Key": "<YOUR-AZURE-SUBSCRIPTION-KEY>",
          "Content-Type": "application/octet-stream"
        },
        params: {
          returnFaceId: true,
          returnFaceLandmarks: false,
          returnFaceAttributes: "mask",
          recognitionModel: "recognition_04",
          returnRecognitionModel: false,
          detectionModel: "detection_03"
        }
      });
      const response = await instance.post(
        `/face/v1.0/detect`,
        file
      );

      setData(response.data);
      setOutputImage(true);
      setPreviewImage(false);
    }
    catch (err) {
      console.log(err.response.data);
    }
    setFile({});
  }

  const handleBack = () => {
    setOutputImage(false);
    setImage("");
  }

  return (
    <div>
      {(!outputImage && !previewImage) &&
        <div>
          <div className='file-input'>
            <input type="file" id="file" className='file' accept=".jpg,.jpeg,.png" onChange={handleUpload} />
            <label htmlFor="file">Select file</label>
          </div>
          <button className={file.name ? 'preview-btn' : 'disabled-preview-btn'} type="button" onClick={handlePreview}>PREVIEW</button>
        </div>
      }
      {(!outputImage && previewImage) &&
        <div>
          <img className='input-img' src={image} ref={imgElement} onLoad={() => imgLoad(imgElement.current.naturalWidth, imgElement.current.naturalHeight)} alt="upload by user" /><br />
          <button type="button" onClick={handlePreview}>BACK</button>
          <button className='submit-btn' type="button" onClick={handleSubmit}>SUBMIT</button>
        </div>
      }
      {outputImage &&
        <div className='output-container'>
          <div className='output-sub-container'>
            <div className='output-img' style={backgroundImageStyle}>
              {data && data.map(item => {
                return (
                  <div key={item.faceId} style={outputImgBoxStyle(item)}></div>
                )
              })}
            </div>
            <button className='back-btn' type="button" onClick={handleBack}>BACK</button>
          </div>
        </div>
      }
    </div>
  );
}

export default ImageUpload;