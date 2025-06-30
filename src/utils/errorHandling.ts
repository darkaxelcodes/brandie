// Error handling utility functions

// Custom error class for application-specific errors
export class AppError extends Error {
  code: string
  
  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}

// Custom error class for API errors
export class APIError extends AppError {
  status: number
  
  constructor(message: string, status: number = 500, code: string = 'API_ERROR') {
    super(message, code)
    this.name = 'APIError'
    this.status = status
  }
}

// Custom error class for validation errors
export class ValidationError extends AppError {
  field?: string
  
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    this.field = field
  }
}

// Format error for display
export const formatError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unknown error occurred'
}

// Log error with additional context
export const logError = (error: unknown, context: Record<string, any> = {}): void => {
  console.error('Error:', {
    error,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href
  })
  
  // In a production app, you would send this to an error tracking service
  // like Sentry, LogRocket, etc.
}

// Try to parse a JSON string safely
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    logError(error, { json })
    return fallback
  }
}

// Safely access nested object properties
export const safeGet = <T>(
  obj: any,
  path: string,
  fallback: T
): T => {
  try {
    const keys = path.split('.')
    let result = obj
    
    for (const key of keys) {
      if (result === undefined || result === null) {
        return fallback
      }
      result = result[key]
    }
    
    return (result === undefined || result === null) ? fallback : result as T
  } catch (error) {
    logError(error, { obj, path })
    return fallback
  }
}