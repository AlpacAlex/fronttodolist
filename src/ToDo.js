import React, { useState } from "react";
import { Paper, Grid, Box, Checkbox, Input } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Delete } from "@material-ui/icons";
import styles from "./myStyle";



function ToDo({ todo, fullUpdateTask, removeTask }) {
    const [changeValue, setChangeValue] = useState(todo.name);
    const [isDisabled, setIsDisabled] = useState(false);
    const validInputText = /^[\w\s]{1,18}$/gm;

    const handleChangeValue = async (e) => {
        const newTextInput = e.currentTarget.value;
        setChangeValue(newTextInput);
        if (e.keyCode === 13) {
            const isValid = validInputText.test(newTextInput);
            if (isValid) {
                const err = await fullUpdateTask(todo.uuid, newTextInput, todo.done, false);
                err ? setChangeValue(todo.name) : setChangeValue(newTextInput);
            } else {
                setChangeValue(todo.name);
            }
            document.activeElement.blur();
        } else if (e.keyCode === 27) {
            setChangeValue(todo.name);
            document.activeElement.blur();
        }
    };

    const deleteTask = (uuid) => {
        setIsDisabled(true);
        removeTask(todo.uuid);
    }

    return (
        <Grid item xs={12}>
            <Paper elevation={2} style={styles.ToDo.Paper}>
                <Checkbox
                    checked={todo.done ? true : false}
                    onChange={() => { }}
                    onClick={() => fullUpdateTask(todo.uuid, todo.name, todo.done, true)}
                    color="secondary"
                />
                <Input
                    value={changeValue}
                    disableUnderline={true}
                    onChange={handleChangeValue}
                    onKeyDown={handleChangeValue}
                    style={{ width: "64%" }}
                />
                <Box component="span" style={styles.ToDo.Date} textAlign="right" m={1}>{new Date(todo.createdAt).toLocaleDateString()}</Box>
                <IconButton
                    style={styles.ToDo.Icon}
                    disabled={isDisabled}
                    color="secondary"
                    aria-label="Delete"
                    onClick={() => deleteTask(todo.uuid)}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </Paper>
        </Grid>
    );

}


export default ToDo;