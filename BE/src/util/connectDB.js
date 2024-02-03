const mongoose = require("mongoose");
const connection = async (req, res) => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("ket noi db thanh cong ");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connection;
