import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLayout from "@/layouts/app-layout";
import InputError from "@/components/input-error";
import { BreadcrumbItem, Campus as BaseCampus } from "@/types";

type Campus = BaseCampus & {
    projects_count?: number;
    colleges_count?: number;
    awards_count?: number;
};

import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Building, Save, Calendar, School, Trophy, FileText, ArrowLeft, Upload, LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";
import { toast } from "sonner";


type PageProps = {
    campus: Campus;
    flash?: { message?: string }
};

export default function CampusEdit() {
    const { flash, campus } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: campus.name,
        logo: null as File | null,
        _method: 'PATCH'
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Campus Management',
            href: '/admin/campus',
        },
        {
            title: campus.name,
            href: `/admin/campus/${campus.id}`,
        },
        {
            title: 'Edit',
            href: `/admin/campus/${campus.id}/edit`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.campus.update', campus.id), {
            onSuccess: () => {
                toast.success('Campus updated successfully!');
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

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
            <Head title={`Edit Campus: ${campus.name}`} />
            <Toaster position="bottom-right" />

            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold">Edit Campus</h1>
                                    <p className="text-muted-foreground">Update campus information</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Updating...' : 'Update Campus'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
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
                                        <Building className="h-5 w-5" />
                                        Campus Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-muted-foreground">Campus ID</Label>
                                            <Input
                                                value={campus.id}
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Campus Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter campus name"
                                                disabled={processing}
                                                className="h-10"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <Label htmlFor="logo" className="text-sm font-medium">
                                            Campus Logo (max size: 2MB)
                                        </Label>

                                        {/* Current Logo Display */}
                                        {campus.logo && (
                                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage
                                                        src={`/storage/${campus.logo}`}
                                                        alt={`${campus.name} logo`}
                                                    />
                                                    <AvatarFallback>
                                                        <Building className="h-8 w-8" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="font-medium">Current Logo</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {campus.logo}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Logo Upload */}
                                        <div className="space-y-3">
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    const file = e.target.files && e.target.files[0];
                                                    if (file) {
                                                        // Validate file size (2MB limit)
                                                        if (file.size <= 2 * 1024 * 1024) {
                                                            setData('logo', file);
                                                        } else {
                                                            toast.error('File size exceeds the 2MB limit');
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                                disabled={processing}
                                                className="h-10"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Supported formats: JPG, JPEG, PNG. Leave empty to keep current logo.
                                            </p>
                                            {data.logo && (
                                                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                                    <Upload className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-800">New file selected: {data.logo.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setData('logo', null);
                                                            const fileInput = document.getElementById('logo') as HTMLInputElement;
                                                            if (fileInput) fileInput.value = '';
                                                        }}
                                                        className="ml-auto h-6 w-6 p-0 text-green-600 hover:text-green-800"
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.logo} />
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                                            <Input
                                                value={formatDate(campus.created_at)}
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                            <Input
                                                value={formatDate(campus.updated_at)}
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
            </form>
        </AppLayout>
    );
}