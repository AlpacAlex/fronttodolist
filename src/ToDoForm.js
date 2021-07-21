import { useState } from 'react'
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Box from "@material-ui/core/Box";



function ToDoForm({ addTask }) {
    const [userInput, setUserInput] = useState('');
    const validInputText = /^[\w\s]{0,25}$/gm;

    const handleChange = (e) => {
        e.preventDefault()
        const newTextInput = e.currentTarget.value;
        
        const isValid = validInputText.test(newTextInput);
        if (isValid) {
            setUserInput(e.currentTarget.value);
        }     
    };
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const isValidSpace = userInput.replace(/\s+/g, '').length;
        if (isValidSpace) {
            addTask(userInput);
            setUserInput("");
        }
        setUserInput("");
    };

    
    return (
        <FormControl component="form" onSubmit={handleSubmit} style={{ display: "flex" }} noValidate autoComplete="off">
            <Box style={{ display: "flex" }}>
                <TextField 
                type="text"
                onChange={handleChange}
                value={userInput}
                id="outlined-basic" 
                label="Введите значение..." 
                variant="outlined" 
                style={{ width: "80%" }}/>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ width: "20%" }}
                    >
                    Создать
                </Button>
            </Box>
        </FormControl>
    )
}

export default ToDoForm;