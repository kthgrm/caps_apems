import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Radio, Tv, LoaderCircle, Folder, Globe, Building } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, Modalities } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Separator } from '@/components/ui/separator';

type PageProps = {
    modality: Modalities;
    projects: { value: number; label: string }[];
    flash?: { message?: string };
};

export default function AdminModalityEdit() {
    const { modality, projects, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Modalities',
            href: '/admin/modalities',
        },
        {
            title: modality.project.campus_college.campus.name,
            href: `/admin/modalities/${modality.project.campus_college.campus.id}`,
        },
        {
            title: modality.project.campus_college.college.name,
            href: `/admin/modalities/${modality.project.campus_college.campus.id}/${modality.project.campus_college.college.id}/modalities`,
        },
        {
            title: modality.project.name,
            href: `/admin/modalities/${modality.id}/details`,
        },
        {
            title: 'Edit Modality',
            href: `/admin/modalities/${modality.id}/edit`,
        }
    ];

    const { data, setData, put, processing, errors } = useForm({
        id: modality.id,
        project_id: modality.project_id,
        modality: modality.modality,
        tv_channel: modality.tv_channel || '',
        radio: modality.radio || '',
        online_link: modality.online_link || '',
        time_air: modality.time_air || '',
        period: modality.period || '',
        partner_agency: modality.partner_agency || '',
        hosted_by: modality.hosted_by || '',
    });

    const asset = (path: string) => {
        return `/storage/${path}`;
    };

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/modalities/${modality.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Modality: ${modality.project.name}`} />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-medium">Edit Modality</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                variant="default"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Modality Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Radio className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Modality ID</Label>
                                            <Input
                                                value={data.id}
                                                readOnly
                                                className="mt-1 bg-muted"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium" htmlFor="project_id">Related Project *</Label>
                                            <Select
                                                value={data.project_id.toString()}
                                                onValueChange={(value) => setData('project_id', Number(value))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select Project" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {projects.map((project) => (
                                                        <SelectItem key={project.value} value={project.value.toString()}>
                                                            {project.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.project_id} />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Delivery Mode</Label>
                                            <Select
                                                value={data.modality}
                                                onValueChange={(value) => setData('modality', value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select delivery mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="TV">Television</SelectItem>
                                                        <SelectItem value="Radio">Radio</SelectItem>
                                                        <SelectItem value="Online">Online</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.modality} />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Air Time / Schedule</Label>
                                            <Input
                                                value={data.time_air}
                                                onChange={(e) => setData('time_air', e.target.value)}
                                                className="mt-1"
                                                placeholder="e.g., 8:00 AM - 9:00 AM"
                                            />
                                            <InputError message={errors.time_air} />
                                        </div>
                                        <div >
                                            <Label className="text-sm font-light">Period / Duration</Label>
                                            <Input
                                                value={data.period}
                                                onChange={(e) => setData('period', e.target.value)}
                                                className="mt-1"
                                                placeholder="e.g., 1 month, 6 weeks"
                                            />
                                            <InputError message={errors.period} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Media Channels */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tv className="h-5 w-5" />
                                        Media Channels
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">TV Channel</Label>
                                            <Input
                                                value={data.tv_channel}
                                                onChange={(e) => setData('tv_channel', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter TV channel name"
                                            />
                                            <InputError message={errors.tv_channel} />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Radio Station</Label>
                                            <Input
                                                value={data.radio}
                                                onChange={(e) => setData('radio', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter radio station name"
                                            />
                                            <InputError message={errors.radio} />
                                        </div>
                                        <div className='col-span-2'>
                                            <Label className="text-sm font-light">Online Link / Platform</Label>
                                            <Input
                                                value={data.online_link}
                                                onChange={(e) => setData('online_link', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter URL or platform name"
                                            />
                                            <InputError message={errors.online_link} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Partnership Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Partnership & Organization
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Partner Agency</Label>
                                            <Input
                                                value={data.partner_agency}
                                                onChange={(e) => setData('partner_agency', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter partner agency name"
                                            />
                                            <InputError message={errors.partner_agency} />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Hosted By</Label>
                                            <Input
                                                value={data.hosted_by}
                                                onChange={(e) => setData('hosted_by', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter hosting organization"
                                            />
                                            <InputError message={errors.hosted_by} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {modality.project && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building className="h-5 w-5" />
                                            Department
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {modality.project.campus_college && (
                                            <>
                                                <div>
                                                    <Label className="text-sm font-medium">Campus</Label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {modality.project.campus_college.campus?.logo && (
                                                            <img
                                                                src={asset(modality.project.campus_college.campus.logo)}
                                                                alt="Campus logo"
                                                                className="h-6 w-6 rounded"
                                                            />
                                                        )}
                                                        <span className="text-sm">{modality.project.campus_college.campus?.name}</span>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div>
                                                    <Label className="text-sm font-medium">College</Label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {modality.project.campus_college.college?.logo && (
                                                            <img
                                                                src={asset(modality.project.campus_college.college.logo)}
                                                                alt="College logo"
                                                                className="h-6 w-6 rounded"
                                                            />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{modality.project.campus_college.college?.name}</span>
                                                            <span className="text-xs text-muted-foreground">{modality.project.campus_college.college?.code}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Record Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Record Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Created</span>
                                            <span>{modality.created_at ? new Date(modality.created_at).toLocaleDateString() : 'Not Set'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Last Updated</span>
                                            <span>{modality.updated_at ? new Date(modality.updated_at).toLocaleDateString() : 'Not Set'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Created By</span>
                                            <span>{modality.user.name}</span>
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