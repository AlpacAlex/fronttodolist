import React, { useEffect } from "react";
import { useState, useCallback } from 'react';
import MenuToDo from "./MenuToDo";
import ToDo from './ToDo';
import ToDoForm from './ToDoForm';
import { Paper, Grid, Box, Snackbar } from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import MuiAlert from '@material-ui/lab/Alert';
import styles from "./myStyle";
import useStyles from "./styleTheme";
const axios = require('axios');
require('dotenv').config();


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const [currentTodo, setCurrentTodo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allRecords, setAllRecords] = useState();
  const [order, setOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('');


  const [error, setError] = useState({
    er: false,
    msg: null
  });


  const handleError = (err) => {
    setError({
      er: true,
      msg: err.response?.data?.message || err.message
    })
  }

  const LIMIT = 5;
  const classes = useStyles();
  const URL = process.env.REACT_APP_URL;



  const getTodos = useCallback(async (userId = 1) => {
    try {
      const response = await axios.get(`${URL}/tasks/${userId}`, {
        params: {
          page: currentPage,
          filterBy: filterBy,
          orderBy: order
        }
      })
      if (response.status === 200) {
        setCurrentTodo(response.data.rows);
        setAllRecords(response.data.count);
      }
    } catch (error) {
      handleError(error);
    }
  }, [URL, currentPage, filterBy, order]
  );


  const addNewTask = async (task, done = false, userId = 1) => {
    try {
      const response = await axios.post(`${URL}/task/${userId}`, {
        name: task,
        done: done
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      handleError(error);
    }
  }

  const updateTask = async (uuid, task, done, userId = 1) => {
    try {
      const response = await axios.patch(`${URL}/task/${userId}/${uuid}`, {
        name: task,
        done: done
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      handleError(error);
    }

  }

  const deleteTask = async (uuid, userId = 1) => {
    try {
      const response = await axios.delete(`${URL}/task/${userId}/${uuid}`);
      if (response.status === 204) {
        return response;
      }
    } catch (error) {
      handleError(error);
    }
  }

  const howToShowTask = (filterBy) => {
    setFilterBy(filterBy); 
    onPageChanged(1, 1);
  }

  const sortTodo = (orderBy) => setOrder(orderBy);

  const addTask = async (userInput) => {
    await addNewTask(userInput);
    await getTodos();
  }

  const removeTask = async (uuid) => {
    await deleteTask(uuid);
    if (!((allRecords - 1) % LIMIT)) {
      onPageChanged(1, currentPage - 1);
    }
    await getTodos();
  }

  const fullUpdateTask = async (uuid, task, done, isCheckBox) => {
    if (isCheckBox) {
      await updateTask(uuid, task, !done);
    } else {
      const err = await updateTask(uuid, task, done);
      if (!err)
        return true;
    }
    await getTodos();
  }

  const onPageChanged = useCallback(
    (event, page, maxPage = -1) => {
      if (page < 1) page++;
      if (maxPage !== -1 && page > maxPage) page--;
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
  };

  const pages = Math.ceil(allRecords / LIMIT) || 0;

  useEffect(() => {
    async function fixTodo() {
      await getTodos();
    }
    fixTodo();
  }, [filterBy, order, currentPage, getTodos]);

  return (
    <Box className="App">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper style={styles.App.Header} elevation={0}>ToDo: {allRecords}</Paper>
          <Paper style={styles.App.Paper}>
            <ToDoForm addTask={addTask} />
          </Paper>
          <MenuToDo
            howToShowTask={howToShowTask}
            sortTodo={sortTodo}
          />
          {currentTodo.map((todo) =>
            <ToDo
              key={Date.parse(todo.createdAt)}//Date.parse(todo.createdAt)
              todo={todo}
              fullUpdateTask={fullUpdateTask}
              removeTask={removeTask}
            />
          )}
          <Box className={classes.root}>
            {pages > 1 && <Pagination
              count={pages}
              onChange={onPageChanged}
              defaultPage={1}
              color="primary"
              classes={{ ul: classes.paginator }}
            />}
          </Box>
        </Grid>
        <Snackbar open={error.er} autoHideDuration={7000} onClose={handleCloseToast}>
          <Alert onClose={handleCloseToast} severity="error">
            {error.msg}
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
}

export default App;
