'use client'

import React, { useEffect, useState } from 'react'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { add, CSS } from '@dnd-kit/utilities'
import { Button, IconButton } from '@mui/material'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { createPortal } from 'react-dom'
import { Resizable } from 'react-resizable'
import 'react-resizable/css/styles.css'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { Alert, Drawer, Skeleton } from '@mui/material'

// Define types
type Task = {
  id: string
  title: string
  startDate: string // Start date of the task
  endDate: string
}

type Day = {
  date: string // e.g., "2023-10-01"
  tasks: Task[]
}

type Week = {
  days: Day[]
  duplicates?: Week[] // Duplicates of the week
}

function generateWeeksOfYear(year: number): Week[] {
  const weeks: Week[] = []
  let currentDate = new Date(year, 0, 1) // Start from the first day of the year
  const lastDate = new Date(year + 1, 0, 0) // Last day of the year

  // Predefined list of tasks
  const initialTasks: Task[] = [
    { id: generateUniqueId('1'), title: 'Task 1', startDate: `${year}-03-04`, endDate: `${year}-03-06` },
    { id: generateUniqueId('2'), title: 'Task 2', startDate: `${year}-03-05`, endDate: `${year}-03-07` },
    { id: generateUniqueId('3'), title: 'Task 3', startDate: `${year}-06-15`, endDate: `${year}-06-17` },
    { id: generateUniqueId('4'), title: 'Task 4', startDate: `${year}-12-10`, endDate: `${year}-12-12` }
  ]

  // Adjust the current date to the first day of the week (Monday)
  const firstDayOfWeek = currentDate.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Calculate the offset to the previous Monday
  currentDate.setDate(currentDate.getDate() - offset) // Move back to the previous Monday

  // Loop through the entire year
  while (currentDate <= lastDate) {
    let currentWeek: Week = { days: [] }

    // Generate the days of the current week
    for (let i = 0; i < 7; i++) {
      if (currentDate > lastDate) break // Stop if we exceed the last day of the year

      const dateString = currentDate.toISOString().split('T')[0] // Format as YYYY-MM-DD

      // Find tasks that match the current date (only on their startDate)
      const tasksForDay = initialTasks.filter(task => {
        const taskStartDate = new Date(task.startDate).toISOString().split('T')[0]
        return taskStartDate === dateString // Only add tasks on their startDate
      })

      currentWeek.days.push({
        date: dateString,
        tasks: tasksForDay // Assign tasks to the day
      })

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Check for overlapping tasks in the current week
    const overlappingTasks = findOverlappingTasksInWeek(currentWeek)

    // If there are overlapping tasks, create duplicates
    if (overlappingTasks.length > 0) {
      const duplicates: Week[] = []

      // Create a duplicate week for each overlapping task
      for (const task of overlappingTasks) {
        const duplicateWeek: Week = {
          days: currentWeek.days.map(day => ({
            ...day,
            tasks: day.tasks.filter(t => t.id === task.id) // Only include the overlapping task
          }))
        }
        duplicates.push(duplicateWeek)
      }

      // Remove overlapping tasks from the original week
      currentWeek.days = currentWeek.days.map(day => ({
        ...day,
        tasks: day.tasks.filter(task => !overlappingTasks.some(t => t.id === task.id))
      }))

      // Assign duplicates to the current week
      currentWeek.duplicates = duplicates
    }

    // Push the current week to the weeks array
    weeks.push(currentWeek)
  }

  return weeks
}

// Helper function to find overlapping tasks in a week
function findOverlappingTasksInWeek(week: Week): Task[] {
  const overlappingTasks: Task[] = []

  // Get all tasks in the week
  const allTasks = week.days.flatMap(day => day.tasks)

  // Check for overlapping tasks
  for (let i = 0; i < allTasks.length; i++) {
    const task1 = allTasks[i]

    for (let j = i + 1; j < allTasks.length; j++) {
      const task2 = allTasks[j]

      // Check if the two tasks overlap
      if (doTasksOverlap(task1, task2)) {
        // Add both tasks to the overlapping tasks list if they are not already there
        if (!overlappingTasks.some(t => t.id === task1.id)) {
          overlappingTasks.push(task1)
        }
        if (!overlappingTasks.some(t => t.id === task2.id)) {
          overlappingTasks.push(task2)
        }
      }
    }
  }

  return overlappingTasks
}

// Helper function to check if two tasks overlap
function doTasksOverlap(task1: Task, task2: Task): boolean {
  const task1Start = new Date(task1.startDate)
  const task1End = new Date(task1.endDate)
  const task2Start = new Date(task2.startDate)
  const task2End = new Date(task2.endDate)

  return task1Start <= task2End && task1End >= task2Start
}
// Function to calculate the current week index
const getCurrentWeekIndex = (weeks: Week[]): number => {
  const currentDate = new Date().toISOString().split('T')[0]
  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].days.some(day => day.date === currentDate)) {
      return i
    }
  }
  return 0
}

