import "../App.css"
import { useState, useEffect } from "react"
import axios from "axios"
import { config } from "../lib/config"

const TimeLine = ({ clipObj, fileObj, projectID }) => {
  const [end, setEnd] = useState(Math.round(clipObj.end) - 1)
  const [length, setLength] = useState([...new Array(end)].map((x, i) => i))
  const [start, setStart] = useState(clipObj.start)
  const [position, setPosition] = useState(clipObj.position)
  const [progress, setProgress] = useState(null)

  const exportUrl = `http://cloud.openshot.org/projects/${projectID}/exports/`
  console.log(exportUrl)

  const positionStyle = {
    width: "15px",
    height: "100px",
    background: "blue",
    margin: "10px",
  }

  useEffect(() => {
    // use this to get progress
    axios.get(exportUrl, config).then((res) => {
      console.log(res.data)
    })

    // if the export worked, would be able to update progress.
  }, [progress])

  const resetParams = () => {
    setEnd(Math.round(clipObj.end))
    setStart(clipObj.start)
    setPosition(clipObj.position)
    setLength([...new Array(Math.round(clipObj.end))].map((x, i) => i))
  }

  const changeStart = () => {
    if (start < end - 2) {
      setStart(start + 1)
      setLength(length.slice(1))
    }
    if (start >= position) {
      setPosition(start + 1)
    }
  }

  const changeEnd = () => {
    if (start + 2 < end) {
      setEnd(end - 1)
      setLength((prev) => {
        prev.splice(end - 1, 1)
        return prev
      })
    }
    if (end - 1 <= position) setPosition(end - 2)
  }

  console.log({
    start,
    end,
    position,
    length,
  })

  const exportVideo = () => {
    // first send patch request
    // export the video (hopefully get the progress in realtime)
    const patchUrl = clipObj.url

    const clipData = {
      file: fileObj.url,
      position,
      start,
      end,
      layer: 1,
      project: `http://cloud.openshot.org/projects/${projectID}/`,
      json: {},
    }
    axios.put(patchUrl, clipData, config).then((res) => {
      // send the export request
      console.log(res.data)
      sendToExportAPI()
    })
  }

  const sendToExportAPI = () => {
    const exportData = {
      export_type: "video",
      video_format: "mp4",
      video_codec: "libx264",
      video_bitrate: 8000000,
      audio_codec: "aac",
      audio_bitrate: 1920000,
      start_frame: 1,
      end_frame: null,
      project: `http://cloud.openshot.org/projects/${projectID}/`,
      webhook: "",
      json: { height: 640, width: 480, fps: { num: 30, den: 1 } },
      status: "pending",
    }

    axios
      .post(exportUrl, exportData, config)
      .then((res) => {
        console.log(res.data)
        if (res.data) {
          setProgress(res.data.results.progress)
        }
      })
      .catch((e) => console.error(e))
  }

  return (
    <section className="outerTimeline mb-4">
      <p>
        Use the position arrows to set the position. Numbers are represented in
        seconds.
      </p>
      <div
        style={{
          display: "flex",
          gap: "4",
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <p>Position</p>
        <button
          onClick={() => {
            if (position > start) setPosition(position - 1)
          }}
          type="button"
          className="btn btn-light m-2"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            if (position < end - 1) setPosition(position + 1)
          }}
          type="button"
          className="btn btn-light"
        >
          {">"}
        </button>
      </div>

      <div className="timelineContainer">
        <button onClick={changeStart} type="button" className="btn btn-info">
          {"<"}
        </button>
        {length &&
          length.map((box) => {
            if (box === position) {
              return (
                <div>
                  <div
                    key={box}
                    className="timelineBox"
                    style={positionStyle}
                  ></div>
                  <p>{position}</p>
                </div>
              )
            }
            return <div key={box} className="timelineBox"></div>
          })}
        <button onClick={changeEnd} type="button" className="btn btn-info">
          {">"}
        </button>
      </div>
      <div className="timelineLabels">
        <div>
          <p>Start</p>
          <p>{start}</p>
        </div>
        <h3>TimeLine</h3>
        <div>
          <p>End</p>
          <p>{end - 1}</p>
        </div>
      </div>
      <div>
        <button
          onClick={resetParams}
          type="button"
          className="m-4 btn btn-danger"
        >
          Reset
        </button>
        <button
          type="button"
          className="m-4 btn btn-success"
          onClick={exportVideo}
        >
          Export Video
        </button>
      </div>
    </section>
  )
}
export default TimeLine
