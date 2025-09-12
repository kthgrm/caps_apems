import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Calendar, FileText, Download, Target, ExternalLink, Image, LoaderCircle } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import type { Award, BreadcrumbItem, } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

type PageProps = {
    award: Award;
    flash?: { message?: string };
};

export default function InternationalPartnerDetails() {
    const { award, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Awards & Recognition',
            href: '/user/awards',
        },
        {
            title: 'Award List',
            href: '/user/awards',
        },
        {
            title: award.award_name,
            href: `/user/awards/${award.id}`,
        },
        {
            title: 'Edit Award',
            href: `/user/awards/${award.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id: award.id,
        award_name: award.award_name || '',
        description: award.description || '',
        date_received: award.date_received || '',
        event_details: award.event_details || '',
        location: award.location || '',
        awarding_body: award.awarding_body || '',
        people_involved: award.people_involved || '',
        attachment: null as File | null,
        attachment_path: award.attachment_path || '',
        attachment_link: award.attachment_link || '',
    });

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const asset = (path: string) => {
        return `/storage/${path}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/user/awards/${award.id}`, {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`International Partner: ${award.award_name}`} />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-medium">Edit Award</h1>
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
                        {/* Main Engagement Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Award ID</Label>
                                            <Input value={data.id} readOnly className="mt-1 bg-muted" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Award Name</Label>
                                            <Input
                                                value={data.award_name}
                                                className="mt-1"
                                                onChange={(e) => setData('award_name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Date Received</Label>
                                            <Input
                                                value={data.date_received}
                                                type="date"
                                                className="mt-1"
                                                onChange={(e) => setData('date_received', e.target.value)}
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <Label className="text-sm font-light">Description</Label>
                                            <Textarea
                                                value={data.description}
                                                className="mt-1"
                                                onChange={(e) => setData('description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Event Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Event Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Awarding Body</Label>
                                            <Input
                                                value={data.awarding_body}
                                                className="mt-1"
                                                onChange={(e) => setData('awarding_body', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Location</Label>
                                            <Input
                                                value={data.location}
                                                className="mt-1"
                                                onChange={(e) => setData('location', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Event Details</Label>
                                            <Textarea
                                                value={data.event_details}
                                                className="mt-1"
                                                onChange={(e) => setData('event_details', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">People Involved</Label>
                                            <Input
                                                value={data.people_involved}
                                                className="mt-1"
                                                onChange={(e) => setData('people_involved', e.target.value)}
                                            />
                                            {data.people_involved ? (
                                                <div className="space-x-2">
                                                    {data.people_involved.split(', ').map((person, index) => (
                                                        <Badge key={index} className="mt-2" variant="outline">
                                                            {person}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Attachments */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-5 w-5" />
                                        Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        {award.attachment_path ? (
                                            <>
                                                <a href={asset(data.attachment_path)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm ">
                                                    <Image className="h-4 w-4" />
                                                    Current Attachment
                                                </a>
                                            </>
                                        ) : (
                                            <p className='text-sm'>No attachment uploaded</p>
                                        )}
                                        <Label className="text-sm font-light mt-2">Update Attachment</Label>
                                        <Input
                                            type="file"
                                            accept=".jpeg, .jpg, .png"
                                            size={1024}
                                            onChange={(e) => {
                                                setData('attachment', e.target.files && e.target.files[0] ? e.target.files[0] : null)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='attachment_link'>External Link</Label>
                                        <Input
                                            id='attachment_link'
                                            type='url'
                                            value={data.attachment_link}
                                            className="mt-1"
                                            onChange={(e) => setData('attachment_link', e.target.value)}
                                        />
                                        {errors.attachment_link && <p className="text-red-500 text-sm mt-1">{errors.attachment_link}</p>}
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
