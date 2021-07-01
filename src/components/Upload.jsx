import { useState } from "react"
import axios from "axios"
import { config } from "../lib/config"
import "../App.css"

function Upload({ id, setFileObj, setLoading, setClipObj }) {
  const [selectedFile, setSelectedFile] = useState(null)

  const projectUrl = `http://cloud.openshot.org/projects/${id}/`

  const handleFiles = (files) => {
    setSelectedFile(files[0])
  }
  // ********* Uploads to Cloudinary *********
  const uploadMedia = (e) => {
    e.preventDefault()
    setLoading(true)
    const url = `https://api.cloudinary.com/v1_1/dilldog-industries/upload/`
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("upload_preset", "yd5ugm5d")
    formData.append("tags", "browser_upload")
    axios
      .post(url, formData)
      .then((res) => sendToAPI(res.data.secure_url, selectedFile.name))
      .catch((e) => console.error(e))
  }

  // ********** Creates the file object for openShot ********
  const sendToAPI = (mediaUrl, name) => {
    const url = `http://cloud.openshot.org/projects/${id}/files/`

    const fileData = {
      media: null,
      project: projectUrl,
      json: { url: mediaUrl, name },
    }

    axios
      .post(url, fileData, config)
      .then((res) => {
        createClip(res.data)
        setFileObj(res.data)
        setLoading(false)
      })
      .catch((e) => console.error(e.message))
  }

  // ************** CREATE Clip **********
  const createClip = (fileObj) => {
    const url = `http://cloud.openshot.org/projects/${id}/clips/`

    const clipData = {
      file: fileObj.url,
      position: 0, //init
      start: 0, //init
      end: fileObj.json.duration, //find seconds
      layer: 1,
      project: projectUrl,
      json: {},
    }

    axios
      .post(url, clipData, config)
      .then((res) => {
        setClipObj(res.data)
      })
      .catch((e) => console.error(e))
  }

  return (
    <div
      className="container h-100 d-flex justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="jumbotron my-auto text-center">
        <h1>Choose your video to edit!</h1>
        <p>At this time, we can only accept 10mb or less.</p>
        <form onSubmit={(e) => uploadMedia(e)}>
          {!selectedFile ? (
            <input
              type="file"
              name="media"
              className="custom-file-input"
              onChange={(e) => handleFiles(e.target.files)}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                gap: "10px",
              }}
            >
              <p style={{ color: "purple" }}>{selectedFile.name}</p>
              <button type="submit">Upload</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
export default Upload
