import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus } from "@/types";
import InputError from "@/components/input-error";

import { Head, useForm, usePage } from "@inertiajs/react";
import { GraduationCap, LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'College Management',
        href: '/admin/college',
    },
    {
        title: 'Add New College',
        href: '/admin/college/create',
    },
];

type PageProps = {
    campuses: Campus[];
    selectedCampus?: Campus;
    flash?: { message?: string }
};

export default function CreateCollege() {
    const { flash, campuses, selectedCampus } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        campus_id: selectedCampus?.id.toString() || '',
        logo: null as File | null,
    });

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/college', {
            onSuccess: () => {
                toast.success('College created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New College" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add New College</h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                College Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Campus Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="campus_id" className="text-base font-medium">
                                    Campus <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.campus_id}
                                    onValueChange={(value) => setData('campus_id', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className="h-10">
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
                                <Label htmlFor="name" className="text-base font-medium">
                                    College Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter college name"
                                    disabled={processing}
                                    className="h-10"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* College Code */}
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-base font-medium">
                                    College Code <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder="Enter college code (e.g., CCS, COE)"
                                    maxLength={10}
                                    disabled={processing}
                                    className="h-10"
                                />
                                <InputError message={errors.code} />
                            </div>

                            {/* College Logo */}
                            <div className="space-y-2">
                                <Label htmlFor="logo" className="text-base font-medium">
                                    Logo (max size: 2MB)
                                </Label>
                                <div className="space-y-2">
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
                                        Supported formats: JPG, JPEG, PNG
                                    </p>
                                </div>
                                <InputError message={errors.logo} />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create College
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}