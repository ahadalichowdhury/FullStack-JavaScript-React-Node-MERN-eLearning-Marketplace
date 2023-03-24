import {Button, Progress, Switch, Tooltip} from "antd"
import ReactPlayer from "react-player";



const UpdateLessonForm = (
    {
                            current,
                            setCurrent,
                           progress,
                           handleVideo,
                           uploading,
                           uploadVideoButtonText,
        handleUpdateLesson,
                       })=>{

    return (
        <div className="container pt-3">
            <form onSubmit={handleUpdateLesson}>
                <input
                    type={"text"}
                    className={"form-control square"}
                    onChange={e=>setCurrent({...current, title: e.target.value})}
                    value={current.title}
                    autoFocus
                    required
                />
                <textarea
                    name=""
                    cols="7"
                    rows="7"
                    className="form-control mt-3"
                    onChange={e=>setCurrent({...current, content: e.target.value})}
                    value={current.content}
                ></textarea>

                <div >
                    {!uploading && current.video && current.video.Location && (
                       <div className={"pt-2 d-flex justify-content-center"}>
                            <ReactPlayer url={current.video.Location}
                                         width="100%"
                                         height="100%"
                                         controls
                            />
                       </div>
                    )}
                    <label className="btn btn-dark btn-block text-left mt-3 w-100">
                        {uploadVideoButtonText}
                        <input onChange={handleVideo} type={"file"} accept={"video/*"} hidden/>
                    </label>
                </div>

                {progress > 0 && (
                    <Progress
                        className="d-flex justify-content-center pt-2"
                        percent={progress}
                        steps={10}
                    />
                )}
                <div className="d-flex justify-content-between">
                    <span className={"pt-3 badge text-danger"}>
                        Preview
                    </span>
                    <Switch
                        className={"mt-2 float-end"}
                        disabled={uploading}
                        defaultChecked={current.free_preview}
                        name={"free_preview"}
                        onChange={e=>setCurrent({...current, free_preview: e})}
                    />
                </div>
                <Button
                    onClick={handleUpdateLesson}
                    className="col mt-3"
                    size="large"
                    type="primary"
                    loading={uploading}
                    shape="round"
                >
                    save
                </Button>
            </form>
        </div>
    )
}
export default UpdateLessonForm;
