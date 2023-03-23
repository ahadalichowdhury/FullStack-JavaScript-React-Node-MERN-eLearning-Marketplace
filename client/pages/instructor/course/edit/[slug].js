import axios from "axios";
import InstructorRoute from "@/components/routes/InstrustorRoute";
import { useState, useEffect } from "react";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CourseCreateForm from "@/components/forms/CourseCreateForm";
import { Avatar, List, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/updateLessonForm";

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
    lessions: [],
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  // router
  const router = useRouter();
  //distructure slug for router
  const { slug } = router.query;

  //state for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent]= useState({})
  const [uploadVideoButtonText, setUploadVideoButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);



  //useEffect to fetch the all value
  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/v1/course/${slug}`);
    setValues(data);
    if(data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/v1/course/upload-image", {
          image: uri,
        });
        console.log("IMAGE UPLOADED", data);
        // set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast.error("Image upload failed. Try later.");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values);
      const { data } = await axios.put(`/api/v1/course/${slug}`, {
        ...values,
        image,
      });
      toast.success("Course Update successfully.");
      // router.push("/instructor");
    } catch (err) {
      toast.error("Course creation failed. Try later.");
    }
  };

  //handle drag and drop for course
  const handleDrag = (e, index) => {
    // console.log("DRAG", index);
    e.dataTransfer.setData("itemIndex", index);
  };
  const handleDrop = (e, index) => {
    // console.log("Drop", index);
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    let allLessons = values.lessions;
    let movingItem = allLessons[movingItemIndex]; //click / drag item to reorder
    allLessons.splice(movingItemIndex, 1); //remove 1 item form the given index
    allLessons.splice(targetItemIndex, 0, movingItem); //add item to the given index
    setValues({ ...values, lessions: allLessons }); //update the state

    //save the new lesson list in db
    axios
      .put(`/api/v1/course/${slug}`, {
        ...values,
        lessions: allLessons,
      })
      .then((res) => {
        toast.success("Lessons re-ordered successfully.");
      })
      .catch((err) => {
        toast.error("Lessons re-order failed. Try later.");
      });
  };

  const handleDelete = async (index) => {
    const answer = window.confirm("Are You Sure want to delete?");
    if (!answer) return;
    let allLessons = values.lessions;
    const remove = allLessons.splice(index, 1);
    // console.log("removed Item", remove[0]._id);

    setValues({ ...values, lessions: allLessons });

    //send request to server
    try {
      const { data } = await axios.put(
        `/api/v1/course/${slug}/${remove[0]._id}`
      );
      toast("lesson Deleted successfully");
    } catch (error) {
      toast("lesson deleted failed");
    }

    // console.log("lesson deleted:===>", data);
  };

  /*
  lessoons update function
   */
  const handleVideo = async(e)=>{
    //remove previous video
     if(current.video && current.video.Location){
       const res =await axios.post(`/api/v1/course/remove-video/${values.instructor._id}`,
           current.video
       )
       console.log("remove video res===>", res)
     }
     //upload new video
     const file = e.target.files[0];
     setUploadVideoButtonText(file.name)
     setUploading(true)

     //send video as form data to backend
     const videoData = new FormData()
     videoData.append('video', file)
     videoData.append('courseId', values._id)

     //save progress bar and send video as form data to backend
     const {data}= await axios.post(`/api/v1/course/video-upload/${values.instructor._id}`,
         videoData, {
           onUploadProgress: (e)=>{
             setProgress(Math.round((100 * e.loaded) / e.total))
           }
         })
     // console.log(data)
     setCurrent({...current, video: data})
     setUploading(false)
  }

  const handleUpdateLesson=  (e)=>{
    // console.log("handle update lesson")
    e.preventDefault()
    const {data} =  axios.put(`/api/v1/course/lesson/${slug}/${current._id}`,
        current
    )
    setUploadVideoButtonText("Upload Video")
    setVisible(false)
    toast("Lesson Updated successfully")
    // setCourse(data);
  }

  return (
    <InstructorRoute>
      {/*{JSON.stringify(values)}*/}
      <h1 className="jumbotron text-center square">Update Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
        />
      </div>

      {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
      {/*<hr />*/}
      {/*<pre>{JSON.stringify(image, null, 4)}</pre>*/}

      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessions && values.lessions.length} lessons</h4>
        </div>
        {values && values.lessions && (
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values.lessions}
            renderItem={(item, index) => (
              <List.Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <List.Item.Meta
                   onClick={()=>{
                    setVisible(true)
                    setCurrent(item)
                  }
                  }
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></List.Item.Meta>

                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger float-end"
                />
              </List.Item>
            )}
          />
        )}
      </div>
      <Modal
          title={"Update Lesson"}
          centered
          visible={visible}
          footer={null}
          onCancel={()=>setVisible(false)}
      >
        <UpdateLessonForm
            current={current}
            setCurrent={setCurrent}
            handleVideo={handleVideo}
            handleUpdateLesson={handleUpdateLesson}
            uploadVideoButtonText={uploadVideoButtonText}
            progress={progress}
            uploading={uploading}
        />
        {/*<pre>{JSON.stringify(current, 4, null)}</pre>*/}
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
