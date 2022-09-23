import React, { useContext } from "react";
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

/* Component */


/* Contexts */
import { MainContext } from "../Contexts/MainContext";

const Main = () => {
    const {
            input,
            handleOnChange,
            insertToTask,
            checkDisplay,
            numberOfTasks,
            handleButtonValue,
            filterStatus,
            clearCompleted
            } = useContext(MainContext)

    const styles = (list) => {
      return  {
        pointerEvents: list.status ? "none": "auto",
        color: list.status ? "#7575d3" : ""
      } 
    }
    
    const displayButton = 

        filterStatus.map(list => (
            <button
            key={list.name}
            style={styles(list)}
            onClick={()=>handleButtonValue(list.name)}
            className={`${list.name} buttons ${list.status ? "" : "hover"}`}
            >
            {list.name}
            </button>
        ))
    
    return(
            <main className="main">
                <h1> TODO </h1>
                <form onSubmit={insertToTask} autoComplete="off">
                    <input
                    type="text"
                    placeholder="Task..."
                    name="task"
                    value={input.task}
                    onChange={handleOnChange}
                    />
                </form>
                <LayoutGroup>
                    <motion.ul key= "ul" layout>
                        <AnimatePresence> 
                            {checkDisplay}
                        </AnimatePresence>
                        <motion.li key="li" layout className="li-functions">
                            {numberOfTasks}
                            <div className="mid-buttons">
                                {displayButton}
                            </div>
                            <div className="last-button">
                                <button onClick={clearCompleted} className="clear-button buttons">Clear Completed</button>
                            </div>
                        </motion.li>
                    </motion.ul> 
                </LayoutGroup>
            </main> 
    )
}

export default Main