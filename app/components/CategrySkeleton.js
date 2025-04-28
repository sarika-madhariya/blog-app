// components/CategorySkeleton.jsx
import React from 'react'

export default function CategorySkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Page title placeholder */}
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6 animate-pulse" />

            {/* Grid of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="border rounded overflow-hidden animate-pulse">
                        {/* Image placeholder */}
                        <div className="w-full h-48 bg-gray-300" />
                        {/* Text placeholders */}
                        <div className="p-4 space-y-2">
                            <div className="h-6 bg-gray-300 rounded w-3/4" />
                            <div className="h-4 bg-gray-300 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
