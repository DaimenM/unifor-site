import { Article } from "@/types/article";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { stripMarkdown } from "@/lib/utils";

interface ArticleListProps {
  articles: Article[];
  urlPrefix?: string;
  urlSuffix?: string;
}

export default function ArticleList({ articles, urlPrefix = '/article/', urlSuffix = '' }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        There are no articles to show.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <Link 
          href={`${urlPrefix}${article.id}${urlSuffix}`} 
          key={article.id}
          className="animate-fade-up opacity-0"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            {article.images && article.images.length > 0 && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={article.images[0]}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-red-600">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {stripMarkdown(article.content).slice(0, 100)}...
              </p>
              <p className="text-sm text-gray-400">{new Date(article.date).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
