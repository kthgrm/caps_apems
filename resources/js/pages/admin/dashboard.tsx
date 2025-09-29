import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    FolderOpen,
    Trophy,
    Globe,
    TrendingUp,
    Target,
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
    total_colleges: number;
    total_projects: number;
    total_awards: number;
    total_partners: number;
}

interface Props {
    overallStats: OverallStats;
    monthlyStats: MonthlyStats[];
    campusStats: CampusStats[];
    selectedYear?: string;
    availableYears?: string[];
}

// Chart colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard({
    overallStats,
    monthlyStats,
    campusStats,
    selectedYear: propSelectedYear,
    availableYears: propAvailableYears,
}: Props) {
    const [target, setTarget] = useState<number>(10);
    const [selectedYear, setSelectedYear] = useState<string>(
        propSelectedYear || new Date().getFullYear().toString()
    );

    const availableYears = propAvailableYears || [new Date().getFullYear().toString()];

    const handleYearChange = (year: string) => {
        setSelectedYear(year);

        router.get(route('admin.dashboard'), { year }, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    // Prepare data for campus performance bar chart
    const campusPerformanceData = campusStats.map((campus, index) => ({
        name: campus.name,
        projects: campus.total_projects,
        remaining: Math.max(0, target - campus.total_projects),
        percentage: target > 0 ? (campus.total_projects / target) * 100 : 0
    }));

    const renderCustomBarLabel = ({ payload, x, y, width, height, value }: any) => {
        if (!value || value == 0) return <text />;
        return <text x={x + width / 2} y={y} fill="#000" textAnchor="middle" dy={-6}>{`${value}`}</text>;
    };

    const renderStackedBarLabel = ({ x, y, width, height, value }: any) => {
        if (!value || value == 0) return <text />;
        return (
            <text
                x={x + width / 2}
                y={y + height / 2}
                fill="#fff"
                textAnchor="middle"
                dy={4}
                fontSize="12"
            >
                {value}
            </text>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Showing data for {selectedYear}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="year-filter" className="text-sm font-medium">
                                Filter by Year:
                            </Label>
                            <Select value={selectedYear} onValueChange={handleYearChange}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <Card className='bg-linear-to-b from-indigo-600 to-sky-400 text-white drop-shadow-lg drop-shadow-zinc-400/50 border-0'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Technology Transfers</CardTitle>
                            <FolderOpen className="w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overallStats.total_projects}</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-linear-to-b from-amber-500 to-yellow-400 text-white drop-shadow-lg drop-shadow-zinc-400/50 border-0'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Awards & Recognitions</CardTitle>
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

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <Card className='col-span-2'>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Monthly Activity Overview
                            </CardTitle>
                            <CardDescription>
                                Tracking submissions across all categories for {selectedYear}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={monthlyStats}
                                    margin={{ top: 20, bottom: 5 }}
                                    barCategoryGap="20%"
                                    barGap={4}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        interval={0}
                                    />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="awards"
                                        fill="#f59e0b"
                                        name="Awards"
                                        label={renderCustomBarLabel}
                                        radius={[2, 2, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="partners"
                                        fill="#10b981"
                                        name="Partnerships"
                                        label={renderCustomBarLabel}
                                        radius={[2, 2, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="projects"
                                        fill="#3b82f6"
                                        name="Technology Transfers"
                                        label={renderCustomBarLabel}
                                        radius={[2, 2, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center justify-between gap-2'>
                                <p className='flex items-center gap-2'>
                                    <Target />
                                    Campus Performance Tracker
                                </p>
                                <div className="flex items-center ml-auto">
                                    <Label htmlFor="target-input" className="text-sm font-medium">Target:</Label>
                                    <Input
                                        id="target-input"
                                        type="number"
                                        value={target}
                                        onChange={(e) => setTarget(Number(e.target.value))}
                                        placeholder="Enter target"
                                        className="ml-2 w-20"
                                        min="1"
                                    />
                                </div>
                            </CardTitle>
                            <CardDescription>
                                Progress toward technology transfer goals by campus
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {campusPerformanceData.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-muted-foreground">
                                    No campus data available
                                </div>
                            ) : campusPerformanceData.every(campus => campus.projects === 0) ? (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                    <div className="text-lg mb-2">No technology transfers yet</div>
                                    <div className="text-sm">Data will appear when projects are submitted</div>
                                </div>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={campusPerformanceData}>
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis hide />
                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                                                                <p className="font-medium">{label}</p>
                                                                <p className="text-blue-600">{data.projects} technology transfers</p>
                                                                <p className="text-gray-500">{data.percentage.toFixed(1)}% of target</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar
                                                dataKey="projects"
                                                fill="#3b82f6"
                                                stackId="a"
                                                name="Completed"
                                                label={renderStackedBarLabel}
                                            />
                                            <Bar
                                                dataKey="remaining"
                                                fill="#c5c7cb"
                                                stackId="a"
                                                name="Remaining"
                                            />
                                            <Legend />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="mt-2 space-y-1">
                                        <div className="text-xs text-muted-foreground text-center">
                                            Target: {target} transfers per campus
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>Campus Distribution Analytics</CardTitle>
                            <CardDescription>
                                Comparative breakdown of submissions across all university campuses for {selectedYear}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Technology Transfers Pie Chart */}
                                <div>
                                    <h3 className="text-sm font-medium text-center mb-4">Technology Transfers</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={campusStats.filter(campus => campus.total_projects > 0)}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ value }) =>
                                                    `${value}`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="total_projects"
                                                nameKey="name"
                                            >
                                                {campusStats.filter(campus => campus.total_projects > 0).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value} technology transfers`,
                                                    name
                                                ]}
                                                labelFormatter={() => ''}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Awards Pie Chart */}
                                <div>
                                    <h3 className="text-sm font-medium text-center mb-4">Awards & Recognition</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={campusStats.filter(campus => campus.total_awards > 0)}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ value }) =>
                                                    `${value}`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="total_awards"
                                                nameKey="name"
                                            >
                                                {campusStats.filter(campus => campus.total_awards > 0).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value} Awards`,
                                                    name
                                                ]}
                                                labelFormatter={() => ''}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Partnerships Pie Chart */}
                                <div>
                                    <h3 className="text-sm font-medium text-center mb-4">International Partners</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={campusStats.filter(campus => campus.total_partners > 0)}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ value }) =>
                                                    `${value}`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="total_partners"
                                                nameKey="name"
                                            >
                                                {campusStats.filter(campus => campus.total_partners > 0).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value} International Partnerships`,
                                                    name
                                                ]}
                                                labelFormatter={() => ''}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}