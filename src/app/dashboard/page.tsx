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
import type { Article } from "@/types/article";

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

export default function Dashboard() {
  const router = useRouter();
  const [chartData, setChartData] = useState<MonthlyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all articles from KV
        const response = await fetch('/api/articles');
        const articles: Article[] = await response.json();

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
        articles.forEach(article => {
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
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

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

  console.log(chartData);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-red-600">
          Admin Dashboard
        </h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

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
    </main>
  );
}