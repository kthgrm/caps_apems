import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle, Users, FileText, Clock3 } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'International Partners',
        href: '/user/international-partners',
    },
    {
        title: 'Add New International Partner',
        href: '/user/international-partners/create',
    },
];

type PageProps = {
    user: User;
    flash?: { message?: string };
};

export default function CreateEngagement() {
    const { user, flash } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState('partnership-details');

    const { data, setData, post, processing, errors, reset } = useForm({
        agency_partner: '',
        location: '',
        activity_conducted: '',
        start_date: '',
        end_date: '',
        number_of_participants: '',
        number_of_committee: '',
        narrative: '',
        remarks: '',

        attachment: null as File | null,
        attachment_link: '',

        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('user.international-partners.store'), {
            onSuccess: () => {
                toast.success('Record created successfully!');
                reset();
            },
            onError: (errors) => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Engagement" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Add New Engagement</h1>
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
                            <TabsTrigger value="partnership-details" className="text-sm">
                                Partnership Details
                            </TabsTrigger>
                            <TabsTrigger value="timeline-duration" className="text-sm">
                                Timeline & Duration
                            </TabsTrigger>
                            <TabsTrigger value="participation-metrics" className="text-sm">
                                Participation Metrics
                            </TabsTrigger>
                            <TabsTrigger value="attachments" className="text-sm">
                                Attachments
                            </TabsTrigger>
                        </TabsList>

                        {/* Partnership Details Tab */}
                        <TabsContent value="partnership-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock3 className="h-5 w-5" />
                                        Partnership Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="agency_partner" className="text-base font-medium">
                                            Agency Partner
                                        </Label>
                                        <Input
                                            id="agency_partner"
                                            value={data.agency_partner}
                                            onChange={(e) => setData('agency_partner', e.target.value)}
                                            placeholder="Enter agency partner name"
                                            className="h-10"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.agency_partner} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Enter location of the agency partner"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.location} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="activity_conducted">Activity Conducted</Label>
                                        <Input
                                            id="activity_conducted"
                                            value={data.activity_conducted}
                                            onChange={(e) => setData('activity_conducted', e.target.value)}
                                            placeholder="Enter activity conducted (e.g., Workshop, Seminar, Training)"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.activity_conducted} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="narrative">Narrative</Label>
                                        <Textarea
                                            id="narrative"
                                            value={data.narrative}
                                            onChange={(e) => setData('narrative', e.target.value)}
                                            placeholder="Provide a brief narrative of the partnership"
                                            rows={3}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.narrative} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Timeline Tab */}
                        <TabsContent value="timeline-duration" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock3 className="h-5 w-5" />
                                        Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date">Start Date</Label>
                                            <Input
                                                id="start_date"
                                                value={data.start_date}
                                                type='date'
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.start_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end_date">End Date</Label>
                                            <Input
                                                id="end_date"
                                                value={data.end_date}
                                                type='date'
                                                min={data.start_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.end_date} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Participation Metrics Tab */}
                        <TabsContent value="participation-metrics" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Participation Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="number_of_participants">Number of Participants</Label>
                                            <Input
                                                id="number_of_participants"
                                                value={data.number_of_participants}
                                                type="number"
                                                min={1}
                                                onChange={(e) => setData('number_of_participants', e.target.value)}
                                                placeholder='0'
                                                disabled={processing}
                                            />
                                            <InputError message={errors.number_of_participants} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="number_of_committee">Number of Committee</Label>
                                            <Input
                                                id="number_of_committee"
                                                value={data.number_of_committee}
                                                type="number"
                                                min={1}
                                                onChange={(e) => setData('number_of_committee', e.target.value)}
                                                placeholder='0'
                                                disabled={processing}
                                            />
                                            <InputError message={errors.number_of_committee} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Attachments Tab */}
                        <TabsContent value="attachments" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="attachment">Upload File (max size: 2MB)</Label>
                                            <Input
                                                id="attachment"
                                                type="file"
                                                placeholder="Upload your files"
                                                accept=".jpg,.jpeg,.png"
                                                multiple={false}
                                                onChange={(e) => {
                                                    const file = e.target.files && e.target.files[0];
                                                    if (file) {
                                                        // Validate file size (e.g., 2MB limit)
                                                        if (file.size <= 2 * 1024 * 1024) {
                                                            setData('attachment', file);
                                                        } else {
                                                            toast.error('File size exceeds the 2MB limit');
                                                        }
                                                    }
                                                }}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.attachment} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="attachment_link">Upload Link</Label>
                                            <Input
                                                id="attachment_link"
                                                type="url"
                                                placeholder="Enter your file link"
                                                value={data.attachment_link}
                                                onChange={(e) => {
                                                    setData('attachment_link', e.target.value);
                                                }}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.attachment_link} />
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
