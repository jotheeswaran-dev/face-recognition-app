import React,{useState} from "react";
import axios from 'axios';
import "./ImageUrl.css";

const ImageUrl = () => {

    const [data, setData] = useState([])
    const [image, setImage] = useState("");

    const [previewImage, setPreviewImage] = useState(false);

    const handlePreview = () => {
        if(image){
            setPreviewImage(!previewImage);
        }
    }

    const handleSubmit = async () => {
            try {
                const instance = axios.create({
                  baseURL: "https://faceapilearning.cognitiveservices.azure.com",
                  timeout: 50000,
                  headers:{
                    "Ocp-Apim-Subscription-Key": "ea88add05f4546258d17da1ded6db304",
                    "Content-Type": "application/json"
                  },
                  params:{
                    returnFaceId: true,
                    returnFaceLandmarks: false,
                    returnFaceAttributes:"mask",
                    recognitionModel:"recognition_04",
                    returnRecognitionModel:false,
                    detectionModel:"detection_03"
                  }
                });
                const response = await instance.post(
                  `/face/v1.0/detect`,
                  {
                    url: image
                  }
                );
                
                setData(response.data);
              }
              catch (err) {
                console.log(err.response.data);
              }
            setImage("");
    }

    return(
        <div>
            {previewImage ? 
                <div>
                    <img src={image} alt="url from user" /><br/>
                    <button type="button" onClick={handlePreview}>BACK</button>
                </div> : 
                <div>
                    <input type="text" placeholder="paste image url here" value={image} onChange={event => setImage(event.target.value)} />
                    <button className={image ? 'preview-btn' : 'disabled-preview-btn'} type="button" onClick={handlePreview}>PREVIEW</button><br/>
                    <button className='submit-btn' type="button" onClick={handleSubmit}>SUBMIT</button>
                </div>
            }
        </div>
    );
}

export default ImageUrl;