// generateUniqueId function
const generateUniqueId = (originalId: string) => {
  return `${originalId}-${Date.now()}`
}

// Mock data for weeks
const initialWeeks: Week[] = generateWeeksOfYear(new Date().getFullYear())

// Mock data for tasks and employees
const initialTasks: Task[] = [
  { id: '1', title: 'Task 1', startDate: '', endDate: '' },
  { id: '2', title: 'Task 2', startDate: '', endDate: '' },
  { id: '3', title: 'Task 3', startDate: '', endDate: '' },
  { id: '4', title: 'Task 4', startDate: '', endDate: '' },
  { id: '5', title: 'Task 5', startDate: '', endDate: '' },
  { id: '6', title: 'Task 6', startDate: '', endDate: '' },
  { id: '7', title: 'Task 7', startDate: '', endDate: '' },
  { id: '8', title: 'Task 8', startDate: '', endDate: '' }
]

// Task Item Component
const TaskItem = ({
  task,
  dayDate,
  isResizable = false,
  onResizeHandler,
  removeTask
}: {
  task: Task
  dayDate: string
  isResizable: boolean
  onResizeHandler: (taskId: string, newEndDate: string) => void
  removeTask: (taskId: string) => void
}) => {
  const compositeId = `task-${task.id}-${dayDate}` // Composite ID for drag-and-drop

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: compositeId,
    data: task
  })
  const [width, setWidth] = useState(10.5) // Default width
  const [rightOffset, setRightOffset] = useState(0)

  // Calculate the initial width based on startDate and endDate
  useEffect(() => {
    if (task.startDate && task.endDate && isResizable) {
      const start = new Date(task.startDate)
      const end = new Date(task.endDate)
      const timeDiff = end.getTime() - start.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
      const calculatedWidth = daysDiff * 10.5
      setWidth(calculatedWidth)
    }
  }, [task.startDate, task.endDate, isResizable])

  const onResize = (event: React.SyntheticEvent, { size, handle }: { size: { width: number }; handle: string }) => {
    const newWidth = size.width
    const delta = newWidth - width * 16

    if (handle === 'e') {
      // setWidth(delta + width)
      setWidth(prevWidth => prevWidth + delta / 16)
    }
  }
  const onResizeStop = (
    _event: React.SyntheticEvent,
    { size, handle }: { size: { width: number }; handle: string }
  ) => {
    const newWidth = size.width

    const roundedWidth = Math.round(newWidth / 150) * 10.5

    const finalWidth = Math.max(roundedWidth, 10.5)

    setWidth(finalWidth)
    // updating the end date of the task
    // Calculate the new end date based on the width
    const daysToAdd = Math.ceil(finalWidth / 10.5) - 1
    const newEndDate = new Date(new Date(dayDate).setDate(new Date(dayDate).getDate() + daysToAdd))
      .toISOString()
      .split('T')[0]

    // Update the task's end date
    onResizeHandler(task.id, newEndDate)
  }

  const style = {
    transform: `${transform ? CSS.Transform.toString(transform) : ''} translateX(${rightOffset}px)`,
    width: `${width}rem`,
    transition: 'width 0.2s ease-in-out'
  }

  const NativeItem = (
    <div
      className={`p-2 mb-2 rounded bg-[#2196F3] text-white min-w-36 hover:scale-105 hover:shadow text-center w-full flex items-center justify-between`}
      ref={setNodeRef}
      style={style}
    >
      {isResizable && (
        <IconButton
          className='cursor-pointer float-right '
          size='small'
          color='secondary'
          onClick={() => removeTask(task.id)}
        >
          <span className='tabler-trash h-4 w-4 bg-white'></span>
        </IconButton>
      )}

      {task.title}
      <IconButton className='cursor-move float-right ' size='small' color='secondary' {...attributes} {...listeners}>
        <span className='tabler-grid-dots h-4 w-4 bg-white'></span>
      </IconButton>
    </div>
  )

  const Item = isResizable ? (
    <Resizable
      width={width * 16}
      axis='x'
      onResize={onResize}
      onResizeStop={onResizeStop}
      resizeHandles={['e']}
      className='bg-blue-500 text-white rounded flex items-center px-3 overflow-hidden cursor-ew-resize min-w-36'
    >
      {NativeItem}
    </Resizable>
  ) : (
    NativeItem
  )
  return isDragging ? createPortal(Item, document.getElementById('calendar') as HTMLAnchorElement) : Item
}

