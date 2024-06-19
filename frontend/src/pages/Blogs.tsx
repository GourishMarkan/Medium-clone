import React from "react";
import { BlogCard } from "../components/BlogCard";
import Appbar from "../components/Appbar";
import { useBlogs } from "../hooks";

const Blogs = () => {
  const { loading, setLoading } = useBlogs();
  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className=" max-w-xl">
          <BlogCard
            authorName="Gourish markan"
            title="hi this dnlwxklwdx xmy first blog nxeopxeopxeopexeopnexopxeoewho are u"
            content="i am very hakndpodopdpdonoodpnopppy to tell"
            publishedDate="18-06-24"
          />
          <BlogCard
            authorName="Gourish markan"
            title="hi this dnlwxklwdx xmy first blog nxeopxeopxeopexeopnexopxeoewho are u"
            content="i am very hakndpodopdpdonoodpnopppy to tell"
            publishedDate="18-06-24"
          />
          <BlogCard
            authorName="Gourish markan"
            title="hi this dnlwxklwdx xmy first blog nxeopxeopxeopexeopnexopxeoewho are u"
            content="i am very hakndpodopdpdonoodpnopppy to tell"
            publishedDate="18-06-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
