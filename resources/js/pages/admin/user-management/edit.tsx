import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, CampusCollege, User } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

type PageProps = {
    user: User;
    campusColleges: CampusCollege[];
    errors: Record<string, string>;
};

export default function EditUser() {
    const { user, campusColleges, errors } = usePage<PageProps>().props;

    const { data, setData, patch, processing } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        is_admin: boolean;
        campus_college_id: string;
    }>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        is_admin: user.is_admin,
        campus_college_id: user.campus_college_id?.toString() || '',
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach(error => {
                toast.error(error);
            });
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/users/${user.id}`, {
            preserveScroll: true,
        });
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit User</h1>
                        <p className="text-muted-foreground">
                            Update user information and permissions
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">User ID</Label>
                                <p className="text-sm text-muted-foreground">#{user.id}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Created</Label>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(user.created_at)}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Last Updated</Label>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(user.updated_at)}
                                </p>
                            </div>
                            {user.email_verified_at && (
                                <div>
                                    <Label className="text-sm font-medium">Email Verified</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(user.email_verified_at)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Edit Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Edit Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter full name"
                                            className={errors.name ? 'border-destructive' : ''}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter email address"
                                            className={errors.email ? 'border-destructive' : ''}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Campus College */}
                                <div className="space-y-2">
                                    <Label htmlFor="campus_college_id">Campus/College *</Label>
                                    <Select
                                        value={data.campus_college_id}
                                        onValueChange={(value) => setData('campus_college_id', value)}
                                    >
                                        <SelectTrigger className={errors.campus_college_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select campus and college" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {campusColleges.map((cc) => (
                                                <SelectItem key={cc.id} value={cc.id.toString()}>
                                                    {cc.campus.name} - {cc.college.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.campus_college_id && (
                                        <p className="text-sm text-destructive">{errors.campus_college_id}</p>
                                    )}
                                </div>

                                <Separator />

                                {/* Password Section */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Change Password</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Leave password fields empty to keep the current password
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter new password"
                                                className={errors.password ? 'border-destructive' : ''}
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-destructive">{errors.password}</p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm new password"
                                                className={errors.password_confirmation ? 'border-destructive' : ''}
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Admin Status */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Permissions</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Manage user access levels and permissions
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_admin"
                                            checked={data.is_admin}
                                            onCheckedChange={(checked) => setData('is_admin', checked as boolean)}
                                        />
                                        <Label htmlFor="is_admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Grant admin privileges
                                        </Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Admin users have access to administrative features and can manage other users.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4">
                                    <Link href="/admin/users">
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update User'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
