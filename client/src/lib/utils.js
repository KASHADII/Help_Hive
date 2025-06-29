import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safe rendering utility
export const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback
  
  if (typeof value === 'object') {
    // Handle address objects
    if (value.street || value.city || value.state || value.zipCode) {
      const parts = []
      if (value.street) parts.push(value.street)
      if (value.city) parts.push(value.city)
      if (value.state) parts.push(value.state)
      if (value.zipCode) parts.push(value.zipCode)
      return parts.join(', ')
    }
    
    // Handle contact person objects
    if (value.name || value.email || value.phone) {
      return value.name || value.email || value.phone || fallback
    }
    
    // For other objects, try to stringify
    try {
      return JSON.stringify(value)
    } catch {
      return fallback
    }
  }
  
  return String(value)
}

// Format date safely
export const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString()
  } catch {
    return 'Invalid Date'
  }
}

// Format location safely
export const formatLocation = (location) => {
  if (!location) return 'Location TBD'
  
  if (typeof location === 'object') {
    const parts = []
    if (location.city) parts.push(location.city)
    if (location.state) parts.push(location.state)
    return parts.join(', ') || 'Location TBD'
  }
  
  return String(location)
}
