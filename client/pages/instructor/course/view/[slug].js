import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "@/components/routes/InstrustorRoute";
import axios from "axios";
import {Avatar, Button, Modal, Tooltip, List} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  QuestionOutlined,
  UploadOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown"
import AddLessonForm from "@/components/forms/AddLessonForm";
import {toast} from "react-toastify";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);

  const [values, setValues]= useState({
    title: "",
    content: "",
    video: {}
  })
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video")
  const [progress, setProgress] = useState(0);

  //student count
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;


  useEffect(() => {
    loadCourse();
  }, [slug]);
  const loadCourse = async () => {
    const { data } = await axios.get(`/api/v1/course/${slug}`);
    setCourse(data);
  };

  //student count
  useEffect(()=>{
    course && studentCount();
  },[course])

  const studentCount = async () => {
    const {data} = await axios.post(`/api/v1/instructor/students-count`,{
        courseId: course._id,
    });
    console.log("Student Count",data);
    setStudents(data.length)
  }
  //function for add lesson
  const handleAddLesson =async (e)=>{
    e.preventDefault()
    // console.log(values);
  try {
    const {data} = await axios.post(`/api/v1/course/lesson/${slug}/${course.instructor._id}`,values)
    //console.log(data)
    setValues({...values, title: "", content: "", video: {}})
    setVisible(false);
    setUploadButtonText("Upload Video")
    setCourse(data);
    toast("lesson Added")

    }catch (e) {
    console.log(e);
    toast("Leasson Failed")

  }
  }


//handle video upload
  const handleVideo=async (e)=>{
   try {
     const file= e.target.files[0];
     setUploadButtonText(file.name);
     setUploading(true);

     const videoData = new FormData()
     videoData.append("video", file)
     //save progress bar and send video as form data to backend
     const {data} = await axios.post(`/api/v1/course/video-upload/${course.instructor._id}`, videoData, {
          onUploadProgress: (e)=>{
            setProgress(Math.round((100 * e.loaded) / e.total));
          }
     })
     //one response is received
     console.log(data)
     setValues({...values, video: data});
     setUploading(false);
   }catch (e) {
     console.log(e);
     setUploading(false);
     toast("Video upload failed")
   }
    // console.log("handle video upload")
  }

  const handleVideoRemove= async()=>{
    // console.log("handle remove video")
    // setUploading(true)
    try {
      const {data}= await axios.post(`/api/v1/course/remove-video/${course.instructor._id}`, values.video)
      // console.log(data)
      setValues({...values, video: ""})
      setUploading(false)
      setUploadButtonText("Upload another video")
    }catch (e) {
      console.log(e);
      setUploading(false)
      toast(e.message)
    }
  }
  const handlePublish = async (e, courseId) => {
      try{
        const answer = window.confirm(
            "Once you publish the course it will be live in the marketplace"
        );
        if(!answer) return;
        const {data} = await axios.put(`/api/v1/course/publish/${courseId}`)
        setCourse(data);
        toast("Course is now live in the marketplace")
      }catch (e) {
        toast("Course publish failed. Try again")
      }
  }

  const handleUnPublish = async (e, courseId) => {
    try{
        const answer = window.confirm(
            "Once you UnPublish the course it will not available for user to live in the marketplace for enroll"
        );
        if(!answer) return;
        const {data} = await axios.put(`/api/v1/course/unpublish/${courseId}`)
        setCourse(data);
      toast("Course is now UnPublished")
    }catch (e) {
      toast("Course publish failed. Try again")
    }
  }
  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "./course.jpg"}
              />

              <div className="media-body pt-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-5 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-5px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p
                      style={{
                        marginTop: "-10px",
                        fontSize: "10px",
                      }}
                    >
                      {course.category}
                    </p>
                  </div>
                  <div className="d-flex">
                    <Tooltip title={`${students} Enrolled`}>
                      <UserSwitchOutlined
                          className="h5 pointer text-primary me-5" />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <EditOutlined
                          onClick={()=>router.push(`/instructor/course/edit/${slug}`)
                      }
                          className="h5 pointer text-danger me-5" />
                    </Tooltip>
                    {course.lessons && course.lessons.length < 5 ? (
                        <Tooltip title={"minimum five lessons required to publish"}>
                          <QuestionOutlined className={"h-5 pointer text-danger me-4"}/>
                        </Tooltip>
                    ) : course.published ? <Tooltip title={"unpublished"}>
                      <CloseOutlined
                          onClick={(e)=> handleUnPublish(e, course._id)}
                          className={"h-5 pointer text-danger me-4 mt-2"}
                      />
                    </Tooltip>
                        :
                        <Tooltip title={"Published"} >
                      <CheckOutlined
                          onClick={(e)=> handlePublish(e , course._id)}
                          className={"h-5 pointer text-success   me-4 mt-2"}
                      />
                    </Tooltip>}
                  </div>
                </div>
              </div>

            </div>
            <div className="row">
              <div className="col">
                <ReactMarkdown children={course.description} />
              </div>
            </div>
           <div className='row'>
             <Button
                 onClick={()=>setVisible(true)}
                 className="col-md-6 offset-md-3 text-center"
                 shape="round"
                 type="primary" icon={<UploadOutlined />}
                 size="large"
             >
               Add Lesson
             </Button>
           </div>
            <br/>
            <Modal title='+ Add Lesson' centered visible={visible} onCancel={()=>setVisible(false)} footer={null}>
              <AddLessonForm
                  values={values}
                  setValues={setValues}
                  handleAddLesson={handleAddLesson}
                  uploading={uploading}
                  uploadButtonText={uploadButtonText}
                  handleVideo={handleVideo}
                  progress={progress}
                  handleVideoRemove={handleVideoRemove}
                  editPage={true}
              />
            </Modal>
            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>{course && course.lessons && course.lessons.length} lessons</h4>
              </div>
              <List
                  itemLayout="horizontal"
                  dataSource={course.lessons}
                  renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar>{index+1}</Avatar>}
                            title={item.title}
                        />
                      </List.Item>
                  )}
              />
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
