import axios from "axios";
import InstructorRoute from "@/components/routes/InstrustorRoute";
import { useState, useEffect } from "react";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";
import { CheckCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);
  const loadCourses = async () => {
    const { data } = await axios.get("api/v1/instructor-courses");
    setCourses(data);
  };

  const myStyle = { marginTop: "-5px", fontSize: "15px" };
  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
      {courses &&
        courses.map((course) => {
          return (
            <>
              <div className="media pt-2">
                <Avatar
                  size={80}
                  src={course.image ? course.image.Location : "./course.jpg"}
                />

                <div className="media-body ps-2">
                  <div className="row">
                    <div className="col">
                      <Link
                        href={`/instructor/course/view/${course.slug}`}
                        className="pointer"
                        legacyBehavior
                      >
                        <a
                          className="mt-2 text-primary"
                          style={{ textDecoration: "none" }}
                        >
                          <h5 className="pt-2">{course.name}</h5>
                        </a>
                      </Link>
                      <p
                        style={{
                          marginTop: "-5px",
                        }}
                      >
                        {course.lessons.length} Lessons
                      </p>

                      {course.lessons.length < 5 ? (
                        <p style={myStyle} className="text-warning">
                          At least 5 lessons are required to publish a course
                        </p>
                      ) : course.published ? (
                        <p style={myStyle} className="text-success">
                          Your course is live in the marketplace
                        </p>
                      ) : (
                        <p style={myStyle} className="text-success">
                          Your course is ready to publis
                        </p>
                      )}
                    </div>
                    <div className="col-md-3 mt-3 text-center">
                      {course.published ? (
                        <Tooltip title={"Published"}>
                          <CheckCircleOutlined className="h5 pinter text-success" />
                        </Tooltip>
                      ) : (
                        <Tooltip title={"UnPublished"}>
                          <CheckCircleOutlined className="h5 pinter text-warning" />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </InstructorRoute>
  );
};


export default InstructorIndex;
