import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus as BaseCampus } from "@/types";
import InputError from "@/components/input-error";

type Campus = BaseCampus & {
    projects_count: number;
};

import { Head, useForm, usePage } from "@inertiajs/react";
import { Building, LoaderCircle, Upload } from "lucide-react";
import { FormEventHandler, useEffect } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Campus Management',
        href: '/admin/campus',
    },
    {
        title: 'Add New Campus',
        href: '/admin/campus/create',
    },
];

type PageProps = {
    campuses: Campus[];
    flash?: { message?: string }
};

export default function AddCampus() {
    const { flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        logo: null as File | null,
    });

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/campus`, {
            onSuccess: () => {
                toast.success('Campus created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Campus" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add New Campus</h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Campus Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Campus Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base font-medium">
                                    Name <span className="text-red-500">*</span>
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

                            {/* Campus Logo */}
                            <div className="space-y-2">
                                <Label htmlFor="logo" className="text-base font-medium">
                                    Logo <span className="text-red-500">*</span> (max size: 2MB)
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
                                    Create Campus
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}