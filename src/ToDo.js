import React, { useState } from "react";
import { Paper, Grid, Box, Checkbox, Input } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Delete } from "@material-ui/icons";
import styles from "./myStyle";



function ToDo({ todo, done }) {
    const [changeValue, setChangeValue] = useState(todo.name);
    const validInputText = /^[\w\s]{1,18}$/gm;

    const handleChangeValue = (e) => {
        const newTextInput = e.currentTarget.value;
        setChangeValue(newTextInput);
        if (e.keyCode === 13)
        {
            const isValid = validInputText.test(newTextInput);
            if (isValid) {
                done({ it: "updateTask", complete: todo.done, uuid: todo.uuid, upTask: newTextInput });
            } else {
                setChangeValue(todo.name);
            }
            document.activeElement.blur();
        } else if (e.keyCode === 27) {
            setChangeValue(todo.name);
            document.activeElement.blur();
        }
    };

    //{it, userInput = "", complete = -1, uuid = 0, upTask = "" }
    return (
        <Grid item xs={12}>
            <Paper elevation={2} style={styles.ToDo.Paper}>
                <Checkbox 
                    checked={todo.done ? true : false}
                    onChange={()=>{}} 
                    onClick={() => done({ it: "changeChecbox", userInput: todo.name, complete: todo.done, uuid: todo.uuid })}
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
                    color="secondary"
                    aria-label="Delete"
                    onClick={() => done({ it: "removeTask", uuid: todo.uuid })}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </Paper>
        </Grid> 
    );
    
}


export default ToDo;