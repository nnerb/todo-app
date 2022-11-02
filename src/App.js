import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import {motion} from 'framer-motion'

/* Components */
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import lists from '../src/data/filterlists.json'

/* Contexts */
import { MainContext } from './Contexts/MainContext';

/* Styles */
import './styles/app.scss'

/* Variants */

const variants = {
  hidden: {
    x: -30,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "ease",
      duration: 0.3,
    },
  },
  exit: {
    x: -30,
    opacity: 0,
    transition: {
      type: "ease",
      duration: 0.3,
    }
  }
}

function App() {
  
  const [input, setInput] = useState(
    {
      id: "",
      task: "",
      isActive: true
    }
  )  

  const [task, setTask ] = useState(JSON.parse(localStorage.getItem("tasks")) || [])
  const [filterStatus, setFilterStatus] = useState(lists)
  
  const handleButtonValue = (name) => {
    setFilterStatus(prevFilter => prevFilter.map(data => {
       if(data.name === name){
        return {...data, status: true}
       }
       else{
        return {...data, status: false}
       }
            
    }))
  }

  const handleOnChange = (event) => {
    const {name,value} = event.target
    setInput(prevInput => {
      return {
        ...prevInput,
        [name]: value
      }
    })
  }
  
  const insertToTask = (event) => {
    event.preventDefault()
    const {task,isActive} = input
    if (!input.task) return 
    else{
      setTask(prevTask => {
        return [
          ...prevTask,
          {
            id: nanoid(),
            task: task,
            isActive: isActive
          }
        ]
      })
      
      return input.task = ""
    }  
  }

  const isComplete = (id) => {
    setTask(prevTask => prevTask.map(task => {
      return task.id === id ? 
             {
              ...task, 
              isActive: !task.isActive
             } :
             task
    }))
  }

  const deleteTask = (event, taskId) => {
    event.stopPropagation()
    setTask(prevTask => prevTask.filter(each => each.id !== taskId))
  }

  const showActive = task.filter(each => each.isActive)
  const showCompleted = task.filter(each => !each.isActive)

  const displayData = (task) => { 
    return task.map(each => {
        const isTrue = each.isActive ? "" : "true"
        const isLineThrough = each.isActive ? "" : "line-through"
          return <motion.li
                    layout
                    key={each.id}
                    className="each--tasks"
                    variants={variants}
                    initial="hidden"
                    animate="visible" 
                    exit="exit"  
                    >
                    <button
                    onClick={()=>isComplete(each.id)}
                    className={`button--checker ${isTrue}`}
                    >
                      {!each.isActive && <i className="fa fa-check" aria-hidden="true"></i>}
                    </button>
                    <p className={`task ${isLineThrough}`}>{each.task}</p>
                    <i className="fa fa-times" onClick={(event)=> deleteTask(event, each.id)} aria-hidden="true"></i>
                </motion.li>

    })
  }

  const noActiveComplete = (text) => {
   return  <motion.li
            layout
            variants={variants}
            initial="hidden"
            animate="visible" 
            >
            No {text} tasks.
            </motion.li>               
  }
  const displayTask = displayData(task)
  const displayActive = showActive.length ? displayData(showActive) : noActiveComplete("active")
  const displayCompleted = showCompleted.length ? displayData(showCompleted) : noActiveComplete("completed") 
   

  const indexStatus = filterStatus.map(each => each.status).indexOf(true)

  const mainDisplay = (index) => {
    if (index === 0) {
      return displayTask
    }
    else if (index === 1){
      return displayActive
    }
    else{
      return displayCompleted
    }
  }

  const currentDisplay = mainDisplay(indexStatus)

  const clearCompleted = () => {
    setTask(showActive)
  }

  useEffect(() => {
    localStorage.setItem("tasks",JSON.stringify(task))
  },[task])

  const numberOfTasks = task.length > 1 ? <p>{task.length} Items left</p> : <p>{task.length} Item left</p>
  const checkDisplay = task.length ? currentDisplay : <motion.li
                                                        layout
                                                        variants={variants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        >
                                                        No task exists!
                                                      </motion.li>         
                                                                        
                                                      
  return (
    <div className="App">
      <Header/>
      <MainContext.Provider
       value={
        {
         handleOnChange,
         input,
         insertToTask,
         checkDisplay,
         numberOfTasks,
         handleButtonValue,
         filterStatus,
         clearCompleted
          }
        }>
        <Main/>
      </MainContext.Provider>
      <Footer/>
    </div>
  );
}

export default App;
