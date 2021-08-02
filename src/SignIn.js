import { Paper, Grid, Button, Snackbar, TextField } from "@material-ui/core";
import styles from "./myStyle";
import { Link } from "react-router-dom";

function SignIn() {
    return (
        <Grid container spacing={0}>
            <Grid item xs={12} >
                <Paper style={styles.Sign.Header} elevation={0}>Sign In</Paper>
                <Paper style={styles.Sign.Paper} elevation={5}>
                    <TextField style={styles.Sign.TextField}
                        id="outlined-required"
                        label="Login"
                        variant="outlined"
                    />
                    <TextField 
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                    />
                    <Button variant="contained" color="primary" style={styles.Sign.Button}>
                        Sign In
                    </Button>
                </Paper>
                <Paper elevation={0} style={styles.UnderAuth}>
                    New user ToDo ? <Link to="/signup">Sign Up</Link>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default SignIn;