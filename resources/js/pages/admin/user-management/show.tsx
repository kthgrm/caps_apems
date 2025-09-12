import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Project, User } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ArrowLeft, Edit, Mail, MapPin, Shield, ShieldCheck, Trash2, User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
    {
        title: 'User Details',
        href: '#',
    },
];

type PageProps = {
    user: User & {
        projects?: Project[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ShowUser() {
    const { user, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    const handleToggleAdmin = () => {
        const action = user.is_admin ? 'remove admin privileges from' : 'grant admin privileges to';
        if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
            router.patch(`/admin/users/${user.id}/toggle-admin`, {}, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User Details - ${user.name}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/users">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-muted-foreground">
                                User Details and Activity
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge
                            variant={user.is_admin ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={handleToggleAdmin}
                        >
                            {user.is_admin ? (
                                <>
                                    <ShieldCheck className="mr-1 h-3 w-3" />
                                    Admin
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-1 h-3 w-3" />
                                    User
                                </>
                            )}
                        </Badge>
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Information */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                User Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <p className="text-lg font-medium">{user.name}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p>{user.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Campus & College</label>
                                    {user.campus_college ? (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{user.campus_college.campus.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.campus_college.college.name}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Not assigned</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                    <p className="font-mono text-sm">#{user.id}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">Account Details</h4>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                                    <p className="text-sm">{formatDate(user.created_at)}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                    <p className="text-sm">{formatDate(user.updated_at)}</p>
                                </div>

                                {user.email_verified_at ? (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                                        <p className="text-sm">{formatDate(user.email_verified_at)}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email Status</label>
                                        <Badge variant="destructive">Unverified</Badge>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Projects */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>User Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.projects && user.projects.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Project Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {user.projects.map((project) => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">{project.name}</TableCell>
                                                <TableCell>{project.category || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {project.end_date && new Date(project.end_date) < new Date()
                                                            ? 'Completed'
                                                            : 'Active'
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {project.start_date ? formatDateShort(project.start_date) : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {project.end_date ? formatDateShort(project.end_date) : 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No projects found for this user.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{user.projects?.length || 0}</div>
                                <div className="text-sm text-muted-foreground">Total Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {user.projects?.filter(p => p.end_date && new Date(p.end_date) < new Date()).length || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">Completed Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {user.projects?.filter(p => !p.end_date || new Date(p.end_date) >= new Date()).length || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">Active Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {user.projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Budget</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
