import {useState, useEffect, useContext} from "react";
import {Context} from "../../context/index";
import axios from "axios";
import InstructorRoute from "@/components/routes/InstrustorRoute";

import {stripeCurrencyFormatter} from "@/utils/helper";
import {DollarOutlined, SettingOutlined, SyncOutlined} from "@ant-design/icons";

const InstructorRevenue=()=>{
    const [balance, setBalance]= useState({pending: []})
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        sendBalanceRequest()
    },[])
    const sendBalanceRequest = async ()=>{
        const {data} = await axios.get("/api/v1/instructor/balance")
        console.log("BALANCE", data)
        setBalance(data)
    }
    const handlePaymentSetting = async()=>{
       try{
            setLoading(true)
           const {data} = await axios.get("/api/v1/instructor/payout-settings")
           console.log("STRIPE SETTINGS", data)
           window.location.href=data;
       }catch (e) {
           setLoading(false)
           console.log(e);
           alert("unable to access payment setting")
       }
    }
    return (
        <InstructorRoute>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-md-8 offset-md-2 bg-light p-5"}>
                        <h2>
                            Revenue report <DollarOutlined className={"float-end"} />
                        </h2>
                        <small>
                            You get Paid directly from stripe to your bank account every 48 hours
                        </small>
                        <hr />
                        {/*{JSON.stringify(balance, null, 4)}*/}
                        <h4>
                            Pending Balance
                            <span>
                                ${balance.pending && balance.pending.map((bp, i)=>{
                                   return (
                                       <span key={i} className={"float-end"}>
                                         {stripeCurrencyFormatter(bp)}
                                        </span>
                                   )
                                })}

                            </span>
                        </h4>
                        <small>
                            For 48 hours
                        </small>
                        <hr />
                        <h4>
                            Payments
                            {!loading ?
                                <SettingOutlined
                                className={"float-end"}
                                onClick={handlePaymentSetting}
                            /> :
                                <SyncOutlined spin className={"float-end"}
                                />
                            }
                        </h4>
                        <small>
                            Update Your stripe account details or payout settings
                        </small>
                    </div>
                </div>
            </div>
        </InstructorRoute>
    )
}

export default InstructorRevenue;
