import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TaskState {
  label: string
  description: string
}

const initialState: TaskState = { label: '', description: '' }

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {}
})

// export const { createTask, deleteTask, getTasks } = taskSlice.actions
export default taskSlice.reducer
