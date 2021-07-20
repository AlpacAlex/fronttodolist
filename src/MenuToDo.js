import React from 'react';
import { Box, Button, IconButton } from '@material-ui/core';
import {VerticalAlignBottom, VerticalAlignTop} from '@material-ui/icons';
import styles from "./myStyle";



function MenuToDo({ done }) {
    return (
        <Box style={styles.MenuToDo.MenuTodo}>
            <Button className="all" onClick={() => done({ it: "showAllTask" })}>All</Button>
            <Button className="done" onClick={() => done({ it: "showComplateTask" })}>Done</Button>
            <Button className="undone" onClick={() => done({ it: "showUncomplateTask" })} style={{ marginRight: 90  }}>Undone</Button>
            <Box component="span" className="sort">Sort by Date</Box>
            <IconButton
                id="up"
                color="primary"
                aria-label="up bottom"
                style={styles.MenuToDo.Icon}
                onClick={() => {done({it: "sortByDate" })}}
            >
                <VerticalAlignBottom fontSize="small" />
            </IconButton>
            <IconButton
                id="up"
                color="primary"
                aria-label="down bottom"
                style={styles.MenuToDo.Icon}
                onClick={() => {done({ it: "sortByReversDate" })}}
            >
                <VerticalAlignTop fontSize="small" />
            </IconButton>
        </Box>
    )
}

export default MenuToDo;