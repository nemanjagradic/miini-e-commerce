import { useState } from "react";

const useForm = (fieldsConfig) => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    fieldsConfig.forEach((field) => {
      initialData[field.name] = field.defaultValue || "";
    });
    return initialData;
  });

  const [touchedFields, setTouchedFields] = useState(() => {
    const initialTouchedFields = {};
    fieldsConfig.forEach((field) => {
      initialTouchedFields[field.name] = false;
    });
    return initialTouchedFields;
  });

  const validateField = (value, validate) => {
    if (validate && typeof validate === "function") {
      return validate(value);
    }
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    let isRadioSelected = false;

    fieldsConfig.forEach((field) => {
      const { name, type } = field;
      const value = formData[name];

      if (type === "radio") {
        isRadioSelected =
          isRadioSelected ||
          (value !== null && value !== undefined && value !== "");
      } else {
        const fieldIsValid = validateField(value, field.validate);
        isValid = isValid && fieldIsValid;
      }
    });

    isValid = isValid && isRadioSelected;

    return isValid;
  };

  const resetForm = () => {
    setFormData(() => {
      const resetData = {};
      fieldsConfig.forEach((field) => {
        resetData[field.name] = field.defaultValue || "";
      });
      return resetData;
    });
  };

  const getFieldProps = (field) => {
    const fieldName = field.name;

    return {
      value: formData[fieldName],
      onChange: (e) => {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: e.target.value,
        }));
      },
      onBlur: () =>
        setTouchedFields((prevTouchedFields) => ({
          ...prevTouchedFields,
          [fieldName]: formData[fieldName] !== "" ? true : false,
        })),
      isValid: validateField(formData[fieldName], field.validate),
      isTouched: touchedFields[fieldName],
    };
  };

  return {
    formData,
    validateForm,
    resetForm,
    getFieldProps,
  };
};

export default useForm;
