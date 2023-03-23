import {Avatar, List} from "antd";

const SingleCourseLessons = ({ lessions, setPreview, setShowModal, showModal }) => {
    return (
        <div className={"container mt-5"}>
           <div className={"row"}>
               <div className={"col lesson-list"}>
                   {lessions && <h4>{lessions.length} Lessons</h4>}
                   <hr/>
                   <List
                          itemLayout="horizontal"
                          dataSource={lessions}
                          renderItem={(item, index) => (
                              <List.Item>
                                  <List.Item.Meta
                                      avatar={<Avatar>{index+1}</Avatar>}
                                      title={item.title}
                                  />
                                  {item.video && item.video!==null && item.free_preview && (
                                      <span
                                          className={"pointer text-primary"}
                                          onClick={()=>{
                                              setPreview(item.video.Location);
                                              setShowModal(!showModal);
                                          }}
                                      >
                                          Preview
                                      </span>
                                      )}
                              </List.Item>
                          )}
                   />
               </div>
           </div>
        </div>
    )

}
export default SingleCourseLessons;