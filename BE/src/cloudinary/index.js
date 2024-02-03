const { log } = require("console");
const { resolve } = require("path");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImage = async (file) => {
  const newFileName = `${new Date().getTime()}-${file.originalname}`;
  // console.log(newFileName);
  // const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
  //   "base64"
  // )}`;
  // const data = await cloudinary.uploader.upload(
  //   dataUrl,
  //   {
  //     public_id: newFileName,
  //     resource_type: "auto",
  //     eager: [
  //       { width: 300, height: 300, crop: "pad" },
  //       // {
  //       //   width: 160,
  //       //   height: 100,
  //       //   crop: "crop",
  //       //   gravity: "south",
  //       // },
  //     ],
  //     // có thể thêm field folder nếu như muốn tổ chức
  //   },
  //   (err, result) => {
  //     if (result) {
  //       console.log("25", result.secure_url);
  //       // lấy secure_url từ đây để lưu vào database.
  //       return result.secure_url;
  //     }
  //   }
  // );
  // console.log(typeof data.secure_url);
  // return data.secure_url;
  // console.log(file);
  const data = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          filename_override: `${newFileName}`,
          use_filename: true,
          unique_filename: false,
        },
        (err, result) => reject(err)
      )
      .end(file?.buffer, (result) => {
        resolve(newFileName);
      });
  });

  return data;
};

// const uploadVideo = async (file) => {
//   const newFileName = `${new Date().getTime()}-${file.name}`;
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "video",
//           filename_override: `${newFileName}`,
//           use_filename: true,
//           unique_filename: false,
//           eager: [
//             { width: 300, height: 300, crop: "pad", audio_codec: "none" },
//             {
//               width: 160,
//               height: 100,
//               crop: "crop",
//               gravity: "south",
//               audio_codec: "none",
//             },
//           ],
//           eager_async: true,
//         },
//         (err) => reject(err)
//       )
//       .end(file?.data, () => resolve(newFileName));
//   });
// };

const uploadVideo = async (file) => {
  const newFileName = `${new Date().getTime()}-${file.originalname}`;

  const data = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video", // Thay đổi từ "image" thành "video"
          filename_override: `${newFileName}`,
          use_filename: true,
          unique_filename: false,
        },
        (err, result) => reject(err)
      )
      .end(file?.buffer, (result) => {
        resolve(newFileName);
      });
  });

  return data;
};


module.exports = { uploadImage, uploadVideo };