// Day Column Component
const DayColumn = ({
  day,
  onResizeHandler,
  isDuplicated = false,
  removeTask
}: {
  day: Day
  onResizeHandler: (taskId: string, newEndDate: string) => void
  isDuplicated?: boolean
  removeTask: (taskId: string) => void
}) => {
  const { setNodeRef } = useDroppable({
    id: day.date
  })
  // Get the day name from the date
  const dayName = new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })

  return (
    <div className='flex-1 pt-1 border border-spacing-0.5 max-w-44' ref={setNodeRef}>
      {!isDuplicated && (
        <h3 className='font-semibold mb-4 p-1 rounded text-center'>
          {dayName} <br />
          {day.date}
        </h3>
      )}
      <div className='max-w-36'>
        {day.tasks.length ? (
          <SortableContext items={[...day.tasks.map(task => task.id)]} strategy={verticalListSortingStrategy}>
            {day.tasks.map(task => (
              <TaskItem
                key={`task-${task.id}-${day.date}`}
                task={task}
                dayDate={day.date}
                isResizable={true}
                onResizeHandler={onResizeHandler}
                removeTask={removeTask}
              />
            ))}
          </SortableContext>
        ) : (
          <div className='p-2 py-5 text-slate-400 dark:text-gray-600 text-center rounded-lg font-extralight'></div>
        )}
      </div>
    </div>
  )
}

// Task List Component
const TaskList = ({
  tasks,
  removeTask,
  addTask
}: {
  tasks: Task[]
  removeTask: (taskId: string) => void
  addTask: () => void
}) => {
  return (
    <div className='p-2 px-1 border rounded-lg '>
      <div className='flex justify-between'>
        <h3 className='font-bold mb-4 px-2'>Tasks</h3>
        <Button className='cursor-pointer float-right ' size='small' color='secondary' onClick={() => addTask()}>
          <span className='tabler-plus h-4 w-4 bg-white'></span>
        </Button>
      </div>

      <PerfectScrollbar
        options={{ suppressScrollX: true, useBothWheelAxes: false, swipeEasing: true, wheelSpeed: 0.5 }}
        style={{ overflowY: 'visible' }}
      >
        <div className='max-h-60 p-4 flex flex-wrap gap-1'>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              dayDate={'task-list'}
              isResizable={false}
              onResizeHandler={() => {}}
              removeTask={removeTask}
            />
          ))}
        </div>
      </PerfectScrollbar>
    </div>
  )
}

