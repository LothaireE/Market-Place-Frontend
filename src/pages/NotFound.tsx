import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router";

function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          // height: "100vh"
        }}
      >
        <Typography sx={{ textAlign: "center", my: 2 }}>
          The Page you are looking for does not exist
        </Typography>
        <Button
          variant="contained"
          sx={{ flex: 1, width: "fit-content", m: "0 auto" }}
        >
          <Link to={"/"}>return to homepage</Link>
        </Button>
      </Box>
    </Box>
  );
}

export default NotFound;
