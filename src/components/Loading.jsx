const Loading = () => {
  return (
    <div
      className="container h-100 d-flex justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="jumbotron my-auto text-center">
        <h1>Loading Content</h1>
        <div className="spinner-border" role="status"></div>
        <p>
          "Truth is not only stranger than fiction, it is more interesting."
        </p>
        <b>William Randolph</b>
      </div>
    </div>
  )
}

export default Loading
