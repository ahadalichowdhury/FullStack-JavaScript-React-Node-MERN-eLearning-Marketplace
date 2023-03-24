import { Menu, Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppstoreOutlined,
  LoginOutlined,
  CarryOutOutlined,
  TeamOutlined,
  UserAddOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { Context } from "../context/index";
import { useEffect, useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/v1/logout");
    toast(data.message);
    router.push("/login");
  };

  return (
    <Menu theme={"dark"} mode="horizontal" selectedKeys={[current]} className="mb-2">
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/" legacyBehavior>
          <a
            style={{
              textDecoration: "none",
            }}
          >
            Home
          </a>
        </Link>
      </Item>

      {user && user.role && user.role.includes("Instructor") ? (
        <Item
          key="/instructor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create" legacyBehavior>
            <a
              style={{
                textDecoration: "none",
              }}
            >
              Create Course
            </a>
          </Link>
        </Item>
      ) : (
        <Item
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-instructor" legacyBehavior>
            <a
              style={{
                textDecoration: "none",
              }}
            >
              Become Instructor
            </a>
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login" legacyBehavior>
              <a
                style={{
                  textDecoration: "none",
                }}
              >
                Login
              </a>
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register" legacyBehavior>
              <a
                style={{
                  textDecoration: "none",
                }}
              >
                Register
              </a>
            </Link>
          </Item>
        </>
      )}

      {user && user.role && user.role.includes("Instructor") && (
        <Item
          key="/instructor"
          className="float-end"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/instructor" legacyBehavior>
            <a
              style={{
                textDecoration: "none",
              }}
            >
              Instructor
            </a>
          </Link>
        </Item>
      )}

      {user !== null && (
        <SubMenu
          icon={<CoffeeOutlined />}
          className="float-end"
          title={user && user.name}
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user" legacyBehavior>
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
