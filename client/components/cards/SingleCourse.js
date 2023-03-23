import {Badge, Button} from "antd";
import moment from "moment/moment";
import {currencyFormatter} from "@/utils/helper";
import ReactPlayer from "react-player";
import {LoadingOutlined, SafetyOutlined} from "@ant-design/icons";


const SingleCourse = ({course, setShowModal, showModal, preview, setPreview, loading, handlePaidEnrollment,user, handleFreeEnrollment, enrolled, setEnrolled }) => {
    let {name, description, price, category, image, instructor, updatedAt, lessions, paid} = course;
    return (
        <div className="container-fluid">
            <div className="row">
                {/*<pre>{JSON.stringify(course, null, 4)}</pre>*/}
                <div className="course mx-auto bg-primary square">
                    <div className="row">
                        <div className="col-md-8">
                            {/*title*/}
                            <h1 className="text-light font-weight-bold">{name}</h1>
                            {/*description*/}
                            <p className="lead text-light">{description && description.substring(0, 160)}...</p>
                            {/*category*/}
                            <Badge count={category} style={{backgroundColor: "#03a9f4"}}/>
                            {/*author*/}
                            <p className="lead text-light">Author: {instructor.name}</p>
                            {/*updatedAt*/}
                            <p className="lead text-light">Last Updated: {moment(updatedAt).format('MM/DD/YYYY')}</p>
                            {/*price*/}
                            <h4 className="text-light">{paid ? currencyFormatter(
                                {
                                    amount: price,
                                    currency: "usd"
                                }
                            ) : "Free"}</h4>
                        </div>
                        <div className={"col-md-4"}>
                            {/*show video preview or course image*/}
                            {/*<pre className="text-danger">{JSON.stringify(lessions[0], null, 4)}</pre>*/}
                            {lessions[0].video && lessions[0].video.Location ?(
                                <div onClick={()=>{
                                    setPreview(lessions[0].video.Location);
                                    setShowModal(!showModal);
                                }
                                }>
                                    <ReactPlayer
                                        className="react-player-div"
                                        url={lessions[0].video.Location}
                                        width="100%"
                                        height="250px"
                                        light={image.Location}
                                    />
                                </div>
                            ):(
                                <>
                                    <img src={image.Location} alt={name} className="img img-fluid" />
                                </>
                            ) }
                            {/*enroll button*/}
                            {loading ? (
                                <div className="d-flex justify-content-center mt-3 ">
                                    <LoadingOutlined className={"h1 text-danger"}/>
                                </div>
                            ):(
                                <Button
                                    className="mb-3 mt-3 bg-danger"
                                    type="danger"
                                    shape="round"
                                    size="large"
                                    block
                                    icon={<SafetyOutlined/>}
                                    disabled={loading}
                                    onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
                                >{user?  enrolled.status ? "Go to Course":"Enroll Now" : "Login to Enroll"}</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SingleCourse;