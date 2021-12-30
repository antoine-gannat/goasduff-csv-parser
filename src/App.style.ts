import { makeStyles } from "@fluentui/react-make-styles";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
  },
  fileUploadZone: {
    width: "300px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#315bffe8",
    color: "white",
    ":hover": {
      cursor: "pointer",
      "-webkit-box-shadow": "3px 4px 20px 3px rgba(0,0,0,0.4)",
      boxShadow: "3px 4px 20px 3px rgba(0,0,0,0.4)",
    },
  },
  input: {
    display: "none",
  },
  resultArea: {
    marginTop: "20px",
    width: "90%",
    minHeight: "500px",
  },
  copyAllBtn: {
    marginTop: "5px",
    padding: "3px",
    color: "white",
    width: "150px",
    height: "30px",
    background: "#00c000",
    border: "none",
    ":hover": {
      cursor: "pointer",
    },
  },
});
