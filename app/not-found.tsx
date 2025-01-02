import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-gray-400">Could not find requested resource</p>
        <Link 
          href="/"
          className="inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

