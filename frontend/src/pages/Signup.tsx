import { Auth } from "../components/Auth";
import Quote from "../components/Quote";

const Signup = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* signup */}
        <div>
          <Auth type={"signup"} />
        </div>
        {/* quote */}
        <div className="hidden lg:block">
          <Quote />
        </div>
      </div>
    </div>
  );
};

export default Signup;
