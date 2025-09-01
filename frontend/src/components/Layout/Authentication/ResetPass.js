import { useState } from "react";
import { useResetPass } from "../../../hooks/useResetPass";

const ResetPass = ({ token }) => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { handleResetPassword, errors, loading } = useResetPass();

  return (
    <div className="m-auto mt-24 w-[90%] max-w-sm rounded-2xl border bg-white p-10 font-Heebo shadow-lg sm:w-full ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword(token, newPassword, passwordConfirm);
        }}
      >
        <h2 className="mb-4 text-lg font-semibold text-lightBlack min-[340px]:text-2xl sm:text-3xl">
          Reset your password
        </h2>

        <label
          htmlFor="newPassword"
          className="text-sm text-darker min-[340px]:text-base"
        >
          New password
        </label>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-3 mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-darker focus:outline-none focus:ring-1 focus:ring-darker"
        />
        <label
          htmlFor="confirmPassword"
          className="text-sm text-darker min-[340px]:text-base"
        >
          Confirm password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-darker focus:outline-none focus:ring-1 focus:ring-darker"
        />
        {errors &&
          errors.map((err, idx) => (
            <p key={idx} className="mt-2 text-sm font-medium text-red-600">
              {err}
            </p>
          ))}
        <button
          className="mt-6 w-full rounded-lg bg-darker py-2 text-sm font-semibold text-white shadow-md transition hover:bg-lightBlack disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
