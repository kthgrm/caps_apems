import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle, Radio, Tv, Globe, Clock, Building, Users, Mic } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, Project, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Activities',
        href: '/user/modalities',
    },
    {
        title: 'Modalities',
        href: '/user/modalities',
    },
    {
        title: 'Create New Modality',
        href: '/user/modalities/create',
    }
];

type PageProps = {
    projects: Project[];
    user: User;
    flash?: { message?: string };
};

export default function CreateModality() {
    const { projects, user, flash } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState('basic-information');

    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: '',
        modality: '',
        tv_channel: '',
        radio: '',
        online_link: '',
        time_air: '',
        period: '',
        partner_agency: '',
        hosted_by: '',

        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user.modalities.store'), {
            onSuccess: () => {
                toast.success('Modality created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Modality" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Add New Modality</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="college" className="text-base font-medium">
                                College
                            </Label>
                            <Input
                                id="college"
                                value={`${user.campus_college.campus.name} - ${user.campus_college.college.code}`}
                                readOnly
                                className="h-10 bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="created_at" className="text-base font-medium">
                                Created At
                            </Label>
                            <Input
                                id="created_at"
                                type="date"
                                value={data.created_at}
                                readOnly
                                className="h-10 bg-muted"
                            />
                        </div>
                    </div>

                    {/* Tabbed Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="basic-information" className="text-sm">
                                Basic Information
                            </TabsTrigger>
                            <TabsTrigger value="media-channel" className="text-sm">
                                Media Channels
                            </TabsTrigger>
                            <TabsTrigger value="partnership-details" className="text-sm">
                                Partnership Details
                            </TabsTrigger>
                        </TabsList>

                        {/* Modality Details Tab */}
                        <TabsContent value="basic-information" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Radio className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Project</Label>
                                            <Select
                                                value={data.project_id ? data.project_id : ''}
                                                onValueChange={(value) => {
                                                    setData('project_id', value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {projects.map((project) => (
                                                            <SelectItem
                                                                key={project.id}
                                                                value={project.id.toString()}
                                                            >
                                                                {project.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.project_id && <span className="text-sm text-red-500">Project field is required</span>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="modality">
                                                Delivery Mode
                                            </Label>
                                            <Select
                                                value={data.modality}
                                                onValueChange={(value) => setData('modality', value)}
                                            >
                                                <SelectTrigger>
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

                                        <div className="space-y-2">
                                            <Label htmlFor="time_air">
                                                Air Time / Schedule
                                            </Label>
                                            <Input
                                                id="time_air"
                                                value={data.time_air}
                                                onChange={(e) => setData('time_air', e.target.value)}
                                                placeholder="e.g., 8:00 AM - 9:00 AM"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.time_air} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="media-channel" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tv className="h-5 w-5" />
                                        Media Channels
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="tv_channel">TV Channel</Label>
                                            <Input
                                                id="tv_channel"
                                                value={data.tv_channel}
                                                onChange={(e) => setData('tv_channel', e.target.value)}
                                                placeholder="Enter TV channel name"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.tv_channel} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="radio">Radio Station</Label>
                                            <Input
                                                id="radio"
                                                value={data.radio}
                                                onChange={(e) => setData('radio', e.target.value)}
                                                placeholder="Enter radio station name"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.radio} />
                                        </div>

                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="online_link">Online Link / Platform</Label>
                                            <Input
                                                id="online_link"
                                                value={data.online_link}
                                                onChange={(e) => setData('online_link', e.target.value)}
                                                placeholder="Enter URL or platform name"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.online_link} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="partnership-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Partnership Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="period">Period / Duration</Label>
                                            <Input
                                                id="period"
                                                value={data.period}
                                                onChange={(e) => setData('period', e.target.value)}
                                                placeholder="e.g., 1 month, 6 weeks"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.period} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="hosted_by">Hosted By</Label>
                                            <Input
                                                id="hosted_by"
                                                value={data.hosted_by}
                                                onChange={(e) => setData('hosted_by', e.target.value)}
                                                placeholder="Enter host organization"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.hosted_by} />
                                        </div>

                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="partner_agency">Partner Agency</Label>
                                            <Input
                                                id="partner_agency"
                                                value={data.partner_agency}
                                                onChange={(e) => setData('partner_agency', e.target.value)}
                                                placeholder="Enter partner agency name"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.partner_agency} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-2 rounded-md"
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Submit form
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
