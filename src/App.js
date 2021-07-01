import { useState } from "react"
import useStartProject from "./hooks/useStartProject"
import ResponsiveEmbed from "react-responsive-embed"
import "./App.css"

import Upload from "./components/Upload"
import TimeLine from "./components/Timeline"
import Loading from "./components/Loading"

function App() {
  const [fileObj, setFileObj] = useState(null)
  const [clipObj, setClipObj] = useState(null)
  const [loading, setLoading] = useState(true)
  const projectID = useStartProject(setLoading)

  if (loading) {
    return <Loading />
  }

  // upload file
  if (!clipObj) {
    return (
      <main className="container">
        <Upload
          id={projectID}
          setFileObj={setFileObj}
          setLoading={setLoading}
          setClipObj={setClipObj}
        />
      </main>
    )
  }

  console.log(clipObj)
  return (
    <main className="container text-center mt-4">
      <h1 className="mb-4">Simple Video Editor</h1>
      <div>
        <TimeLine clipObj={clipObj} fileObj={fileObj} projectID={projectID} />
      </div>
      <div className="m-4">
        <p>
          Below is the original video for reference. When you are finished
          editing the timeline's start, end and position parameters, click
          export to see your edited video.
        </p>
      </div>
      <div className="m-4  mb-5">
        {fileObj.json.media_type === "image" ? (
          <img src={fileObj.media} className="img-fluid" alt="" />
        ) : (
          <ResponsiveEmbed src={fileObj.media} />
        )}
      </div>
    </main>
  )
}

export default App
