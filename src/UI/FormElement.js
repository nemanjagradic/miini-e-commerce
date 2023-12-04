const FormElement = ({
  field: { label, width, type, disabled },
  fieldProps: { value, onChange, onBlur, isValid, isTouched },
}) => {
  return (
    <div className={`mb-2 ${width}`} key={label}>
      <label className="mb-2 block text-slate-500" htmlFor={label}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={label}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          className="h-12 w-full bg-slate-100 pl-4 pt-3 outline-none"
        />
      ) : (
        <input
          type={type}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          className={`h-12 w-full bg-slate-100 pl-4 outline-none ${
            !isValid &&
            isTouched &&
            value !== "" &&
            "border-s-[3px] border-l-red-500"
          } ${isValid && isTouched && "border-s-[3px] border-l-green-400"}`}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default FormElement;
