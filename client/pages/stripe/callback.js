import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Context } from "@/context";
import { toast } from "react-toastify";
import UserRoute from "../../Components/Routes/UserRoute";
import { SyncOutlined } from "@ant-design/icons";

const StripeCallback = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      axios.post("/api/v1/get-account-status").then((response) => {
        dispatch({
          type: "LOGIN",
          payload: response.data,
        });
        //save in local storage
        window.localStorage.setItem("user", JSON.stringify(response.data));
        //redirect to the instructor

        window.location.href = "/instructor";
        // console.log(response);
      });
    }
  }, [user]);

  return (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-primary p-5"
    />
  );
};

export default StripeCallback;
