import { useEffect, useState } from "react";
import FormElement from "../../../UI/FormElement";
import { useSelector } from "react-redux";
import useForm from "../../../hooks/useForm";
import "../../../firebaseConfig";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CheckoutStepTwo = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const database = getFirestore();
  const navigate = useNavigate();

  const [active, setActive] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [fullDate, setFullDate] = useState();

  const fieldsConfig = [
    {
      name: "name",
      type: "text",
      label: "Your Name *",
      width: "col-span-2",
      validate: (value) => value.trim() !== "" && value.split(" ").length >= 2,
    },
    {
      name: "email",
      type: "input",
      width: "col-span-2",
      label: "Email *",
      validate: (value) => value.includes("@"),
    },
    {
      name: "address",
      type: "input",
      width: "col-span-2",
      label: "Address Number *",
      validate: (value) => value.trim() !== "",
    },
    {
      name: "floor",
      type: "number",
      label: "Floor",
    },
    {
      name: "apartment",
      type: "number",
      label: "Apartment",
    },
    {
      name: "zipCode",
      type: "number",
      width: "col-span-2",
      label: "Zip Code *",
      validate: (value) => value.trim().length === 5,
    },
    {
      name: "city",
      type: "input",
      width: "col-span-2",
      label: "City *",
      validate: (value) => value.trim() !== "",
    },
    {
      name: "country",
      type: "input",
      width: "col-span-2",
      label: "Country *",
      defaultValue: "California",
      disabled: true,
    },
    {
      name: "phone",
      type: "number",
      width: "col-span-2",
      label: "Phone *",
      validate: (value) => value.trim().length > 8 && value.trim().length < 12,
    },
    {
      name: "notes",
      type: "textarea",
      width: "col-span-4",
      label: "Order Notes",
    },
    {
      name: "deliveryPrice",
      type: "radio",
      width: "col-span-4",
      label: "Pick up on location Lombard Street 30",
      id: "pickup",
      text: fullDate,
      price: "Free",
      required: true,
    },
    {
      name: "deliveryPrice",
      type: "radio",
      width: "col-span-4",
      label: "Home delivery to your address",
      label2: "Delivery: 1-7 days",
      id: "home",
      text: "The usual deadline for package deliveries is between 1 and 7 working days from the moment of placing the order",
      price: 5,
      required: true,
    },
  ];

  const handleOptionChange = (i, price) => {
    setActive(i);
    setDeliveryPrice(price);
  };

  useEffect(() => {
    const now = new Date();
    const currentHours = now.getHours();

    let nextHours = 14;
    let nextDate = new Date();

    if (nextDate.getDay() === 0 || currentHours > 15) {
      if (nextDate.getDay() === 0 && currentHours > 15) {
        nextDate.setDate(nextDate.getDate() + 2);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }
    }

    if (currentHours > 10 && currentHours < 12) {
      nextHours = 14;
    }
    if (currentHours >= 12 && currentHours < 15) {
      nextHours = 18;
    }

    nextDate.setHours(nextHours, 0, 0, 0);

    let forDay;
    forDay = now.getDate() === nextDate.getDate() ? "Today" : "Tomorrow";
    if (nextDate.getDay() === 0) {
      forDay = "Monday";
    }

    const options = {
      hour: "numeric",
      minute: "numeric",
    };
    const startTime = new Date(nextDate);
    const endTime = new Date(nextDate);
    endTime.setHours(nextHours + 4);

    setFullDate(
      `First available appointment for collection: ${forDay} ${startTime.toLocaleTimeString(
        [],
        options,
      )} - ${endTime.toLocaleTimeString([], options)}`,
    );
  }, []);

  const form = useForm(fieldsConfig);

  const submitHandler = async (e) => {
    e.preventDefault();

    const paymentInfo = form.formData;

    const formData = await addDoc(
      collection(database, "formData"),
      paymentInfo,
    );
    const orderId = formData._key.path.segments[1];
    navigate(`/checkout/3?id=${orderId}`);

    form.resetForm();
    setActive(0);
    console.log(formData);
  };

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    }).format(number);

  const allFields = fieldsConfig.map((field, i) => {
    const fieldProps = form.getFieldProps(field);

    if (field.type === "radio") {
      return (
        <div
          key={i}
          className={`border border-[#c7c7c7] ${
            field.width
          } p-5 hover:border-black ${
            active === i ? "border-2 !border-cyan-600" : ""
          }`}
        >
          <div className="flex">
            <input
              type="radio"
              name={field.name}
              value={field.price}
              className="h-6 w-6 accent-cyan-600"
              id={field.id}
              onChange={() => {
                handleOptionChange(i, field.price);
                fieldProps.onChange({
                  target: { name: field.name, value: field.price },
                });
              }}
              checked={fieldProps.value === field.price}
            />
            <label htmlFor={field.id} className="grow px-5 font-semibold">
              {field.label}
              <br />
              <span className="text-sm font-normal">{field.label2}</span>
            </label>
            <p className="font-semibold">{`${
              +field.price ? `${+field.price}$` : field.price
            }`}</p>
          </div>
          <div>
            <p
              className={`mt-3 max-h-0 overflow-hidden transition-[max-height] duration-300 ease-out ${
                active === i
                  ? "max-h-20 overflow-auto transition-[max-height] duration-500 ease-in"
                  : ""
              }`}
            >
              {field.text}
            </p>
          </div>
        </div>
      );
    } else {
      return <FormElement key={i} field={field} fieldProps={fieldProps} />;
    }
  });

  return (
    <div className="my-container mt-24 flex flex-wrap gap-12 font-Heebo">
      <div className="basis-full lg:flex-1">
        <h1 className="mb-1 text-xl font-semibold uppercase">
          Payment information
        </h1>
        <h2 className="mb-8 font-semibold">
          Fields marked with an asterisk (*) are required
        </h2>
        <form id="payment-form" onSubmit={submitHandler}>
          <div className="grid grid-cols-4 gap-x-4">{allFields}</div>
        </form>
      </div>
      <div className="basis-full lg:basis-2/5">
        <h1 className="mb-8 text-lg font-semibold uppercase">Your order</h1>
        <div className=" mb-3 grid grid-cols-7 text-xs font-semibold uppercase">
          <div className="col-span-3">Product</div>
          <div className="col-span-2 text-center">Price of product</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        {cartItems.map((item) => (
          <div key={item.id} className="mb-3 grid grid-cols-7 font-bold">
            <div className="col-span-3 text-xs font-normal">
              <span className="text-sm font-semibold sm:text-base">
                {item.title}
              </span>{" "}
              x {item.quantity}
            </div>
            <div className="col-span-2 text-center text-xs text-slate-500 sm:text-base">
              {formatNumber(item.price)}
            </div>
            <div className="col-span-2 text-right text-xs text-slate-500 sm:text-base">
              {formatNumber(item.totalPrice)}
            </div>
          </div>
        ))}
        <div className="my-3 flex items-center justify-between border-t-2 pt-2">
          <div className="font-semibold uppercase">Subtotal</div>
          <div className="font-bold text-slate-500">
            {formatNumber(subtotal)}
          </div>
        </div>
        <div className="flex justify-between  border-b-2 pb-2">
          <div className="font-semibold uppercase">Shipping Cost</div>
          <div className="font-bold text-slate-500">
            {deliveryPrice === +deliveryPrice
              ? formatNumber(deliveryPrice)
              : "-"}
          </div>
        </div>
        <div className="mb-5 mt-3 flex justify-between">
          <div className="text-lg font-semibold uppercase">Total</div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {deliveryPrice === +deliveryPrice
                ? formatNumber(subtotal + deliveryPrice)
                : formatNumber(subtotal)}
            </p>
            <p className="mt-1 text-sm font-semibold">
              VAT is included in price (20%)
            </p>
          </div>
        </div>
        <button
          form="payment-form"
          type="submit"
          className="w-full bg-lightBlack py-2 uppercase text-white"
          disabled={!form.validateForm()}
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutStepTwo;
