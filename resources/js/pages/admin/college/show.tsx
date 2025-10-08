import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus, CampusCollege, College } from "@/types";

import { Head, Link, usePage } from "@inertiajs/react";
import { GraduationCap, Edit, Building, Calendar } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { asset } from "@/lib/utils";

type PageProps = {
    college: CampusCollege;
    flash?: { message?: string };
};

export default function ShowCollege() {
    const { flash, college } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'College Management',
            href: '/admin/college',
        },
        {
            title: college.campus.name,
            href: `/admin/college/campus/${college.campus.id}`,
        },
        {
            title: college.college.name,
            href: `/admin/college/${college.id}`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={college.college.name} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold">{college.college.name}</h1>
                                <p className="text-muted-foreground">College Details & Information</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/college/college/${college.college.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit College
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    College Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">College ID</Label>
                                        <Input
                                            value={college.id}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">College Name</Label>
                                        <Input
                                            value={college.college.name}
                                            readOnly
                                            className="bg-muted font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">College Code</Label>
                                        <Input
                                            value={college.college.code}
                                            readOnly
                                            className="bg-muted font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Campus</Label>
                                        <Input
                                            value={college.campus.name}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-sm font-medium text-muted-foreground">College Logo</Label>
                                    {college.college.logo ? (
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage
                                                    src={asset(college.college.logo)}
                                                    alt={`${college.college.name} logo`}
                                                />
                                                <AvatarFallback>
                                                    <GraduationCap className="h-8 w-8" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="overflow-ellipsis">
                                                <p className="font-medium">Logo Image</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Path: {college.college.logo}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() => window.open(asset(college.college.logo), '_blank')}
                                                >
                                                    View Full Size
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg">
                                            <div className="text-center">
                                                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-muted-foreground">No logo uploaded</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Edit college to add a logo
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Information */}
                    <div className="space-y-6">
                        {/* Timeline Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timeline Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                                        <Input
                                            value={formatDate(college.created_at)}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                        <Input
                                            value={formatDate(college.updated_at)}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}