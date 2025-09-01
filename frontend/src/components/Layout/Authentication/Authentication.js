import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Authentication = () => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { handleAuth, loading, errors, setErrors } = useAuth();

  const onSubmit = (e, mode, guestUserData) => {
    if (e) e.preventDefault();
    handleAuth(mode, formData, guestUserData);
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-gray-200 bg-white p-8 font-Heebo shadow-lg sm:w-full">
        <div className="mb-6 flex w-full rounded-xl bg-gray-100 p-1">
          <button
            className={`w-1/2 rounded-xl py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-white text-black shadow" : "text-gray-500"
            }`}
            type="button"
            onClick={() => {
              setMode("login");
              setErrors(null);
            }}
          >
            Log in
          </button>
          <button
            className={`w-1/2 rounded-xl py-2 text-sm font-semibold transition ${
              mode === "signup" ? "bg-white text-black shadow" : "text-gray-500"
            }`}
            type="button"
            onClick={() => {
              setMode("signup");
              setErrors(null);
            }}
          >
            Sign up
          </button>
        </div>
        <form onSubmit={(e) => onSubmit(e, mode)}>
          {mode === "login" ? (
            <LoginForm formData={formData} onChange={onChange} />
          ) : (
            <div>
              <SignupForm formData={formData} onChange={onChange} />
            </div>
          )}

          {errors &&
            errors.map((err, idx) => (
              <p key={idx} className="mt-2 text-sm font-medium text-red-600">
                {err}
              </p>
            ))}
          <button
            disabled={loading}
            className={`mt-6 w-full rounded-lg py-2 text-sm font-semibold transition ${
              loading
                ? "cursor-not-allowed bg-gray-400 text-white"
                : "bg-darker text-white hover:bg-lightBlack"
            }`}
            type="submit"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Sign up"
                : "Log in"}
          </button>
        </form>
        {mode === "login" && (
          <>
            <button
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              type="button"
              onClick={() =>
                onSubmit(null, "login", {
                  email: "guest@example.com",
                  password: "guestpassword",
                })
              }
            >
              Log in as Guest
            </button>
            <div className="mt-4 text-center text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
              <p className="mt-1 text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={() => setMode("signup")}
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Authentication;
