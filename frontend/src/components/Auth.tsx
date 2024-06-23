import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@gourishmarkan/medium-common";
import { LabelledInput } from "./LabelledInput";
import axios from "axios";
import { BACKEND_URL } from "../config";
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState<SignupInput>({
    email: "",
    name: "",
    password: "",
  });

  const navigate = useNavigate();
  async function sendRequest() {
    try {
      const res = await axios.post(
        ` ${BACKEND_URL}/api/v1/user/${
          type === "signup" ? "signup" : "signin"
        }`,
        postInputs
      );
      const jwt = res.data;

      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (e) {
      alert("error while signing up");
      console.log("error is ", e);
    }
  }
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className=" text-xl font-extrabold">Create an account</div>
            <div className="text-slate-500">
              {type === "signin"
                ? "Don't have an account"
                : "Already have an account?"}
              {
                <Link
                  to={type == "signin" ? "/signup" : "/signin"}
                  className="underline pl-2"
                >
                  {type == "signin" ? "signup" : "signin"}
                </Link>
              }
            </div>
          </div>
          <div className="pt-4">
            <LabelledInput
              label="Email"
              placeholder="enter ur email"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  email: e.target.value,
                }));
              }}
            />

            {type === "signin" ? (
              " "
            ) : (
              <LabelledInput
                label="UserName"
                placeholder="enter ur username"
                onChange={(e) => {
                  setPostInputs((c) => ({
                    ...c,
                    name: e.target.value,
                  }));
                }}
              />
            )}

            <LabelledInput
              label="password"
              type={"password"}
              placeholder="123456789"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  password: e.target.value,
                }));
              }}
            />
            <button
              onClick={sendRequest}
              type="button"
              className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-2 pt-3"
            >
              {type === "signup" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
