import React,{useState} from "react";
import axios from "axios";
import "./ImageUpload.css";

const ImageUpload = () => {

    const [data, setData] = useState([])

    const [file, setFile] = useState({});
    const [previewImage, setPreviewImage] = useState(false);

    const handleUpload = (event) => {
        setFile(event.target.files[0]);
    }

    const handlePreview = () => {
        if(file.name){
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
                    "Content-Type": "application/octet-stream"
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
                  file
                );
                
                setData(response.data);
              }
              catch (err) {
                console.log(err.response.data);
              }
            setFile({});
    }

    return(
        <div>
            {previewImage ? 
                <div>
                    <img src={URL.createObjectURL(file)} alt="upload by user"/><br/>
                    <button type="button" onClick={handlePreview}>BACK</button><br/>
                </div> :
                <div>
                  <div className='file-input'>
                    <input type="file" id="file" className='file' accept=".jpg,.jpeg,.png" onChange={handleUpload}/>
                    <label for="file">Select file</label>
                  </div>
                  <button className={file.name ? 'preview-btn' : 'disabled-preview-btn'} type="button" onClick={handlePreview}>PREVIEW</button><br/>
                  <button className='submit-btn' type="button" onClick={handleSubmit}>SUBMIT</button>
                </div>
            }
        </div>
    );
}

export default ImageUpload;