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
  const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');


  const [error, setError] = useState({
    er: false,
    msg: null
  });
  //const [flag, setFlag] = useState(0); 
  
  let totalRecords = currentTodo.length;
  const LIMIT = 5;
  const classes = useStyles();
  const URL = "https://todo-api-learning.herokuapp.com";

  /*const executeRequest  = async ({method, userId = "1", uuid = ""}, {task = "", done = false }, { filter="", order="" }) => {
    switch(method) {
      case "get":
        if (filter && order) {
          const GET_REQUEST = `/v1/tasks/${userId}?filterBy=${filter}&order=${order}`;
          const urlAdres = URL + GET_REQUEST;
          try {
            const response = await axios.get(urlAdres)
            if (response.status === 200) {
              return response.data;
            } 
          } catch (error) {
            setError({
              er: true,
              msg: error.response.data.message
            });
          }
        } else if (filter) {
          const GET_REQUEST = `/v1/tasks/${userId}?filterBy=${filter}`;
          const urlAdres = URL + GET_REQUEST;
          try {
            const response = await axios.get(urlAdres)
            if (response.status === 200) {
              return response.data;
            } 
          } catch (error) {
            setError({
              er: true,
              msg: error.response.data.message
            });
          }
        } else if (order) {
          const GET_REQUEST = `/v1/tasks/${userId}?order=${order}`;
          const urlAdres = URL + GET_REQUEST;
          try {
            const response = await axios.get(urlAdres)
            if (response.status === 200) {
              return response.data;
            } 
          } catch (error) {
            setError({
              er: true,
              msg: error.response.data.message
            });
          }
        } else {
          const GET_REQUEST = `/v1/tasks/${userId}`;
          const urlAdres = URL + GET_REQUEST;
          try {
            const response = await axios.get(urlAdres)
            if (response.status === 200) {
              return response.data;
            } 
          } catch (error) {
            setError({
              er: true,
              msg: error.response.data.message
            });
          }
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
            console.log(response);
            if (response.status === 200) {
              return response.data; 
            }
          } catch (error) {
            setError({
              er: true,
              msg: error.response.data.message
            });
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
            }
          } catch (error) {
            setError({
              er: true,
              msg: error.response.data.message
            });
            
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
            setError({
              er: true,
              msg: error.response.data.message
            });
          }
        }
        break;
      default:
        console.log("method? error | default");
    }
    return true;
  }*/

  const getRequest = async (userId = 1) => {
    const GET_REQUEST = `/v1/tasks/${userId}`;
    const urlAdres = URL + GET_REQUEST;
    try {
      const response = await axios.get(urlAdres, { 
        params: {
          filterBy: filterBy,
          order: order
        }
      })
      if (response.status === 200) {
        return response.data;
      } 
    } catch (error) {
      setError({
        er: true,
        msg: error.response.data.message
      });
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
        msg: error.response.data.message
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
        msg: error.response.data.message
      });
      
    }
  }

  const deleteRequest = async (uuid, userId = 1) => {
    const GET_REQUEST = `/v1/task/${userId}/${uuid}`;
    const urlAdres = URL + GET_REQUEST;
    try {
      const response = await axios.delete(urlAdres, {//проверку на статус и возвращение? данных(data)
        uuid: uuid
      });
      //console.log(response);
      if (response.status === 204) {
        return response; 
      } else {
        //snack bar flag error
      }
    } catch (error) {
      setError({
        er: true,
        msg: error.response.data.message
      });
    }
  }
  
  const howToShowTask  = (filterBy) => filterBy(filterBy);

  // const howToShowTask = (sTask, param, isAll = false) => {
  //   //let curdone = [...todos];
  //   switch(sTask) {
  //     case "add":
  //       if(param) {
  //         const newItem = {
  //           id: Date.now(),
  //           task: param,
  //           complete: false,
  //         };
  //         setTodos([...todos, newItem]);
  //         setCurrentTodo([...todos, newItem]);
  //       }
  //       break;
  //     case "complate":
  //       let curdone = [...todos];
  //       if (isAll) {
  //         curdone = [...todos.filter( (todo) => todo.complete === (param ? true : false))];
  //       }          
  //       setCurrentTodo(curdone);
  //       onPageChanged(1, 1);
  //       break;
  //   }
  // }
 
  const sortTodo = (orderBy) =>  setOrder(orderBy); 

  const removeTask = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)])
    setCurrentTodo([...todos.filter((todo) => todo.id !== id)])
    if (!((totalRecords - 1) % LIMIT)) {
      onPageChanged(1, currentPage - 1)
    }
  }

  const handleToggle = (id) => {
    const findId = todos.findIndex( (todo) => todo.id === id)
    const copyTodo = [...todos]
    copyTodo[findId].complete = !copyTodo[findId].complete
    setCurrentTodo([...copyTodo])
    setTodos([...copyTodo])
  }

  const updateTask = (id, upTask) => {
    const findId = todos.findIndex( (todo) => todo.id === id)
    const copyTodo = [...todos]
    copyTodo[findId].task = upTask

    //const newUpdTask = todos.map( (todo) => todo.id === id ? { ...todo, task: upTask} : { ...todo} )
    setTodos([...copyTodo])
    setCurrentTodo([...copyTodo])
  }
  
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
 
  // useEffect( async () => {
  //   // async function deleteAll() {
  //   //   const allTask = await executeRequest({method: "get"}, {});
  //   //   for (let i = 0; i < allTask.length; i++) {
  //   //     await executeRequest({method: "delete", uuid: allTask[i].uuid }, { });
  //   //   }
  //   // }
  //   //deleteAll();
  //   //const serverData = await executeRequest({method: "get"}, {}, { order: "asc" });
  //   //setCurrentTodo(serverData);
  //   //await executeRequest({ method: "post"}, { task: "test 1" });
  //   //await executeRequest({method: "patch", uuid: "0b1f790c-899d-44de-98c3-19c352acb8a8"}, { task: "update test 1", done: true });
  //   //await executeRequest({method: "get"}, {});
  //   //await executeRequest({method: "delete", uuid: "0b1f790c-899d-44de-98c3-19c352acb8a8"}, { task: "update test 1", done: true });//204(нет контента) все равно, но удаляет
  //   //await executeRequest({method: "delete", uuid: "0b1f790c-899d-44de-98c3-19c352acb8a8"}, { });// удалил без параметров тела
  //   //await executeRequest({method: "get"}, {});
  // }, []);

  return (
    <Box className="App"> 
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper style={styles.App.Header} elevation={0}>ToDo: {currentTodo.length}</Paper>
          <Paper style={styles.App.Paper}>
            <ToDoForm howToShowTask={howToShowTask}/>
          </Paper>
          <MenuToDo
            howToShowTask = {howToShowTask}
            sortTodo = {sortTodo}
          />
          {currentData.map((todo) =>        
            <ToDo
              key={todo.id}//Date.parse(todo.createdAt)
              todo={todo}           
              handleToggle={handleToggle}
              removeTask={removeTask}
              updateTask={updateTask}
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
