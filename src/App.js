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

  const [error, setError] = useState({
    er: false,
    msg: null
  });
  //const [flag, setFlag] = useState(0); 
  
  let totalRecords = currentTodo.length;
  const LIMIT = 5;
  const classes = useStyles();
  const URL = "https://todo-api-learning.herokuapp.com";

  const executeRequest  = async ({method, userId = "1", uuid = ""}, {task = "", done = false }) => {
    switch(method) {
      case "get":
        const GET_REQUEST = `/v1/tasks/${userId}`;
        const urlAdres = URL + GET_REQUEST;
        try {
          const response = await axios.get(urlAdres)
          //console.log(response)
          if (response.status === 200) {
            return response.data
            // const a = [...response.data]
            // setTodos([...response.data])
          } else {
            //snack bar
            // setError({
            //   er: true,
            //   msg: "error get request"
            // })
          }
        } catch (error) {
          //console.error(error)
          setError({
            er: true,
            msg: "error in receiving data\n(didn’t get a response from the server, try again)"
          })
        }
        break;
      case "post":
        if (task) {
          const GET_REQUEST = `/v1/task/${userId}`;
          const urlAdres = URL + GET_REQUEST;
          try {
            const response = await axios.post(urlAdres, {
              name: task,
              done: done
            });
            //console.log(response);
            if (response.status === 200) {
              return response.data; 
            } else {
              //snack bar flag error
            }
          } catch (error) {
            //console.error(error);
            setError({
              er: true,
              msg: "error in sending data\n(server did not receive data, change the task name to a unique one)"
            })
          }
        }
        break;
      case "patch":
        if (uuid) {
          const GET_REQUEST = `/v1/task/${userId}/${uuid}`;
          const urlAdres = URL + GET_REQUEST;
          try {
            const response = await axios.patch(urlAdres, {//проверку на статус и возвращение? данных(data)
              name: task,
              done: done
            });
            //console.log(response);
            if (response.status === 200) {
              return response.data; 
            } else {
              //snack bar flag error
            }
          } catch (error) {
            //console.log(error);
            setError({
              er: true,
              msg: "error in updating data\n(incorrect task change)"
            })
          }
        }
        break;
      case "delete":
        if (uuid) {
          const GET_REQUEST = `/v1/task/${userId}/${uuid}`;
          const urlAdres = URL + GET_REQUEST;
          try {
            const response = await axios.delete(urlAdres, {//проверку на статус и возвращение? данных(data)
              uuid: uuid,
              name: task,
              done: done
            });
            //console.log(response);
            if (response.status === 204) {
              return response; 
            } else {
              //snack bar flag error
            }
          } catch (error) {
            //console.log(error);
            setError({
              er: true,
              msg: "error in deleting data\n(the file is already being processed for deletion)"
            })
          }
        }
        break;
      default:
        console.log("method? error | default")
    }
    return true;
  }

  const done = async ({it, userInput = "", complete = -1, uuid = 0, upTask = "" }) => {// передача аргументов по структуре newItem

    //let done = [...todos];
    let curdone = [...currentTodo];

    switch(it) {
      case "addTask":
        if(userInput) {
          await executeRequest({ method: "post"}, { task: userInput });
          const allTask = await executeRequest({method: "get"}, {});
          curdone = [...allTask]; 
        }
        break;
      case "removeTask":
        if(uuid) {
          await executeRequest({ method: "delete", uuid: uuid }, { });
          const allTask = await executeRequest({method: "get"}, {});
          curdone = [...allTask];
          if (!((totalRecords - 1) % LIMIT)) {
            onPageChanged(1, currentPage - 1);
          }
        }
        break;
      case "changeChecbox":
        if (userInput && uuid && complete !== -1) {
          await executeRequest({method: "patch", uuid: uuid }, { task: userInput, done: !complete });
          const allTask = await executeRequest({method: "get"}, {});
          curdone = [...allTask];
        }
        break;
      case "showAllTask":
        const showAll = await executeRequest({method: "get"}, {});
        curdone = [...showAll];
        break;
      case "showComplateTask":
        const showComplate = await executeRequest({method: "get"}, {});
        curdone = [...showComplate.filter( (todo) => todo.done === true)];;
        onPageChanged(1, 1);
        break;
      case "showUncomplateTask":
        const showUnComplate = await executeRequest({method: "get"}, {});
        curdone = [...showUnComplate.filter( (todo) => todo.done === false)];
        onPageChanged(1, 1);
        break;
      case "sortByDate":
        const sortByDate = await executeRequest({method: "get"}, {});
        const sortTodo = [...sortByDate];
        sortTodo.sort( (a,b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) );
        curdone = [...sortTodo];
        break;
      case "sortByReversDate":
        const sortByReversDate = await executeRequest({method: "get"}, {});
        const sortTodoRevers = [...sortByReversDate];
        sortTodoRevers.sort( (a,b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) );
        curdone = [...sortTodoRevers];
        break;
      case "updateTask":
        if (uuid && upTask && complete !== -1) {
          await executeRequest({method: "patch", uuid: uuid }, { task: upTask, done: complete });
          const newTask = await executeRequest({method: "get"}, {});
          curdone = [...newTask];
        }
        break;
      default:
        console.log("error done task");
    }
    setCurrentTodo(curdone);
  };
  
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

  const pages = Math.ceil(totalRecords / LIMIT) || 0;
 
  useEffect( async () => {
    // async function deleteAll() {
    //   const allTask = await executeRequest({method: "get"}, {});
    //   for (let i = 0; i < allTask.length; i++) {
    //     await executeRequest({method: "delete", uuid: allTask[i].uuid }, { });
    //   }
    // }
    //deleteAll();
    const serverData = await executeRequest({method: "get"}, {});
    setCurrentTodo(serverData);
    //await executeRequest({ method: "post"}, { task: "test 1" });
    //await executeRequest({method: "patch", uuid: "0b1f790c-899d-44de-98c3-19c352acb8a8"}, { task: "update test 1", done: true });
    //await executeRequest({method: "get"}, {});
    //await executeRequest({method: "delete", uuid: "0b1f790c-899d-44de-98c3-19c352acb8a8"}, { task: "update test 1", done: true });//204(нет контента) все равно, но удаляет
    //await executeRequest({method: "delete", uuid: "0b1f790c-899d-44de-98c3-19c352acb8a8"}, { });// удалил без параметров тела
    //await executeRequest({method: "get"}, {});
  }, []);

  return (
    <Box className="App"> 
      <Grid container spacing={0}>
        <Paper style={styles.App.Header} elevation={0}>ToDo: {currentTodo.length}</Paper>
        <Grid item xs={12}>
          <Paper style={styles.App.Paper}>
            <ToDoForm done={done}/>
          </Paper>
          <MenuToDo
            done = {done}
          />
          {currentData.map((todo) =>        
            <ToDo
              key={Date.parse(todo.createdAt)}
              todo={todo}           
              done={done}
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
