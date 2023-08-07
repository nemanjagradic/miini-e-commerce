import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import classes from "./GridLayout.module.css";
import useIntersectionNav from "../../../hooks/useIntersectionNav";
import { useEffect, useRef, useState } from "react";
/* eslint-disable no-unused-vars */

const GridLayout = () => {
  const [runAgain, setRunAgain] = useState(false);
  useEffect(() => {
    // da bi se rerenderovao page zbog nav elementa i izvrsavanja useIntersectionNav
    setRunAgain(true);
  }, []);
  const gridContainer = useRef();
  useIntersectionNav({ root: null, threshold: 0 }, gridContainer.current);

  return (
    <Container className={classes.container}>
      <div className={classes["grid-container"]} ref={gridContainer}>
        <div
          className={`${classes["grid-container-item"]} ${classes["height-2"]} ${classes.w2}`}
        >
          <div className={classes["grid-content"]}>
            <img src="./images/bed.png" alt="" />
            <div className={classes.overlay}>
              <p>Bedroom</p>
            </div>
          </div>
        </div>
        <div className={classes[("grid-container-item", "w2")]}>
          <div className={classes["grid-content"]}>
            <img src="./images/light.png" alt="" />
            <div className={classes.overlay}>
              <p>Lighting</p>
            </div>
          </div>
        </div>
        <div className={classes[("grid-container-item", "w2")]}>
          <div className={classes["grid-content"]}>
            <img src="./images/kitchen.png" alt="" />
            <div className={classes.overlay}>
              <p>Kitchen</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default GridLayout;
