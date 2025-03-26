import type { Mission } from '@/app/(dashboard)/planification/page'
import { useDraggable, closestCenter } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Avatar, AvatarGroup, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Resizable } from 'react-resizable'
import 'react-resizable/css/styles.css'

// Function to generate a unique color based on mission ID
const getMissionColor = (missionId: string): string => {
  // Define specific patterns and their corresponding colors
  const colorMap: { [key: string]: string } = {
    'mission-1': '#FF5733', // Coral for missions with "1" in their ID
    'mission-2': '#4CAF50', // Green for missions with "2" in their ID
    'mission-3': '#FFC107', // Amber for missions with "3" in their ID
    'mission-4': '#33FF57', //  Lime Green for missions with "4" in their ID
    'mission-5': '#A133FF', // Purple
    'mission-6': '#33FFF5', // Cyan
    'mission-7': '#9C53FF', // Pink
    'mission-8': '#33FF8C', // Mint
    'mission-9': '#8C33FF', // Violet
    'mission-10': '#FF33A1' // Gold
  }

  // Check if the mission ID matches any specific pattern
  for (const pattern in colorMap) {
    if (missionId.includes(pattern)) {
      return colorMap[pattern] // Return the predefined color
    }
  }

  // Fallback to a dynamic color for missions without a specific pattern
  const colors = [
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#E91E63', // Pink
    '#8BC34A' // Light Green
  ]

  // Hash the mission ID to get an index
  const hash = missionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % colors.length

  return colors[index]
}

// Mission Item Component
const MissionItem = ({
  mission,
  dayDate,
  isResizable = false,
  onResizeHandler,
  removeMission,
  isOver = false
}: {
  mission: Mission
  dayDate: string
  isResizable: boolean
  onResizeHandler: (missionId: string, newEndDate: string) => void
  removeMission: (missionId: string) => void
  isOver: boolean
}) => {
  const compositeId = `mission-${mission.id}-${dayDate}` // Composite ID for drag-and-drop

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: compositeId,
    data: mission
  })
  const [width, setWidth] = useState(10.5) // Default width
  const [rightOffset, setRightOffset] = useState(0)

  // Calculate the initial width based on startDate and endDate
  useEffect(() => {
    if (mission.startDate && mission.endDate && isResizable) {
      const start = new Date(mission.startDate)
      const end = new Date(mission.endDate)
      const timeDiff = end.getTime() - start.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
      const calculatedWidth = daysDiff * 10.5
      setWidth(calculatedWidth)
    }
  }, [mission.startDate, mission.endDate, isResizable])

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

    // updating the end date of the mission
    // Calculate the new end date based on the width
    const daysToAdd = Math.ceil(finalWidth / 10.5) - 1
    const newEndDate = new Date(new Date(dayDate).setDate(new Date(dayDate).getDate() + daysToAdd))
      .toISOString()
      .split('T')[0]

    // Get the date of the upcoming Sunday
    const startDate = new Date(dayDate)
    const startDayOfWeek = startDate.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysUntilSunday = 6 - startDayOfWeek

    const sundayDate = new Date(startDate.setDate(startDate.getDate() + daysUntilSunday)).toISOString().split('T')[0]

    // Ensure the new end date does not exceed the upcoming Sunday
    if (newEndDate > sundayDate) {
      // If it exceeds Sunday, set the end date to Sunday and adjust the width accordingly
      const daysUntilSundayFromStart = Math.round(
        (new Date(sundayDate).getTime() - new Date(dayDate).getTime()) / (1000 * 3600 * 24) + 2
      )
      const maxWidth = daysUntilSundayFromStart * 10.5 // Calculate the maximum width allowed
      setWidth(maxWidth) // Set the width to the maximum allowed
      onResizeHandler(mission.id, sundayDate)
    } else if (startDayOfWeek == 0) {
      // start date is the sunday date
      setWidth(10.5) // Set the width to the maximum allowed
      onResizeHandler(mission.id, sundayDate)
    } else {
      setWidth(finalWidth)
      onResizeHandler(mission.id, newEndDate)
    }
  }

  // Get the unique color for this mission
  const missionColor = getMissionColor(mission.id)

  const style = {
    transform: `${transform ? CSS.Transform.toString(transform) : ''} translateX(${rightOffset}rem)`,
    width: `${width}rem`,
    transition: 'width 0.2s ease-in-out',
    backgroundColor: isOver ? 'red' : '#2196F3'
  }
  if (isDragging) {
    style.backgroundColor = 'green'
  }

  if (/(\d{13})|(\d{4}-\d{2}-\d{2})/g.test(compositeId) && !isOver) {
    style.backgroundColor = missionColor
  }

  const NativeItem = (
    <div
      className={`p-2 mb-2 rounded bg-[#2196F3] text-white min-w-[10.5rem] hover:scale-105 hover:shadow text-center w-full flex items-center justify-between`}
      ref={setNodeRef}
      style={style}
    >
      {isResizable && (
        <IconButton
          className='cursor-pointer float-right '
          size='small'
          color='secondary'
          onClick={() => removeMission(mission.id)}
        >
          <span className='tabler-trash h-4 w-4 bg-white'></span>
        </IconButton>
      )}

      <span className='font-extralight truncate'>{mission.title}</span>
      <AvatarGroup max={4} spacing='medium' variant='circular'>
        <Avatar
          alt='Travis Howard'
          src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg'
          sx={{ width: 24, height: 24 }}
        />
        <Avatar
          alt='Agnes Walker'
          src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/993a9141332353.57a1ce913ee47.jpg'
          sx={{ width: 24, height: 24 }}
        />
        <Avatar
          alt='Trevor Henderson'
          content='+21'
          className='dark:bg-white dark:text-black'
          sx={{ width: 24, height: 24, textAlign: 'center', fontSize: '0.75rem' }}
        >
          +21
        </Avatar>
      </AvatarGroup>
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
      className='bg-blue-500 text-white rounded px-3 overflow-hidden min-w-[10.5rem]'
    >
      {NativeItem}
    </Resizable>
  ) : (
    NativeItem
  )
  return isDragging ? createPortal(Item, document.getElementById('calendar') as HTMLAnchorElement) : Item
}

export default MissionItem
