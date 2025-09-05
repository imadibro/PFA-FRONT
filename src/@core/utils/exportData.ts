const exportData = (data: any, columnsConfig: any, fieldHandlers: any = {}) => {
  if (!Array.isArray(data)) return []
  return data.map((item: any) => {
    return columnsConfig.reduce((objToReturn: any, col: any) => {
      if (!col.headerName || col.headerName === 'Actions') return objToReturn

      const { headerName, field } = col

      if (fieldHandlers[field]) {
        objToReturn[headerName] = fieldHandlers[field](item[field])
      } else {
        objToReturn[headerName] = item[field]
      }

      return objToReturn
    }, {})
  })
}

export default exportData
