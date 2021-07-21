import React, { useEffect } from "react";
import { useState, useMemo, useCallback } from 'react';
import MenuToDo from "./MenuToDo";
import ToDo from './ToDo';
import ToDoForm from './ToDoForm';
import { Paper, Grid, Box, Snackbar } from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import MuiAlert from '@material-ui/lab/Alert';
import styles from "./myStyle";
import useStyles from "./styleTheme";
const axios = require('axios');


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  //const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');


  const [error, setError] = useState({
    er: false,
    msg: null
  });
  //const [flag, setFlag] = useState(0); 
  
  //let totalRecords = currentTodo.length;
  const LIMIT = 5;
  const classes = useStyles();
  const URL = "https://todo-api-learning.herokuapp.com";//m


  const getTodos = async (userId = 1) => {
    const GET_REQUEST = `/v1/tasks/${userId}`;
    const urlAdres = URL + GET_REQUEST;
    try {
      if (filterBy === "all") {
        setFilterBy("");
      }
      const response = await axios.get(urlAdres, { 
        params: {
          filterBy: filterBy,
          order: order
        }
      })
      if (response.status === 200) {
        setCurrentTodo(response.data);
        //onPageChanged(1, 1);
      } 
    } catch (error) {
      setError({
        er: true,
        msg: error.response?.data?.message
      }); 
      //setCurrentTodo([]);
    }  
  }
 

  const postRequest = async (task, done = false, userId = 1) => {
    const GET_REQUEST = `/v1/task/${userId}`;
    const urlAdres = URL + GET_REQUEST;
    try {// if task ???
      const response = await axios.post(urlAdres, {
        name: task,
        done: done
      });
      //console.log(response);
      if (response.status === 200) {
        return response.data; 
      }
    } catch (error) {
      setError({
        er: true,
        msg: error.response?.data?.message
      });
    }
  }

  const patchRequest = async (uuid, task, done, userId = 1) => {
    const GET_REQUEST = `/v1/task/${userId}/${uuid}`;
    const urlAdres = URL + GET_REQUEST;
    try {
      const response = await axios.patch(urlAdres, {
        name: task,
        done: done
      });
      //console.log(response);
      if (response.status === 200) {
        return response.data; 
      }
    } catch (error) {
      setError({
        er: true,
        msg: error.response?.data?.message
      });
    }

  }

  const deleteRequest = async (uuid, userId = 1) => {
    const GET_REQUEST = `/v1/task/${userId}/${uuid}`;
    const urlAdres = URL + GET_REQUEST;
    try {
      const response = await axios.delete(urlAdres);
      //console.log(response);
      if (response.status === 204) {
        return response; 
      } else {
        //snack bar flag error
      }
    } catch (error) {
      setError({
        er: true,
        msg: error.response?.data?.message
      });
    }
  }

  const howToShowTask  = (filterBy) => setFilterBy(filterBy);
 
  const sortTodo = (orderBy) =>  setOrder(orderBy); 

  const addTask = async (userInput) => {
    await postRequest(userInput);
    //getDataRequest();
    await getTodos();
  }

  const removeTask = async (uuid) => {
    await deleteRequest(uuid);
    if (!((totalRecords - 1) % LIMIT)) {
      onPageChanged(1, currentPage - 1);
    }
    //getDataRequest();
    await getTodos();
  }

  const fullUpdateTask = async (uuid, task, done, isCheckBox) => {
    if (isCheckBox) {
      await patchRequest(uuid, task, !done);
    } else {
      await patchRequest(uuid, task, done);
    }
    await getTodos();
    //getDataRequest();
  }

  // const getDataRequest = useCallback( async () => {
  //   const myData = await getTodos();
  //   const newData = myData.slice(
  //     (currentPage - 1) * LIMIT,
  //     (currentPage - 1) * LIMIT + LIMIT
  //   );
  //   setCurrentTodo(newData);
  //   return myData;
  // }, [currentPage, filterBy, order] );
  
  const onPageChanged = useCallback(
    (event, page, maxPage=-1) => {
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


  const currentData = useMemo( () => {
    const currentData = [...currentTodo]
    .slice(
      (currentPage - 1) * LIMIT,
      (currentPage - 1) * LIMIT + LIMIT
    );
    //currentData.sort( (a,b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) );

    return currentData;
  }, [currentTodo, currentPage]);

  const totalRecords = useMemo( () => {
    return currentTodo.length;
  }, [currentTodo] );

  const pages = Math.ceil(totalRecords / LIMIT) || 0;
 


  useEffect( async () => {
    console.log("useEffect");
    await getTodos();
    onPageChanged(1, 1);
    //setCurrentTodo(serverData);
    //getDataRequest();
  }, [filterBy, order]);

  return (
    <Box className="App"> 
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper style={styles.App.Header} elevation={0}>ToDo: {currentTodo.length}</Paper>
          <Paper style={styles.App.Paper}>
            <ToDoForm addTask={addTask}/>
          </Paper>
          <MenuToDo
            howToShowTask = {howToShowTask}
            sortTodo = {sortTodo}
          />
          {currentData.map((todo) =>        
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
