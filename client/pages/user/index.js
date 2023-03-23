import {useContext, useEffect, useState} from "react";
import { Context } from "@/context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import {Avatar} from "antd";
import Link from "next/link";
import {PlayCircleOutlined, SyncOutlined} from "@ant-design/icons";

const userIndex = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
  const { state } = useContext(Context);
  const { user } = state;

  useEffect(() => {
    loadCourses();
  }, [])

    const loadCourses = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("/api/v1/user-courses");
            setCourses(data);
            setLoading(false)
        }catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

  return (
    <UserRoute>
        {loading && <SyncOutlined spin className="d-flex justify-content-center display-1 text-primary"/>}
      <h1 className="jumbotron square text-center">User DashBoard</h1>
        {/*show list of courses*/}
        {courses && courses.map(course => (
            <div key={course._id} className="media pb-3">
                <Avatar size={80} src={course.image && course.image.Location} />
                <div className="media-body pl-2">
                    <div className="row">
                        <div className="col">
                            <Link href={`/user/course/${course.slug}`} legacyBehavior>
                                <a style={{textDecoration: "none"}} >
                                    <h5 className="mt-2 text-primary">{course.name}</h5>
                                </a>
                            </Link>
                            <p style={{marginBottom: "-3px"}}>{course.lessions && course.lessions.length} Lessons</p>
                            <p
                                className={"text-muted"}
                                style={{marginBottom: "-3px"}}
                                fontSize="small"
                                >
                                By {course.instructor.name}
                            </p>


                        </div>
                        <div className="col-md-3 pt-2">
                            <span className="float-right">
                                <Link href={`/user/course/${course.slug}`} legacyBehavior>
                                <a>
                                    <PlayCircleOutlined className="h2 pointer text-primary"/>
                                </a>
                            </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </UserRoute>
  );
};

export default userIndex;
