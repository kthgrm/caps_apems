import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, CampusCollege } from "@/types";
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
        title: 'Create User',
        href: '/admin/users/create',
    },
];

type PageProps = {
    campusColleges: CampusCollege[];
    errors: Record<string, string>;
};

export default function CreateUser() {
    const { campusColleges, errors } = usePage<PageProps>().props;

    const { data, setData, post, processing } = useForm<{
        name: string;
        email: string;
        is_admin: boolean;
        is_active: boolean;
        campus_college_id: string;
    }>({
        name: '',
        email: '',
        is_admin: false,
        is_active: true,
        campus_college_id: '',
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
        post('/admin/users', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Create New User</h1>
                        <p className="text-muted-foreground">
                            Add a new user to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
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

                            {/* Password Information */}
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    A temporary password will be automatically generated and sent to the user's email address.
                                    The user will be required to change their password upon first login.
                                </p>
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

                            {/* Admin Status */}
                            <div className="">
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
                                <p className="text-sm text-muted-foreground mb-4">
                                    Admin users have access to administrative features and can manage other users.
                                </p>
                            </div>

                            {/* Active Status */}
                            <div className="">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Account is active
                                    </Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Inactive users will not be able to log in to the system.
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
                                    {processing ? 'Creating...' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
