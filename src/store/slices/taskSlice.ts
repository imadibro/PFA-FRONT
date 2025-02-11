import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

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
  reducers: {
    // getTasks:(state,action:PayloadAction<TasksState[]>){
    //   const appPlanLimitations = queryClient.getQueryData<AppLimits>([
    //     'app-limits',
    //   ]);
    // }
  }
})

// export const { createTask, deleteTask, getTasks } = taskSlice.actions
export default taskSlice.reducer
