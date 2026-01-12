'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global Error:', error)
    }, [error])

    return (
        <html lang="en">
            <head>
                <title>Something went wrong - FarmLedger</title>
            </head>
            <body>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        A critical error occurred
                    </h1>
                    <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
                        {error.message || 'The application encountered an unexpected error.'}
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Try Refreshing the App
                    </button>
                </div>
            </body>
        </html>
    )
}
