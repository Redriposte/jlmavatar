import React from "react";
import useImage from "use-image";
import { Image as KonvaImage } from "react-konva";

export const IndividualSticker = ({ image }) => {

const [stickerImage] = useImage(image.src);
const stickerHeight = stickerImage
  ? (image.width * stickerImage.height) / stickerImage.width
  : 0;

return (
  <KonvaImage
    draggable
    width={image.width}
    height={stickerHeight}
    image={stickerImage}
    x={image.x}
    y={image.x}
  />
);
};
