"use client";

import * as React from "react";
import { articles } from "@/data/articles";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = React.use(params);
  
  if (!id) {
    notFound();
  }

  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold text-red-600 mb-4">{article.title}</h1>
      <p className="text-gray-400 mb-8">{new Date(article.date).toLocaleDateString()}</p>
      <div className="prose max-w-none">
        <p className="text-gray-800">{article.content}</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {article.images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Image ${index + 1} for ${article.title}`}
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
        ))}
      </div>
      {article.embeds && (
        <div className="mt-8">
          {article.embeds.map((embed, index) => (
            <div key={index} className="aspect-w-16 aspect-h-9 mt-4">
              <iframe
                src={embed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

