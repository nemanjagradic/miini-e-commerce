import { useParams } from "react-router-dom";
import ResetPass from "../components/Layout/Authentication/ResetPass";

const ResetPasswordPage = () => {
  const { token } = useParams();
  return <ResetPass token={token} />;
};

export default ResetPasswordPage;
