import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TasksState {
  tasks: TaskItem[]
}

interface TaskItem {
  label: string
  description: string
}

const initialState: TasksState = { tasks: [] }

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {}
})

// export const { createTask, deleteTask, getTasks } = taskSlice.actions
export default taskSlice.reducer
