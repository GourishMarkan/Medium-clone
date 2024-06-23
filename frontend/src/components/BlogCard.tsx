import { Link } from "react-router-dom";
interface BlogCardProps {
  id: string;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div>
        <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer ">
          <div className="flex">
            <div className="flex justigy-center flex-col mt-1 ">
              <Avatar authorName={authorName} />
            </div>
            <div className="font-extralight pl-2 mt-2 text-sm">
              {authorName}
            </div>
            <div className=" flex justify-center flex-col pl-2 mt-2">
              <Circle />
            </div>
            <div className="pl-2 font-thin text-slate-500 text-sm mt-2">
              {publishedDate}
            </div>
          </div>
          <div className="text-xl font-semibold">{title}</div>
          <div className="text-md font-thin">
            {content.slice(0, 100) + "..."}
          </div>
          <div className="text-slate-500 text-sm font-thin">
            {`${Math.ceil(content.length / 100)} minute(s) read`}
          </div>
        </div>
      </div>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-400"></div>;
}

export function Avatar({
  authorName,
  size = "small",
}: {
  authorName: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
        size === "small" ? "w-6 h-6" : "w-10 h-10"
      }`}
    >
      <span
        className={` ${
          size === "small" ? "text-xs" : "text-md"
        } text-gray-600 dark:text-gray-300`}
      >
        {authorName[0]}
      </span>
    </div>
  );
}
