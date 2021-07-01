import { useState, useEffect } from "react"
import axios from "axios"

const useStartProject = (setLoading) => {
  const [projectID, setProjectID] = useState(null)

  const start = () => {
    axios
      .post(
        "http://cloud.openshot.org/projects/",
        {
          name: "Example Project",
          width: 1920,
          height: 1080,
          fps_num: 30,
          fps_den: 1,
          sample_rate: 44100,
          channels: 2,
          channel_layout: 3,
          json: {},
        },
        {
          auth: {
            username: "demo-cloud",
            password: "demo-password",
          },
        }
      )
      .then((res) => {
        setLoading(false)
        setProjectID(res.data.id)
      })
  }

  useEffect(() => {
    start()
  }, [])

  return projectID
}

export default useStartProject
