import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { Context } from "../context";

export default function login() {
  const [email, setEmail] = useState("1234@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  //state
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  // console.log("State: ", state);

  // router
  const router = useRouter();

  //for protected route
  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ name, email, password });
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/v1/login`, {
        email,
        password,
      });
      setLoading(false);
      // console.log("LOGIN RESPONSE", data);
      dispatch({
        type: "LOGIN",
        payload: {
          data,
        },
      });

      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));

      // redirect
      router.push("/user");
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron bg-primary square">login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            className="btn btn-block btn-primary mx-auto px-5 d-flex items-center"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>

        <p className="text-center p-3">
          Not yet registered?
          <Link href="/register" legacyBehavior>
            <a
              style={{
                textDecoration: "none",
              }}
            >
              Register
            </a>
          </Link>
        </p>

        <p className="text-center">
          <Link href="/forgot-password" legacyBehavior>
            <a
              style={{
                textDecoration: "none",
              }}
              className="text-danger"
            >
              Forgot password?
            </a>
          </Link>
        </p>
      </div>
    </>
  );
}
