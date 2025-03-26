'use client'

import React, { useState } from 'react'
import { rectIntersection, DndContext } from '@dnd-kit/core'
import 'react-resizable/css/styles.css'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { Drawer } from '@mui/material'
import MissionList from '@/components/planification/MissionList'
import Calendar from '@/components/planification/Calendar'

// Define types
export type Mission = {
  id: string
  title: string
  startDate: string // Start date of the mission
  endDate: string
}

export type Day = {
  date: string // e.g., "2023-10-01"
  missions: Mission[]
}

export type Week = {
  days: Day[]
  duplicates?: Week[] // Duplicates of the week
}

function generateWeeksOfYear(year: number): Week[] {
  const weeks: Week[] = []
  const currentDate = new Date(year, 0, 1) // Start from the first day of the year
  const lastDate = new Date(year + 1, 0, 0) // Last day of the year

  // Predefined list of missions
  const initialMissions: Mission[] = [
    { id: generateUniqueId('1'), title: 'Mission 1', startDate: `${year}-03-04`, endDate: `${year}-03-06` },
    { id: generateUniqueId('2'), title: 'Mission 2', startDate: `${year}-03-05`, endDate: `${year}-03-07` },
    { id: generateUniqueId('3'), title: 'Mission 3', startDate: `${year}-06-15`, endDate: `${year}-06-17` },
    { id: generateUniqueId('4'), title: 'Mission 4', startDate: `${year}-12-10`, endDate: `${year}-12-12` }
  ]

  // Adjust the current date to the first day of the week (Monday)
  const firstDayOfWeek = currentDate.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Calculate the offset to the previous Monday
  currentDate.setDate(currentDate.getDate() - offset) // Move back to the previous Monday

  // Loop through the entire year
  while (currentDate <= lastDate) {
    const currentWeek: Week = { days: [] }

    // Generate the days of the current week
    for (let i = 0; i < 7; i++) {
      if (currentDate > lastDate) break // Stop if we exceed the last day of the year

      const dateString = currentDate.toISOString().split('T')[0] // Format as YYYY-MM-DD

      // Find missions that match the current date (only on their startDate)
      const missionsForDay = initialMissions.filter(mission => {
        const missionStartDate = new Date(mission.startDate).toISOString().split('T')[0]
        return missionStartDate === dateString // Only add missions on their startDate
      })

      currentWeek.days.push({
        date: dateString,
        missions: missionsForDay // Assign missions to the day
      })

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Check for overlapping missions in the current week
    const overlappingMissions = findOverlappingMissionsInWeek(currentWeek)

    // If there are overlapping missions, create duplicates
    if (overlappingMissions.length > 0) {
      const duplicates: Week[] = []

      // Create a duplicate week for each overlapping mission
      for (const mission of overlappingMissions) {
        const duplicateWeek: Week = {
          days: currentWeek.days.map(day => ({
            ...day,
            missions: day.missions.filter(t => t.id === mission.id) // Only include the overlapping mission
          }))
        }
        duplicates.push(duplicateWeek)
      }

      // Remove overlapping missions from the original week
      currentWeek.days = currentWeek.days.map(day => ({
        ...day,
        missions: day.missions.filter(mission => !overlappingMissions.some(t => t.id === mission.id))
      }))

      // Assign duplicates to the current week
      currentWeek.duplicates = duplicates
    }

    // Push the current week to the weeks array
    weeks.push(currentWeek)
  }

  return weeks
}

// Helper function to find overlapping Missions in a week
function findOverlappingMissionsInWeek(week: Week): Mission[] {
  const overlappingMissions: Mission[] = []

  // Get all missions in the week
  const allMissions = week.days.flatMap(day => day.missions)

  // Check for overlapping missions
  for (let i = 0; i < allMissions.length; i++) {
    const mission1 = allMissions[i]

    for (let j = i + 1; j < allMissions.length; j++) {
      const mission2 = allMissions[j]

      // Check if the two missions overlap
      if (doMissionsOverlap(mission1, mission2)) {
        // Add both missions to the overlapping missions list if they are not already there
        if (!overlappingMissions.some(t => t.id === mission1.id)) {
          overlappingMissions.push(mission1)
        }
        if (!overlappingMissions.some(t => t.id === mission2.id)) {
          overlappingMissions.push(mission2)
        }
      }
    }
  }

  return overlappingMissions
}

// Helper function to check if two missions overlap
function doMissionsOverlap(mission1: Mission, mission2: Mission): boolean {
  const mission1Start = new Date(mission1.startDate)
  const mission1End = new Date(mission1.endDate)
  const mission2Start = new Date(mission2.startDate)
  const mission2End = new Date(mission2.endDate)

  return mission1Start <= mission2End && mission1End >= mission2Start
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

// Mock data for missions
const initialMissions: Mission[] = [
  { id: '1', title: 'Mission 1', startDate: '', endDate: '' },
  { id: '2', title: 'Mission 2', startDate: '', endDate: '' },
  { id: '3', title: 'Mission 3', startDate: '', endDate: '' },
  { id: '4', title: 'Mission 4', startDate: '', endDate: '' },
  { id: '5', title: 'Mission 5', startDate: '', endDate: '' },
  { id: '6', title: 'Mission 6', startDate: '', endDate: '' },
  { id: '7', title: 'Mission 7', startDate: '', endDate: '' },
  { id: '8', title: 'Mission 8', startDate: '', endDate: '' }
]

// Main App Component
const Page = () => {
  const [weeks, setWeeks] = useState<Week[]>(initialWeeks)
  const [missions, setMissions] = useState<Mission[]>(initialMissions)
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
          missions: [] // Reset missions for the new week
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

  const handleMissionMove = (missionId: string, targetDayId: string) => {
    const originalTargetDayId = targetDayId.replace(/.*(\d{4}-\d{2}-\d{2}).*/, '$1')
    setWeeks(prevWeeks => {
      const updatedWeeks = [...prevWeeks]
      const originalMissionId = missionId.replace('mission-', '').split('-')[0]?.trim()

      const mission =
        missions.find(t => t.id === originalMissionId) ||
        updatedWeeks.flatMap(week => week.days.flatMap(day => day.missions)).find(t => t.id === originalMissionId)

      if (!mission) return prevWeeks

      let currentDay: Day | undefined
      let targetDay: Day | undefined

      for (const week of updatedWeeks) {
        for (const day of week.days) {
          if (day.missions.some(t => t.id === originalMissionId)) {
            currentDay = day
          }
          if (day.date === originalTargetDayId) {
            targetDay = day
          }
        }

        // Check in duplicates
        if (week.duplicates) {
          for (const duplicate of week.duplicates) {
            for (const day of duplicate.days) {
              if (day.missions.some(t => t.id === originalMissionId)) {
                currentDay = day
              }
              if (day.date === originalTargetDayId) {
                targetDay = day
              }
            }
          }
        }
      }

      if (mission && targetDay) {
        let uniqueId
        if (/(\d{13})|(\d{4}-\d{2}-\d{2})/g.test(missionId)) {
          uniqueId = missionId
        } else {
          uniqueId = generateUniqueId(missionId)
        }

        const copiedMission: Mission = { ...mission, id: uniqueId, startDate: targetDay.date, endDate: targetDay.date }

        // Add mission to the correct duplicated week's day
        if (
          !targetDay.missions.some(
            t =>
              t.id.replace('mission-', '').split('-')[0]?.trim() ===
              copiedMission.id.replace('mission-', '').split('-')[0]?.trim()
          )
        ) {
          targetDay.missions.push(copiedMission)
        }
      }

      return updatedWeeks
    })
  }

  const onResizeHandler = (missionId: string, newEndDate: string) => {
    setWeeks(prevWeeks => {
      const updatedWeeks = [...prevWeeks]

      for (const week of updatedWeeks) {
        for (const day of week.days) {
          const missionIndex = day.missions.findIndex(t => t.id === missionId)
          if (missionIndex !== -1) {
            const mission = day.missions[missionIndex]
            mission.endDate = newEndDate
            break
          }
        }
      }

      return updatedWeeks
    })
  }

  // Function to remove a mission
  const removeMission = async (missionId: string) => {
    const confirm = await showConfirm('', 'Are you sure you want to remove this mission?', 'Delete')

    if (confirm) {
      setWeeks(prevWeeks => {
        return prevWeeks.map(week => ({
          ...week,
          days: week.days.map(day => ({
            ...day,
            missions: day.missions.filter(mission => mission.id !== missionId)
          })),
          duplicates: week.duplicates?.map(duplicate => ({
            ...duplicate,
            days: duplicate.days.map(day => ({
              ...day,
              missions: day.missions.filter(mission => mission.id !== missionId)
            }))
          }))
        }))
      })
    }
  }

  // Function to add a mission
  const addMission = () => {
    setOpenModal(true)
  }

  const handleNextWeek = () => {
    setCurrentWeekIndex(prev => (prev + 1) % weeks.length)
  }

  const handlePrevWeek = () => {
    setCurrentWeekIndex(prev => (prev - 1 + weeks.length) % weeks.length)
  }

  return (
    <div className='container'>
      <div className='flex'>
        <DndContext
          collisionDetection={rectIntersection}
          onDragEnd={(event: any) => {
            const { active, over } = event
            if (over && active.id !== over.id) {
              if (active.id.toString().startsWith('mission')) {
                handleMissionMove(active.id as string, over.id as string)
              }
            }
          }}
        >
          <div className='w-1/4 p-4'>
            <MissionList missions={missions} removeMission={removeMission} addMission={addMission} />
            <Drawer onClose={() => setOpenModal(false)} open={openModal} anchor={'right'}>
              Modal To Add Mission
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
              removeMission={removeMission}
            />
          </div>
        </DndContext>
      </div>
    </div>
  )
}

export default Page
