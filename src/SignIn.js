import { Paper, Grid, Button, Snackbar, TextField } from "@material-ui/core";
import styles from "./myStyle";
import { Link } from "react-router-dom";
import { useState } from "react";
const axios = require('axios');

function SignIn() {
    const [loginInput, setLoginInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const handleChangeLogin = (e) => {
        e.preventDefault()
        setLoginInput(e.currentTarget.value);     
    };

    const handleChangePassword = (e) => {
        e.preventDefault()
        setPasswordInput(e.currentTarget.value);     
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("submit");
        console.log("login", loginInput);
        console.log("password", passwordInput);
    }



    return (
        <Grid container spacing={0}>
            <Grid item xs={12} >
                <Paper style={styles.Sign.Header} elevation={0}>Sign In</Paper>
                <Paper style={styles.Sign.Paper} elevation={5}>
                    <form onSubmit={handleSubmit} style={{ display: "block" }} noValidate autoComplete="off">
                        <TextField style={styles.Sign.TextField}
                            id="outlined-required"
                            label="Login"
                            type="text"
                            variant="outlined"
                            value={loginInput}
                            onChange={handleChangeLogin}
                        />
                        <TextField 
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            value={passwordInput}
                            onChange={handleChangePassword}
                        />
                        <Button type="submit" variant="contained" color="primary" style={styles.Sign.Button}>
                            Sign In
                        </Button>
                    </form>
                </Paper>
                <Paper elevation={0} style={styles.UnderAuth}>
                    New user ToDo ? <Link to="/signup">Sign Up</Link>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default SignIn;