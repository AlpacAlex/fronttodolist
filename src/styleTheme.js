import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({//app
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
        display: "flex",
        margin: "auto",
        fontSize: 20
      },
    },
    paginator: {
      margin: "auto",
      justifyContent: "center",
      padding: "10px"
    }
  }));
  
  export default useStyles;