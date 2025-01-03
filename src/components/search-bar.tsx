"use client";

import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Article } from '@/types/article'
import { useRouter } from 'next/navigation'

// Cache interface
interface Cache {
  [query: string]: {
    results: Article[];
    timestamp: number;
  }
}

export default function SearchBar({ initialArticles }: { initialArticles: Article[] }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  
  // Create a cache ref that persists between renders
  const searchCache = useRef<Cache>({});
  const localArticles = useRef<Article[]>(initialArticles);

  const searchLocalArticles = (searchQuery: string): Article[] => {
    const normalizedQuery = searchQuery.toLowerCase();
    return localArticles.current.filter(article =>
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.content.toLowerCase().includes(normalizedQuery)
    ).slice(0, 5);
  };

  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      // First, check cache
      const cached = searchCache.current[searchQuery];
      if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        setSuggestions(cached.results);
        return;
      }

      // Then try local search
      const localResults = searchLocalArticles(searchQuery);
      if (localResults.length > 0) {
        setSuggestions(localResults);
        // Cache the results
        searchCache.current[searchQuery] = {
          results: localResults,
          timestamp: Date.now()
        };
        return;
      }

      // Only if local search yields no results, call API
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSuggestions(data.results);
        // Cache the API results
        searchCache.current[searchQuery] = {
          results: data.results,
          timestamp: Date.now()
        };
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
    }, 500); // Increased debounce time

    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative mb-8">
      <Input
        type="text"
        placeholder="Search articles..."
        className="pl-10 pr-4 py-2 border-2 border-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      
      {showSuggestions && query.length >= 2 && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {suggestions.length > 0 ? (
            suggestions.map((article) => (
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
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
