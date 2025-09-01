import { useState } from "react";
import { useForgotPass } from "../../../hooks/useForgotPass";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const { handleForgotPass, loading, error } = useForgotPass();

  return (
    <div className="m-auto mt-24 w-[90%] max-w-sm rounded-2xl border bg-white p-10 font-Heebo shadow-lg sm:w-full">
      <h2 className="mb-4 text-xl font-semibold text-lightBlack min-[340px]:text-2xl sm:text-3xl">
        Forgot password
      </h2>
      <p className="mb-6 text-sm text-darker min-[340px]:text-base">
        Enter your email below and we'll send you instructions on how to reset
        your password.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleForgotPass(email);
        }}
      >
        <label
          htmlFor="email"
          className="text-sm text-darker min-[340px]:text-base"
        >
          Email address
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-darker focus:outline-none focus:ring-1 focus:ring-darker"
          required
        />
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
        )}
        <button
          className="mt-6 w-full rounded-lg bg-darker py-2 text-sm font-semibold text-white shadow-md transition hover:bg-lightBlack disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Instructions"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPass;
