import React from "react";
import Lottie from "react-lottie";
import * as animationData from "./rocket.json";

const LoadingContainer = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} width={200} height={200} />
    </div>
  );
};

export default LoadingContainer;
