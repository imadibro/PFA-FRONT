interface ITask {
  id: string
  label: string
  description: string
}

interface IRequirement {
  id: string
  label: string
  description: string
  priority: string
}

interface IOperation {
  id: string
  label: string
  description: string
  tasks?: ITask[]
}

interface ISite {
  id: string
  label: string
  description: string
  requirements?: IRequirement[]
}
