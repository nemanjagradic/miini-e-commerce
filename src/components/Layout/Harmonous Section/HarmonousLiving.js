import classes from "./HarmonousLiving.module.css";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const HarmonousLiving = ({ order }) => {
  let content;
  if (order === 1) {
    content = (
      <Container className={classes["harmonous-living"]}>
        <div className={`${classes["harmonous-living-row"]}`}>
          <div
            className={`${classes["harmonous-living-col"]} ${classes["harmonous-living-content"]}`}
          >
            <div className={classes["main-content"]}>
              <h2>Make your living creative and harmonous</h2>
              <p>
                Our products are made in all sizes so that you can choose
                according to your wish.
              </p>
              <Link to="/categories/all">Shop Now</Link>
            </div>
          </div>
          <div
            className={`${classes["harmonous-living-col"]} ${classes["harmonous-living-image"]}`}
          >
            <div className={classes["harmonous-image"]}>
              <img src="./images/harmonous-living.png" alt="" />
            </div>
          </div>
        </div>
      </Container>
    );
  }
  if (order === 2) {
    content = (
      <Container className={classes["harmonous-living"]}>
        <div className={`${classes["harmonous-living-row"]}`}>
          <div
            className={`${classes["harmonous-living-col"]} ${classes["harmonous-living-image"]}`}
          >
            <div className={classes["harmonous-image"]}>
              <img src="./images/harmonous-living-2.jpeg" alt="" />
            </div>
          </div>
          <div
            className={`${classes["harmonous-living-col"]} ${classes["harmonous-living-content"]}`}
          >
            <div className={classes["main-content"]}>
              <h2>Make your living creative and harmonous</h2>
              <p>
                Our products are made in all sizes so that you can choose
                according to your wish.
              </p>
              <Link to="/categories/all">Shop Now</Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }
  return content;
};

export default HarmonousLiving;
