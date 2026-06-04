'use client'
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { AppState, Project, Location, Task } from './types'
import { sampleProjects, sampleLocations, sampleTasks } from './sampleData'
import { generateId, now } from './utils'

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_PROJECT'; payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PROJECT'; payload: { id: string } & Partial<Project> }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_LOCATION'; payload: Omit<Location, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_LOCATION'; payload: { id: string } & Partial<Location> }
  | { type: 'DELETE_LOCATION'; payload: string }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string } & Partial<Task> }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState }

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload

    case 'ADD_PROJECT': {
      const project: Project = {
        ...action.payload,
        id: generateId(),
        createdAt: now(),
        updatedAt: now(),
      }
      return { ...state, projects: [project, ...state.projects] }
    }

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id
            ? { ...p, ...action.payload, updatedAt: now() }
            : p
        ),
      }

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        locations: state.locations.filter(l => l.projectId !== action.payload),
        tasks: state.tasks.filter(t => t.projectId !== action.payload),
      }

    case 'ADD_LOCATION': {
      const location: Location = {
        ...action.payload,
        id: generateId(),
        createdAt: now(),
        updatedAt: now(),
      }
      return { ...state, locations: [...state.locations, location] }
    }

    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map(l =>
          l.id === action.payload.id
            ? { ...l, ...action.payload, updatedAt: now() }
            : l
        ),
      }

    case 'DELETE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter(l => l.id !== action.payload),
      }

    case 'ADD_TASK': {
      const task: Task = {
        ...action.payload,
        id: generateId(),
        createdAt: now(),
        updatedAt: now(),
      }
      return { ...state, tasks: [...state.tasks, task] }
    }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, ...action.payload, updatedAt: now() }
            : t
        ),
      }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      }

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface StoreContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreContextValue | null>(null)

const STORAGE_KEY = 'rokeboard_v1'

const initialState: AppState = {
  projects: sampleProjects,
  locations: sampleLocations,
  tasks: sampleTasks,
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loaded, setLoaded] = React.useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AppState
        dispatch({ type: 'LOAD_STATE', payload: parsed })
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage errors
    }
  }, [state, loaded])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

// ─── Derived selectors ───────────────────────────────────────────────────────

export function useProject(id: string) {
  const { state } = useStore()
  return state.projects.find(p => p.id === id)
}

export function useProjectLocations(projectId: string) {
  const { state } = useStore()
  return state.locations.filter(l => l.projectId === projectId)
}

export function useProjectTasks(projectId: string) {
  const { state } = useStore()
  return state.tasks.filter(t => t.projectId === projectId)
}
