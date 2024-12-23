import { Article } from "@/types/article";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type ArticleListProps = {
  articles: Article[];
};

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <Link 
          href={`/article/${article.id}`} 
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
              <p className="text-gray-600 mb-4">{article.content.slice(0, 100)}...</p>
              <p className="text-sm text-gray-400">{new Date(article.date).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

