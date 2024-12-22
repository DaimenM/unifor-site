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
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useForm } from 'react-hook-form';
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      images: [],
    },
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
      fetchAnalytics();
    } catch (error) {
      console.error("Token verification error:", error);
      localStorage.removeItem("auth-token");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    router.push("/login");
  };

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
  return (
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
              Create a new article for your blog
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

      <Card>
        <CardHeader>
          <CardTitle>Article Traffic</CardTitle>
          <CardDescription>
            Showing total visitors across all articles
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full overflow-x-auto">
          {isLoading ? (
            <div>Loading analytics...</div>
          ) : (
            <ChartContainer config={chartConfig} className="w-full min-h-[200px] max-h-[250px]">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
                width={1000}
                height={250}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
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

      <Card className="mt-6">
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
            <DataTable columns={columns} data={articles} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}