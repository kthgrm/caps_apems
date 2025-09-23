import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    FolderOpen,
    Trophy,
    Globe,
    GraduationCap,
    Building,
    TrendingUp,
    Activity,
    Calendar
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface OverallStats {
    total_users: number;
    total_projects: number;
    total_awards: number;
    total_international_partners: number;
    total_campuses: number;
    total_colleges: number;
}

interface MonthlyStats {
    month: string;
    projects: number;
    awards: number;
    partners: number;
}

interface CampusStats {
    id: number;
    name: string;
    code: string;
    total_colleges: number;
    total_projects: number;
    total_awards: number;
    total_partners: number;
}

interface RecentActivity {
    id: number;
    type: string;
    title: string;
    description: string;
    user: string;
    campus: string;
    college: string;
    created_at: string;
    date_received?: string;
    location?: string;
}

interface TopContributor {
    id: number;
    name: string;
    email: string;
    campus: string;
    college: string;
    projects_count: number;
    awards_count: number;
    partners_count: number;
    total_submissions: number;
}

interface Props {
    overallStats: OverallStats;
    monthlyStats: MonthlyStats[];
    campusStats: CampusStats[];
    recentActivities: RecentActivity[];
}

// Chart colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard({
    overallStats,
    monthlyStats,
    campusStats,
    recentActivities,
}: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'project':
                return <FolderOpen className="h-4 w-4" />;
            case 'award':
                return <Trophy className="h-4 w-4" />;
            case 'partner':
                return <Globe className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const getActivityBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (type) {
            case 'project':
                return 'default';
            case 'award':
                return 'secondary';
            case 'partner':
                return 'outline';
            default:
                return 'outline';
        }
    };

    // Prepare data for campus performance pie chart
    const campusPieData = campusStats.map((campus, index) => ({
        name: campus.name,
        value: campus.total_projects + campus.total_awards + campus.total_partners,
        fill: COLORS[index % COLORS.length]
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <Card className='bg-linear-to-b from-indigo-600 to-sky-400 text-white drop-shadow-lg drop-shadow-zinc-400/50 border-0'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Technology Transfer</CardTitle>
                            <FolderOpen className="w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overallStats.total_projects}</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-linear-to-b from-amber-500 to-yellow-400 text-white drop-shadow-lg drop-shadow-zinc-400/50 border-0'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Awards and Recognition</CardTitle>
                            <Trophy className="w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overallStats.total_awards}</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-linear-to-b from-emerald-700 to-green-400 text-white drop-shadow-lg drop-shadow-zinc-400/50 border-0'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">International Partners</CardTitle>
                            <Globe className="w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overallStats.total_international_partners}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
                    <Card className='lg:col-span-3'>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Monthly Submissions
                            </CardTitle>
                            <CardDescription>
                                Projects, Awards, and International Partners submissions by month
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="projects" fill="#3b82f6" name="Projects" />
                                    <Bar dataKey="awards" fill="#10b981" name="Awards" />
                                    <Bar dataKey="partners" fill="#f59e0b" name="Partners" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className='lg:col-span-2'>
                        <CardHeader>
                            <CardTitle>Campus Performance</CardTitle>
                            <CardDescription>Total submissions by campus</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={campusPieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name = '', percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {campusPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className='lg:col-span-2'>
                        <CardHeader>
                            <CardTitle>Campus Statistics</CardTitle>
                            <CardDescription>
                                Detailed breakdown by campus
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {campusStats.map((campus) => (
                                    <div key={campus.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">{campus.name}</h3>
                                            <Badge variant="outline">{campus.total_colleges} Colleges</Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div className="text-center">
                                                <div className="font-medium text-blue-600">{campus.total_projects}</div>
                                                <div className="text-muted-foreground">Projects</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-medium text-green-600">{campus.total_awards}</div>
                                                <div className="text-muted-foreground">Awards</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-medium text-yellow-600">{campus.total_partners}</div>
                                                <div className="text-muted-foreground">Partners</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='lg:col-span-3'>
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                            <CardDescription>
                                Latest submissions across all categories
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
                                        <div className="flex-shrink-0 mt-1">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-medium truncate">
                                                    {activity.title}
                                                </h4>
                                                <Badge variant={getActivityBadgeVariant(activity.type)} className='capitalize'>
                                                    {activity.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{activity.campus} - {activity.college}</span>
                                                <span>{formatDate(activity.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}