// Calendar Component
const Calendar = ({
  weeks,
  currentWeekIndex,
  onNextWeek,
  onPrevWeek,
  onResizeHandler,
  duplicateCurrentWeek,
  removeTask
}: {
  weeks: Week[]
  currentWeekIndex: number
  onNextWeek: () => void
  onPrevWeek: () => void
  onResizeHandler: (taskId: string, newEndDate: string) => void
  duplicateCurrentWeek: () => void
  removeTask: (taskId: string) => void
}) => {
  const currentWeek = weeks[currentWeekIndex]
  const duplicatedWeeks = currentWeek.duplicates || []

  // Get the current date of the first day of the current week
  const currentDate = new Date(currentWeek.days[0].date)

  // Format the current month and year
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)
  const year = currentDate.getFullYear()

  return (
    <div className='p-4' id='calendar'>
      <div className='flex justify-between mb-4'>
        <Button onClick={onPrevWeek} aria-label='Previous Week' size='small' color='primary' variant='contained'>
          Previous Week
        </Button>
        <h2 className='text-xl font-semibold'>{`${monthName} ${year}`}</h2>
        <Button onClick={onNextWeek} aria-label='Next Week' size='small' color='primary' variant='contained'>
          Next Week
        </Button>
      </div>
      <PerfectScrollbar options={{ suppressScrollX: false, suppressScrollY: false, useBothWheelAxes: false }}>
        <div className='max-w-full max-h-[40rem] overflow-auto'>
          {/* Render the current week */}
          <div>
            <div className='flex'>
              {currentWeek.days.map(day => (
                <DayColumn key={day.date} day={day} onResizeHandler={onResizeHandler} removeTask={removeTask} />
              ))}
            </div>
          </div>

          {/* Render the duplicated weeks */}
          {duplicatedWeeks.map((week, index) => (
            <div key={`duplicated-week-${index}`} className=''>
              <div className='flex'>
                {week.days.map(day => (
                  <DayColumn
                    key={day.date}
                    day={day}
                    onResizeHandler={onResizeHandler}
                    isDuplicated={true}
                    removeTask={removeTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PerfectScrollbar>
      <div className='flex justify-end mt-4'>
        <Button
          onClick={duplicateCurrentWeek}
          aria-label='Duplicate Week'
          size='small'
          color='secondary'
          variant='contained'
        >
          Duplicate Week
        </Button>
      </div>
    </div>
  )
}

// Main App Component
const Page = () => {
  const [weeks, setWeeks] = useState<Week[]>(initialWeeks)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [currentWeekIndex, setCurrentWeekIndex] = useState(getCurrentWeekIndex(weeks))
  const [openModal, setOpenModal] = useState(false)

  // SweetAlert hook
  const { showConfirm } = useSweetAlert()

  const duplicateCurrentWeek = () => {
    setWeeks(prevWeeks => {
      const currentWeek = prevWeeks[currentWeekIndex]
      const newWeek = {
        days: currentWeek.days.map(day => ({
          ...day,
          tasks: [] // Reset tasks for the new week
        }))
      }

      // Add the duplicated week to the current week's duplicates array
      const updatedWeeks = [...prevWeeks]
      updatedWeeks[currentWeekIndex] = {
        ...currentWeek,
        duplicates: [...(currentWeek.duplicates || []), newWeek] // Add the new duplicated week
      }

      return updatedWeeks
    })
  }

  const handleTaskMove = (taskId: string, targetDayId: string) => {
    setWeeks(prevWeeks => {
      const updatedWeeks = [...prevWeeks]
      const originalTaskId = taskId.replace('task-', '').split('-')[0]?.trim()

      let task =
        tasks.find(t => t.id === originalTaskId) ||
        updatedWeeks.flatMap(week => week.days.flatMap(day => day.tasks)).find(t => t.id === originalTaskId)

      if (!task) return prevWeeks

      let currentDay: Day | undefined
      let targetDay: Day | undefined

      for (const week of updatedWeeks) {
        for (const day of week.days) {
          if (day.tasks.some(t => t.id === originalTaskId)) {
            currentDay = day
          }
          if (day.date === targetDayId) {
            targetDay = day
          }
        }

        // Check in duplicates
        if (week.duplicates) {
          for (const duplicate of week.duplicates) {
            for (const day of duplicate.days) {
              if (day.tasks.some(t => t.id === originalTaskId)) {
                currentDay = day
              }
              if (day.date === targetDayId) {
                targetDay = day
              }
            }
          }
        }
      }

      if (task && targetDay) {
        let uniqueId
        if (/(\d{13})|(\d{4}-\d{2}-\d{2})/g.test(taskId)) {
          uniqueId = taskId
        } else {
          uniqueId = generateUniqueId(taskId)
        }

        const copiedTask: Task = { ...task, id: uniqueId, startDate: targetDay.date, endDate: targetDay.date }

        // Remove task from current day
        // if (currentDay) {
        //   currentDay.tasks = currentDay.tasks.filter(
        //     t => t.id.replace('task-', '').split('-')[0]?.trim() !== originalTaskId
        //   )
        // }

        // Add task to the correct duplicated week's day
        if (
          !targetDay.tasks.some(
            t =>
              t.id.replace('task-', '').split('-')[0]?.trim() ===
              copiedTask.id.replace('task-', '').split('-')[0]?.trim()
          )
        ) {
          targetDay.tasks.push(copiedTask)
        }
      }

      return updatedWeeks
    })
  }

  const onResizeHandler = (taskId: string, newEndDate: string) => {
    setWeeks(prevWeeks => {
      const updatedWeeks = [...prevWeeks]

      for (const week of updatedWeeks) {
        for (const day of week.days) {
          const taskIndex = day.tasks.findIndex(t => t.id === taskId)
          if (taskIndex !== -1) {
            const task = day.tasks[taskIndex]
            task.endDate = newEndDate
            break
          }
        }
      }

      return updatedWeeks
    })
  }

  // Function to remove a task
  const removeTask = async (taskId: string) => {
    const confirm = await showConfirm('', 'Are you sure you want to remove this task?', 'Delete')

    if (confirm) {
      setWeeks(prevWeeks => {
        return prevWeeks.map(week => ({
          ...week,
          days: week.days.map(day => ({
            ...day,
            tasks: day.tasks.filter(task => task.id !== taskId)
          })),
          duplicates: week.duplicates?.map(duplicate => ({
            ...duplicate,
            days: duplicate.days.map(day => ({
              ...day,
              tasks: day.tasks.filter(task => task.id !== taskId)
            }))
          }))
        }))
      })
    }
  }

  // Function to add a task
  const addTask = () => {
    setOpenModal(true)
  }

  const handleNextWeek = () => {
    setCurrentWeekIndex(prev => (prev + 1) % weeks.length)
  }

  const handlePrevWeek = () => {
    setCurrentWeekIndex(prev => (prev - 1 + weeks.length) % weeks.length)
  }

  return (
    <div className='flex'>
      <DndContext
        onDragEnd={(event: DragEndEvent) => {
          const { active, over } = event
          if (over && active.id !== over.id) {
            if (active.id.toString().startsWith('task')) {
              handleTaskMove(active.id as string, over.id as string)
            }
          }
        }}
      >
        <div className='w-1/4 p-4'>
          <TaskList tasks={tasks} removeTask={removeTask} addTask={addTask} />
          <Drawer onClose={() => setOpenModal(false)} open={openModal} anchor={'right'}>
            Modal To Add Task
          </Drawer>
        </div>
        <div className='w-3/4'>
          <Calendar
            weeks={weeks}
            currentWeekIndex={currentWeekIndex}
            onNextWeek={handleNextWeek}
            onPrevWeek={handlePrevWeek}
            onResizeHandler={onResizeHandler}
            duplicateCurrentWeek={duplicateCurrentWeek}
            removeTask={removeTask}
          />
        </div>
      </DndContext>
    </div>
  )
}

export default Page
