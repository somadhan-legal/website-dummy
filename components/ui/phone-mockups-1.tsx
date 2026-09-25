import React from "react";
import {
  ImageItem,
  PhoneCarousel,
} from "@/components/ui/phone-mockups-1-utils/phone-carousel";

type PhoneMockupBasicProps = {
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

const exampleImages: ImageItem[] = [
  {
    src: "/images/app-screens/categories.png",
    alt: "Choose a verified lawyer by legal service category",
    fullScreen: true,
  },
  {
    src: "/images/app-screens/service-summary.png",
    alt: "Service summary for booking a legal consultation",
    fullScreen: true,
  },
  {
    src: "/images/app-screens/call-connecting.png",
    alt: "Connecting with a lawyer by video call",
    fullScreen: true,
  },
  {
    src: "/images/app-screens/service-progress-files.png",
    alt: "Secure service progress and file sharing screen",
    fullScreen: true,
  },
  {
    src: "/images/app-screens/service-progress.png",
    alt: "Track progress updates for a legal service",
    fullScreen: true,
  },
];

export default function PhoneMockupBasic(props: PhoneMockupBasicProps) {
  return <PhoneCarousel images={exampleImages} {...props} />;
}
