import {useRouter} from 'next/router';
import {useState, useEffect, createElement} from 'react';
import axios from 'axios';
import StudentRoute from "@/components/routes/StudentRoute";
import {Avatar, Button, Menu} from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import {
    CheckCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MinusCircleFilled,
    PlayCircleOutlined
} from "@ant-design/icons";
const SingleCourse =()=>{
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({lessons: []});
    const [clicked, setClicked] = useState(-1);
    const [collapsed, setCollapsed] = useState(false);
    const [completedLesson, setCompletedLesson] = useState([]);
    const [updatestate, setUpdateState] = useState(false);

    //router
    const router = useRouter();
    const {slug} = router.query;

    useEffect(()=>{
        if(slug){
            loadCourse();
        }
    },[slug]);

    //useeffect for checking the video or lesson is done
    useEffect(()=>{
        if(course){
            loadCompletedLessons()
        }
    },[course])

    const loadCompletedLessons = async () =>{
        const {data}= await axios.post(`/api/v1/list-completed`,{
            courseId: course._id,
        });
        console.log("COMPLETED LESSONS FROM CLIENT=>", data);
        setCompletedLesson(data);
    }

    const loadCourse = async () =>{
        try{
            setLoading(true)
            const {data} = await axios.get(`/api/v1/user/course/${slug}`);
            setCourse(data);
            setLoading(false);
        }catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    const markCompleted =  async() =>{
     try{
         const {data} = await axios.post(`/api/v1/mark-completed`,{
             courseId: course._id,
             lessonId: course.lessions[clicked]._id
         })
         console.log(data)
         setCompletedLesson([...completedLesson, course.lessions[clicked]._id]);
     }catch (e) {
         console.log(e);
     }
    }

    const markInCompleted=  async() =>{
        try{
            const {data}= await axios.post("/api/v1/mark-incompleted",{
                courseId: course._id,
                lessonId: course.lessions[clicked]._id
            })
            console.log(data);
            const all = completedLesson;
            const index = all.indexOf(course.lessions[clicked]._id);
            if(index > -1){
                all.splice(index, 1);
                setCompletedLesson(all);
                setUpdateState(!updatestate);
            }
        }catch (e) {
            console.log(e)
        }
    }
    return(
        <StudentRoute>
            <div className={"row"}>
                <div style={{maxWidth: 320}}>
                    <Button
                        onClick={()=> setCollapsed(!collapsed)}
                        className={"text-primary mt-1 btn-block mb-2"}>
                        {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                        {!collapsed && "Lessons"}
                    </Button>
                    <Menu
                        defaultSelectedKeys={[clicked]}
                        inlineCollapsed={collapsed}
                        style={{height: "80vh", overflow: "scroll"}}
                    >
                        {course.lessions && course.lessions.map((lesson, index) => (
                            <Menu.Item
                                key={index}
                                onClick={() => setClicked(index)}
                                icon={<Avatar>{index + 1}</Avatar>}
                            >
                                {lesson.title.substring(0, 30)}
                                {completedLesson.includes(lesson._id) ? (
                                    <CheckCircleOutlined className={"float-end text-success mt-3"}/>
                                ):(
                                    <MinusCircleFilled className={"float-end text-danger mt-3"}/>
                                )}
                            </Menu.Item>
                            ))}
                    </Menu>
                </div>
                <div className={"col-lg-9 col-md-10"}>
                    {clicked !== -1 ? (
                        <>
                            <div className={"d-flex align-items-center justify-content-between col alert alert-primary square"}>
                                <h6>{course.lessions[clicked].title.substring(0, 30)}</h6>
                                    {completedLesson.includes(course.lessions[clicked]._id) ? (
                                        <span className={"pointer float-end"} onClick={markInCompleted}>
                                           Mark as InCompleted
                                        </span>
                                    ):(
                                        <span className={"pointer float-end"} onClick={markCompleted}>
                                            Mark as Completed
                                        </span>
                                    )}
                            </div>
                            {course.lessions[clicked].video && course.lessions[clicked].video.Location && (
                                <>
                                    <div className={"wrapper"}>
                                        <ReactPlayer
                                            className={"player"}
                                            url={course.lessions[clicked].video.Location}
                                            controls={true}
                                            width={"100%"}
                                            height={"100%"}
                                            onEnded={markCompleted()}
                                        />
                                    </div>
                                </>
                            )}
                            <ReactMarkdown
                                className={"single-post"}
                                children={course.lessions && course.lessions[clicked].content}/>
                        </>
                    ):(
                        <>
                            <div className={"d-flex justify-content-center display-1 p-5"}>
                                <div className={"text-center p-5"}>
                                    <PlayCircleOutlined className={"display-1 text-danger"}/>
                                    <p className={"lead"}>Click on the lesson to start</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </StudentRoute>

    )
}
export default SingleCourse;