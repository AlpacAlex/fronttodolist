import React from 'react';
import { Box, Button, IconButton } from '@material-ui/core';
import {TrendingUpSharp, VerticalAlignBottom, VerticalAlignTop} from '@material-ui/icons';
import styles from "./myStyle";



function MenuToDo({ howToShowTask, sortTodo }) {
    return (
        <Box style={styles.MenuToDo.MenuTodo}>
            <Button className="all" onClick={() => howToShowTask("complate", true)}>All</Button>
            <Button className="done" onClick={() => howToShowTask("complate", true, true)}>Done</Button>
            <Button className="undone" onClick={() => howToShowTask("complate", false, true)} style={{ marginRight: 90  }}>Undone</Button>
            <Box component="span" className="sort">Sort by Date</Box>
            <IconButton
                id="up"
                color="primary"
                aria-label="up bottom"
                style={styles.MenuToDo.Icon}
                onClick={() => {sortTodo(true)}}
            >
                <VerticalAlignBottom fontSize="small" />
            </IconButton>
            <IconButton
                id="up"
                color="primary"
                aria-label="down bottom"
                style={styles.MenuToDo.Icon}
                onClick={() => {sortTodo(false)}}
            >
                <VerticalAlignTop fontSize="small" />
            </IconButton>
        </Box>
    )
}

export default MenuToDo;