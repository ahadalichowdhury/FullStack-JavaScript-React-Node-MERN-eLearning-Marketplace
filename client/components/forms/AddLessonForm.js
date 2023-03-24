import {Button, Progress, Tooltip} from "antd"
import {CloseCircleFilled} from "@ant-design/icons";



const AddLessonForm = ({values,
                           progress,
                           setValues,
                           handleAddLesson,
                           handleVideo,
                           uploading,
                           uploadButtonText,
                           handleVideoRemove
})=>{

    return (
        <div className="container pt-3">
            <form onSubmit={handleAddLesson}>
                <input
                    type={"text"}
                    className={"form-control square"}
                    onChange={e=>setValues({...values, title: e.target.value})}
                    value={values.title}
                    placeholder={"title"}
                    autoFocus
                    required
                />
                <textarea
                    name=""
                    cols="7"
                    rows="7"
                    className="form-control mt-3"
                    onChange={e=>setValues({...values, content: e.target.value})}
                    value={values.content}
                    placeholder="content"
                ></textarea>

                <div className="d-flex justify-content-center">
                    <label className="btn btn-dark btn-block text-left mt-3 w-100">
                        {uploadButtonText}
                        <input onChange={handleVideo} type={"file"} accept={"video/*"} hidden/>
                    </label>
                    {!uploading && values.video.Location && (
                        <Tooltip title={"remove"}>
                            <span onClick={handleVideoRemove} className="pt-1 ps-1">
                                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
                            </span>
                        </Tooltip>
                    )}
                </div>
                {progress > 0 && (
                <Progress
                    className="d-flex justify-content-center pt-2"
                    percent={progress}
                    steps={10}
                />
                )}
                <Button
                    onClick={handleAddLesson}
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
export default AddLessonForm;
