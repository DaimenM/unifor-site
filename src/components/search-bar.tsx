"use client";

import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Article } from '@/types/article'
import { useRouter } from 'next/navigation'


export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSuggestions(data.results);
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
      }
    },
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  return (
    <div className="relative mb-8">
      <Input
        type="text"
        placeholder="Search articles..."
        className="pl-10 pr-4 py-2 border-2 border-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {suggestions.map((article) => (
            <div
              key={article.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery('');
                router.push(`/article/${article.id}`);
              }}
            >
              <p className="font-medium">{article.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
