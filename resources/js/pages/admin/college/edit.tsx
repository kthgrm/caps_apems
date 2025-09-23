import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus, College } from "@/types";
import InputError from "@/components/input-error";

import { Head, useForm, usePage, router } from "@inertiajs/react";
import { GraduationCap, LoaderCircle, Upload, ArrowLeft, Calendar, Save, Building } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "@inertiajs/react";

type PageProps = {
    college: College & { campus: Campus };
    campuses: Campus[];
    flash?: { message?: string }
};

export default function EditCollege() {
    const { flash, college, campuses } = usePage<PageProps>().props;

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
            title: college.name,
            href: `/admin/college/campus/${college.campus.id}`,
        },
        {
            title: 'Edit',
            href: `/admin/college/college/${college.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors, reset } = useForm({
        name: college.name,
        code: college.code,
        campus_id: college.campus.id.toString(),
        logo: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string>(college.logo ? `/storage/${college.logo}` : '');
    const [hasNewFile, setHasNewFile] = useState<boolean>(false);

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.campus_id) {
            toast.error('Please select a campus');
            return;
        }

        // Use router.post for file uploads with method spoofing
        router.post(`/admin/college/college/${college.id}`, {
            ...data,
            _method: 'PUT'
        }, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('College updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update college. Please try again.');
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Invalid file type. Please select JPG, JPEG, or PNG file.');
                e.target.value = '';
                return;
            }

            // Validate file size (2MB limit)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toast.error('File size exceeds the 2MB limit');
                e.target.value = '';
                return;
            }

            setData('logo', file);
            setHasNewFile(true);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setPreviewUrl(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setData('logo', null);
        setHasNewFile(false);
        setPreviewUrl(college.logo ? `/storage/${college.logo}` : '');
        const fileInput = document.getElementById('logo') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleCampusChange = (campusId: string) => {
        setData('campus_id', campusId);
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
            <Head title={`Edit ${college.name}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit College</h1>
                        <p className="text-muted-foreground">
                            Update information for {college.name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            disabled={processing || !data.name || !data.code || !data.campus_id}
                            onClick={handleSubmit}
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Update College
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href={`/admin/college/campus/${college.campus.id}`}>
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    College Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Campus Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="campus_id">Campus *</Label>
                                        <Select value={data.campus_id} onValueChange={handleCampusChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select campus..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {campuses.map((campus) => (
                                                    <SelectItem key={campus.id} value={campus.id.toString()}>
                                                        {campus.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.campus_id} />
                                    </div>

                                    {/* College Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">College Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter college name"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* College Code */}
                                    <div className="space-y-2">
                                        <Label htmlFor="code">College Code *</Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            placeholder="Enter college code (e.g., CCS, COE)"
                                            maxLength={10}
                                            required
                                        />
                                        <InputError message={errors.code} />
                                        <p className="text-sm text-muted-foreground">
                                            Short abbreviation for the college (max 10 characters)
                                        </p>
                                    </div>

                                    {/* Logo Upload */}
                                    <div className="space-y-4">
                                        <Label htmlFor="logo" className="text-sm font-medium">
                                            College Logo (max size: 2MB)
                                        </Label>

                                        {/* Logo Preview */}
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage
                                                    src={previewUrl}
                                                    alt={`${college.name} logo`}
                                                />
                                                <AvatarFallback>
                                                    <Building className="h-10 w-10" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {hasNewFile ? 'New Logo Preview' : 'Current Logo'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasNewFile
                                                        ? `New file: ${data.logo?.name}`
                                                        : college.logo
                                                            ? college.logo
                                                            : 'No logo uploaded'
                                                    }
                                                </p>
                                                {hasNewFile && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleRemoveFile}
                                                        className="mt-2"
                                                    >
                                                        Remove New File
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* File Upload Input */}
                                        <div className="space-y-3">
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={handleFileChange}
                                                disabled={processing}
                                                className="h-10"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Supported formats: JPG, JPEG, PNG. Leave empty to keep current logo.
                                            </p>
                                            {hasNewFile && data.logo && (
                                                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                                    <Upload className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-800">
                                                        Ready to upload: {data.logo.name} ({(data.logo.size / 1024 / 1024).toFixed(2)} MB)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.logo} />
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
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
                                            className="bg-muted text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                        <Input
                                            value={formatDate(college.updated_at)}
                                            readOnly
                                            className="bg-muted text-xs"
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