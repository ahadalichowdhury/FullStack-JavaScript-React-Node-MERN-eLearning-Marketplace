import Link from "next/link";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Context } from "@/context";

export default function register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //for protected route

  const {
    state: { user },
  } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name, email, password);
    if (name === "" || email === "" || password === "") {
      toast.error("All fields are required");
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
    } else {
      setLoading(true);
      axios
        .post(`/api/v1/register`, {
          name,
          email,
          password,
        })
        .then((res) => {
          toast.success("Registration successfully completed, please login");
          setEmail("");
          setPassword("");
          setName("");
          setLoading(false);
        })

        .catch((err) => {
          // console.log(err);
          setLoading(false);
          toast.error("something went wrong");
        });
    }
  };
  return (
    <>
      <h1 className="jumbotron square text-primar">Register</h1>
      <div className="container col-md-4 offset-md-4 mt-5">
        <form onSubmit={handleSubmit}>
          <input
            type="Name"
            className="form-control mb-4 p-2"
            placeholder="Name.."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="Email"
            className="form-control mb-4 p-2"
            placeholder="Email.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-4 p-2"
            placeholder="Password.."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* disabled use for spinning */}
          <button
            type="submit"
            className="btn btn-block btn-primary mx-auto px-5 d-flex items-center"
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
          <p className="text-center p-3">
            Already have an account?
            <Link href="/login" legacyBehavior>
              <a>Login</a>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
