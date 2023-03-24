import {useState, useEffect} from 'react';
import axios from 'axios';
import CourseCard from "../components/cards/CourseCard"
export default function Home({courses}) {
    // const [courses, setCourses] = useState([]);
    // useEffect(()=>{
    //    const fetchCourses = async ()=>{
    //        const {data} = await axios.get('/api/v1/courses')
    //        setCourses(data);
    //    }
    //      fetchCourses();
    // },[])
  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Education MarketPlace
      </h1>
        <div className="container-fluid">
            <div className="row">
                {courses.map((course)=>(
                    <div className="col-md-4" key={course._id}>
                        <CourseCard course={course}/>
                    </div>
                ))}
            </div>
        </div>
    </>
  );
}

export async function getServerSideProps(){
    const {data} = await axios.get(`http://localhost:8000/api/v1/courses`);
    return {
        props: {
            courses: data
        }
    }
}
