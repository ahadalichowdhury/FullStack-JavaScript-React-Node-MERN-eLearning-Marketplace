import {Card, Badge} from "antd";
import Link from "next/link";
import {currencyFormatter} from "@/utils/helper";

const {Meta} = Card;

const CourseCard = ({course}) => {
    const {name,paid, instructor, description, price, category, updatedAt,image, slug} = course;
   return (
       <Link href={`/course/${slug}`} legacyBehavior >
              <a style={{ textDecoration: "none" }}>
                  <Card className={"font-weight-bold"}
                        cover={
                      <img
                          src={image.Location}
                          alt={name}
                          style={{height: "200px", objectFit: "cover"}}
                          className="p-1"
                      />
                  }
                  >
                      <h2>{name}</h2>
                        <Badge
                            className="pb-2 me-2 mt-2 fw-semibold"
                            count={category}
                            style={{backgroundColor: "#03a9f4"}}
                        />
                      <h4 className={"pt-2"}>{paid? currencyFormatter({
                          amount: price,
                            currency: "usd"
                      }) : "Free"}</h4>
                  </Card>
              </a>
       </Link>
   )
}

export default CourseCard;