import {CloudSyncOutlined} from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";

const StripeCancel = () => {
    return (
        <UserRoute showNav={false}>
            <div className="container-fluid">
                <div className="row text-center">
                    <div className="col">
                        <CloudSyncOutlined className="h1 text-danger p-5"/>
                        <h1 className="text-center p-5">Payment Fail, Try Again Later</h1>
                    </div>
                    <div className={"col-md-3"}></div>
                </div>
            </div>
        </UserRoute>


    );
}
export default StripeCancel;