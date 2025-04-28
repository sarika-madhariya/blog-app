// components/BlogSkeleton.jsx
import React from 'react'

export default function BlogSkeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto p-6 space-y-8">
      {/* Title */}
      <div className="h-8 bg-gray-300 rounded w-2/3" />

      {/* Category and Author */}
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-300 rounded w-20" />
        <div className="h-4 bg-gray-300 rounded w-32" />
      </div>

      {/* Single Section (like your example) */}
      <div className="space-y-4">
        {/* Heading */}
        <div className="h-6 bg-gray-300 rounded w-1/3" />

        {/* Content lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
          <div className="h-4 bg-gray-300 rounded w-4/6" />
        </div>

        {/* Section Image */}
        <div className="h-64 bg-gray-300 rounded" />
      </div>

      {/* You can map more sections if needed */}
    </div>
  )
}
