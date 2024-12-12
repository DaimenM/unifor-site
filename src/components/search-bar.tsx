import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="relative mb-8">
      <Input
        type="text"
        placeholder="Search articles..."
        className="pl-10 pr-4 py-2 border-2 border-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  )
}

