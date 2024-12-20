'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '@vercel/blob/client';
import { useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Article } from '@/types/article';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  images: z.array(z.string()).default([]),
});

export default function CreateArticle() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      images: [],
    },
  });

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return [];
    
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        return blob.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      form.setValue('images', uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      return [];
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newArticle: Article = {
      id: uuidv4(),
      title: values.title,
      content: values.content,
      images: values.images,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      router.push('/'); // Redirect to homepage
      router.refresh(); // Refresh the page data
    } catch (error) {
      console.error('Error creating article:', error);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter article title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write your article content here..." 
                    className="min-h-[200px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    disabled={uploading}
                  />
                </FormControl>
                <FormMessage />
                {field.value.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {field.value.map((url, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        Image {index + 1} uploaded
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />

          <Button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Create Article'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 