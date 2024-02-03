import React from "react";
import { CLOUDINARY_URL, CLOUDINARY_VIDEO_URL } from "../../config";
import ReactPlayer from 'react-player';


const MediaDisplay=(prop)=> {
  // Kiểm tra nếu là file ảnh
  const isImage = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(prop.src);

  // Kiểm tra nếu là file video
  const isVideo = /\.(mp4|webm|ogg)$/i.test(prop.src);


  if (isImage) {
    return (
      <img
        src={`${CLOUDINARY_URL}/${prop.src}`}
        className="rounded-xl w-full"
        style={{ maxWidth: "100%"}}
        alt="Image"
      />
    );
  } else if (isVideo) {
    return (
        <div className="rounded-xl overflow-hidden flex justify-center items-center">
            <ReactPlayer className="w-full" url={`${CLOUDINARY_VIDEO_URL}/${prop.src}`} style={{ maxWidth: "100%"}} controls />
        </div>
    );
  } else {
    return <p>Cannot display...</p>;
  }
};

export default MediaDisplay;
