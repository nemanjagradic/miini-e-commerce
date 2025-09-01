const SignupForm = ({ formData, onChange }) => {
  const inputClass =
    "mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lightBlack focus:outline-none focus:ring-1 focus:ring-lightBlack";
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm min-[340px]:text-base" htmlFor="name">
          Name
        </label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-sm min-[340px]:text-base" htmlFor="email">
          Email address
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-sm min-[340px]:text-base" htmlFor="password">
          Password
        </label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={onChange}
          className={inputClass}
        />
      </div>
      <div>
        <label
          className="text-sm min-[340px]:text-base"
          htmlFor="passwordConfirm"
        >
          Confirm Password
        </label>
        <input
          name="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          onChange={onChange}
          className={inputClass}
        />
      </div>
    </div>
  );
};

export default SignupForm;
