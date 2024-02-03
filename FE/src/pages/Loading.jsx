import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import cat from "../img/cat.gif";

const Loading = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <img src={cat} alt="" style={{ width: "30%", borderRadius:"50%" }} />
    </Box>
  );
};

export default Loading;
