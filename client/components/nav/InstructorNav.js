import Link from "next/link";
import { useEffect, useState } from "react";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <>
      <div className="nav flex-column nav-pills mt-2">
        <Link href="/instructor" legacyBehavior>
          <a
            className={`nav-link ${current === "/instructor" && "active"}`}
            style={{ textDecoration: "none" }}
          >
            DashBoard
          </a>
        </Link>
        <Link href="/instructor/course/create" legacyBehavior>
          <a
            className={`nav-link ${
              current === "/instructor/course/create" && "active"
            }`}
            style={{ textDecoration: "none" }}
          >
            Create Course
          </a>
        </Link>
        <Link href="/instructor/revenue" legacyBehavior>
          <a
              className={`nav-link ${
                  current === "/instructor/revenue" && "active"
              }`}
              style={{ textDecoration: "none" }}
          >
           Revenue
          </a>
        </Link>
      </div>
    </>
  );
};

export default InstructorNav;
