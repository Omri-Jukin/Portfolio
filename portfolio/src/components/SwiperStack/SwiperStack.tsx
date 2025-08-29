import React from "react";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";

import { EffectCards } from "swiper/modules";
import { Box } from "@mui/material";

export const SwiperStack: React.FC<SwiperProps> = ({
  children,
  ...swiperProps
}) => {
  return (
    <Box>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
        {...swiperProps}
      >
        <SwiperSlide>{children}</SwiperSlide>
      </Swiper>
    </Box>
  );
};
