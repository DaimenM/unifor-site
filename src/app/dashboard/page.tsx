"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Article } from "@/types/article";
import { columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '@vercel/blob/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/ui/loading";
import { deleteImage } from "@/lib/images";
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type MonthlyStats = {
  month: string;
  desktop: number;
  mobile: number;
  tablet: number;
};

// Add form schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  images: z.array(z.string()).default([]),
});

export default function Dashboard() {
  const router = useRouter();
  const [chartData, setChartData] = useState<MonthlyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      images: [],
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const articles = await response.json();

      // Initialize monthly stats
      const monthlyStats: { [key: string]: MonthlyStats } = {};
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      // Initialize data structure for all months
      months.forEach(month => {
        monthlyStats[month] = {
          month,
          desktop: 0,
          mobile: 0,
          tablet: 0
        };
      });

      // Process visitors data from all articles
      articles.forEach((article: Article) => {
        article.visitors?.forEach(visit => {
          const date = new Date(visit.date);
          const month = months[date.getMonth()];
          const platform = visit.platform.toLowerCase();
          
          if (monthlyStats[month] && platform in monthlyStats[month]) {
            monthlyStats[month][platform as keyof Pick<MonthlyStats, 'desktop' | 'mobile' | 'tablet'>]++;
          }
        });
      });

      // Convert to array and sort by month
      const sortedData = months
        .map(month => monthlyStats[month]);

      setChartData(sortedData);
      setArticles(articles);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem("auth-token");
        router.push("/login");
        return;
      }
      setIsAuthChecking(false);
      fetchAnalytics();
    } catch (error) {
      console.error("Token verification error:", error);
      localStorage.removeItem("auth-token");
      router.push("/login");
    }
  }, [router]);

  if (isAuthChecking) {
    return <LoadingSpinner />;
  }

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    router.push("/login");
  };

  async function handleImageUpload(files: FileList | null, form: UseFormReturn<any>) {
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
      
      // Get existing images if any
      const existingImages = form.getValues('images') || [];
      
      // Combine existing and new images
      const newImages = [...existingImages, ...uploadedUrls];
      
      // Update form
      form.setValue('images', newImages);
      return newImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images"
      });
      return [];
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create articles.",
      });
      return;
    }

    const newArticle: Article = {
      id: uuidv4(),
      title: values.title,
      content: values.content,
      images: values.images,
      date: new Date().toISOString(),
      visitors: [],
    };

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newArticle),
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      // Reset form and close dialog
      form.reset();
      setIsDialogOpen(false);
      
      // Show success message
      toast({
        title: "Article Created",
        description: (
          <div>
            Article successfully created!{" "}
            <a 
              href={`/article/${newArticle.id}`} 
              className="underline text-blue-500"
            >
              View article
            </a>
          </div>
        ),
      });

      // Refresh the articles list
      fetchAnalytics();
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create article. Please try again.",
      });
    }
  }
  const handleDeleteConfirm = async (article: Article) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to delete articles"
        });
        return;
      }
  
      // First delete all associated images
      if (article.images && article.images.length > 0) {
        try {
          await Promise.all(
            article.images.map(async (imageUrl) => {
              await deleteImage(imageUrl);
            })
          );
        } catch (imageError) {
          console.error('Error deleting images:', imageError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete some images"
          });
          return; // Stop if image deletion fails
        }
      }
  
      // Then delete the article
      const response = await fetch('/api/articles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: `article:${article.id}` })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete article');
      }
  
      setArticles(prevArticles => prevArticles.filter(a => a.id !== article.id));
      setShowDeleteDialog(false);
      setArticleToDelete(null);
      
      toast({
        title: "Success", 
        description: `${article.title} was successfully deleted`
      });
      
      await fetchAnalytics();
  
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete article"
      });
    }
  };
  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
    setShowDeleteDialog(true);
  };

  const handleEditClick = (article: Article) => {
    setArticleToEdit(article);
    editForm.reset({
      title: article.title,
      content: article.content,
      images: article.images,
    });
    setIsEditDialogOpen(true);
  };

  async function onEditSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to edit articles"
      });
      return;
    }

    try {
      // Get the current article to compare images
      const currentArticle = articleToEdit;
      if(currentArticle) {const removedImages = currentArticle.images.filter(
        (img: string) => !values.images.includes(img)
      );
  
      // Delete removed images
      await Promise.all(
        removedImages.map((imageUrl: string) => deleteImage(imageUrl))
      );
    }
      // Create updated article object
      const updatedArticle = {
        ...articleToEdit,
        title: values.title,
        content: values.content,
        images: values.images,
      };

      // Then update the article
      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedArticle),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update article');
      }
  
      // Reset form and close dialog
      editForm.reset();
      setIsEditDialogOpen(false);
      setArticleToEdit(null);
      
      // Show success message
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
  
      // Refresh the articles list
      fetchAnalytics();
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update article"
      });
    }
  }

  return (
    <>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Delete Article</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete &quot;{articleToDelete?.title}&quot;? 
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
        Cancel
      </Button>
      <Button 
        variant="destructive" 
        onClick={() => handleDeleteConfirm(articleToDelete!)}
      >
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-red-600">
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> New Article
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
              <DialogDescription>
                Create a new public article for the site
              </DialogDescription>
            </DialogHeader>

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
                          onChange={(e) => handleImageUpload(e.target.files, form)}
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

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Create Article'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
              <DialogDescription>
                Make changes to your article
              </DialogDescription>
            </DialogHeader>

            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-8">
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter article content" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files, editForm)}
                          disabled={uploading}
                        />
                      </FormControl>
                      <FormMessage />
                      
                      {/* Add this new section for image previews */}
                      {field.value && field.value.length > 0 && (
  <div className="mt-4 border rounded-md">
    <table className="w-full">
      <thead className="bg-muted">
        <tr>
          <th className="p-2 text-left">Preview</th>
          <th className="p-2 text-left">File Name</th>
          <th className="p-2 text-left">Uploaded</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {field.value.map((imageUrl, index) => {
          // Extract filename from URL
          const fileName = imageUrl.split('/').pop() || `Image ${index + 1}`;
          // Use current date as upload date (you might want to store actual upload dates)
          const uploadDate = new Date().toLocaleDateString();
          
          return (
            <tr key={index} className="border-t">
              <td className="p-2">
                <div className="h-16 w-16 relative">
                  <img
                    src={imageUrl}
                    alt={fileName}
                    className="h-full w-full object-cover rounded-sm"
                  />
                </div>
              </td>
              <td className="p-2">
                <p className="text-sm truncate max-w-[200px]" title={fileName}>
                  {fileName}
                </p>
              </td>
              <td className="p-2">
                <p className="text-sm text-muted-foreground">
                  {uploadDate}
                </p>
              </td>
              <td className="p-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newImages = field.value.filter((_, i) => i !== index);
                    editForm.setValue('images', newImages);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)}
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="w-full overflow-hidden">
          <Card>
            <CardHeader>
              <CardTitle>Article Traffic</CardTitle>
              <CardDescription>
                Showing total visitors across all articles
              </CardDescription>
            </CardHeader>
            <CardContent className="relative w-full overflow-x-auto">
              <div className="min-w-[400px]">
                {isLoading ? (
                  <div>Loading analytics...</div>
                ) : (
                  <ChartContainer config={chartConfig} className="w-full min-h-[200px] max-h-[250px]">
                    <AreaChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: isMobile ? 8 : 12,
                        right: isMobile ? 8 : 12,
                        top: 10,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        interval={isMobile ? "preserveStartEnd" : 0}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Area
                        dataKey="mobile"
                        type="natural"
                        fill="var(--color-mobile)"
                        fillOpacity={0.4}
                        stroke="var(--color-mobile)"
                        stackId="a"
                      />
                      <Area
                        dataKey="desktop"
                        type="natural"
                        fill="var(--color-desktop)"
                        fillOpacity={0.4}
                        stroke="var(--color-desktop)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Traffic data for {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full overflow-x-auto mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                A list of all articles with their analytics and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading articles...</div>
              ) : (
                <DataTable 
                  columns={columns({ 
                    onDeleteClick: handleDeleteClick, 
                    onEditClick: handleEditClick 
                  })} 
                  data={articles} 
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}