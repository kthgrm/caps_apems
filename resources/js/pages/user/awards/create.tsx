import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle, Award, FileText, Users, Target, Building, Calendar, AwardIcon, CalendarRange } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Awards & Recognition',
        href: '/user/awards',
    },
    {
        title: 'Add New Award',
        href: '/user/awards/create',
    },
];

type PageProps = {
    user: User;
    flash?: { message?: string };
};

export default function CreateAward() {
    const { user, flash } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState('award-details');

    const { data, setData, post, processing, errors, reset } = useForm({
        award_name: '',
        description: '',
        date_received: '',

        event_details: '',
        location: '',
        awarding_body: '',
        people_involved: '',

        attachment: null as File | null,
        attachment_link: '',

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
        post(route('user.awards.store'), {
            onSuccess: () => {
                toast.success('Award created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Award" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Add New Award</h1>
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
                            <TabsTrigger value="award-details" className="text-sm">
                                Award Details
                            </TabsTrigger>
                            <TabsTrigger value="event-details" className="text-sm">
                                Event Details
                            </TabsTrigger>
                            <TabsTrigger value="attachments" className="text-sm">
                                Attachments
                            </TabsTrigger>
                        </TabsList>

                        {/* Award Details Tab */}
                        <TabsContent value="award-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AwardIcon className="h-5 w-5" />
                                        Award Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="award_name" className="text-base font-medium">
                                            Award Name
                                        </Label>
                                        <Input
                                            id="award_name"
                                            value={data.award_name}
                                            onChange={(e) => setData('award_name', e.target.value)}
                                            placeholder="Enter award name"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.award_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date_received">Date Received</Label>
                                        <Input
                                            id="date_received"
                                            value={data.date_received}
                                            type='date'
                                            onChange={(e) => setData('date_received', e.target.value)}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.date_received} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Provide a brief description of the award"
                                            rows={3}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Event Detials Tab */}
                        <TabsContent value="event-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarRange className="h-5 w-5" />
                                        Event Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="awarding_body">Awarding Body</Label>
                                            <Input
                                                id="awarding_body"
                                                value={data.awarding_body}
                                                onChange={(e) => setData('awarding_body', e.target.value)}
                                                placeholder="Enter Organization/Institution"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.awarding_body} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                placeholder="Enter location of the event"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.location} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="event_details">Event Details</Label>
                                            <Textarea
                                                id="event_details"
                                                value={data.event_details}
                                                onChange={(e) => setData('event_details', e.target.value)}
                                                placeholder="Provide details about the event where the award was received"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.event_details} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="people_involved">People Involved</Label>
                                            <Input
                                                id="people_involved"
                                                value={data.people_involved}
                                                onChange={(e) => setData('people_involved', e.target.value)}
                                                placeholder="Enter names of people involved (e.g., John Doe, Jane Smith)"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.people_involved} />
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
