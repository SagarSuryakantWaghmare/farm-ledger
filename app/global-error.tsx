'use client'

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">A critical error occurred</h2>
                    <button
                        className="px-6 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                        onClick={() => reset()}
                    >
                        Refresh App
                    </button>
                </div>
            </body>
        </html>
    )
}
