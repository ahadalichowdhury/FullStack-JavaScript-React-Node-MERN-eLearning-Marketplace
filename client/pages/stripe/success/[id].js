import {useEffect} from "react";
import {SyncOutlined} from "@ant-design/icons";
import UserRoute from "@/components/routes/UserRoute";
import {useRouter} from "next/router";
import axios from "axios"

const StripeSuccess = () => {
    const router = useRouter();
    const {id} = router.query;

    useEffect(()=>{
        if(id){
           successRequest();
        }
    }, [id])

    const successRequest = async () => {
        try{
            const {data} = await axios.get(`/api/v1/stripe-success/${id}`);
            // console.log("stripe success =>", data);
            router.push(`/user/course/${data.course.slug}`); // pass courseId as a parameter
        }catch(err){
            console.log(err);
        }
    }

    return (
        <UserRoute showNav={false}>
            <div className="container-fluid">
                <div className="row text-center">
                    <div className="col md-9 pb-5">
                        <SyncOutlined spin className={"display-1 text-danger p-5"}/>
                    </div>
                    <div className={"col-md-3"}></div>
                </div>
            </div>
        </UserRoute>
    );
}

export default StripeSuccess;