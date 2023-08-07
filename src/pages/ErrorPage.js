import MainNavigation from "../components/Layout/Main Navigation/MainNavigation";

const ErrorPage = () => {
  return (
    <>
      <MainNavigation />
      <div style={{ position: "relative", height: "60vh" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h1>ERROR 404</h1>
          <h3>Sorry, page not found.</h3>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
