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
import type { BreadcrumbItem, InternationalPartner } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { asset } from '@/lib/utils';

type PageProps = {
    partner: InternationalPartner;
    flash?: { message?: string };
};

export default function InternationalPartnerDetails() {
    const { partner, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'International Partners',
            href: '/user/international-partners',
        },
        {
            title: 'Partner List',
            href: '/user/international-partners',
        },
        {
            title: partner.agency_partner,
            href: `/user/international-partners/${partner.id}`,
        },
        {
            title: 'Edit Partnership',
            href: `/user/international-partners/${partner.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id: partner.id,
        agency_partner: partner.agency_partner || '',
        location: partner.location || '',
        activity_conducted: partner.activity_conducted || '',
        start_date: partner.start_date || '',
        end_date: partner.end_date || '',
        number_of_participants: partner.number_of_participants.toString() || '',
        number_of_committee: partner.number_of_committee.toString() || '',
        narrative: partner.narrative || '',

        attachment_path: partner.attachment_path || '',
        attachment_link: partner.attachment_link || '',
        attachment: null as File | null,
    });

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/user/international-partners/${partner.id}`, {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`International Partner: ${partner.agency_partner}`} />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-medium">Edit Partnership</h1>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Partner ID</Label>
                                            <Input value={data.id} readOnly className="mt-1 bg-muted" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Agency Partner</Label>
                                            <Input
                                                value={data.agency_partner}
                                                className="mt-1"
                                                onChange={(e) => setData('agency_partner', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Label className="text-sm font-light">Location</Label>
                                            <Input
                                                value={data.location}
                                                className="mt-1"
                                                onChange={(e) => setData('location', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Activity Type</Label>
                                            <Input
                                                value={data.activity_conducted}
                                                className="mt-1"
                                                onChange={(e) => setData('activity_conducted', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Label className="text-sm font-light">Narrative</Label>
                                            <Textarea
                                                value={data.narrative}
                                                className="mt-1"
                                                onChange={(e) => setData('narrative', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Participation Metrics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Participation Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Number of Participants</Label>
                                            <Input
                                                value={data.number_of_participants}
                                                type="number"
                                                className="mt-1"
                                                onChange={(e) => setData('number_of_participants', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Committee Members</Label>
                                            <Input
                                                value={data.number_of_committee}
                                                type="number"
                                                className="mt-1"
                                                onChange={(e) => setData('number_of_committee', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Timeline and Duration */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Timeline & Duration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Start Date</Label>
                                            <Input
                                                value={data.start_date}
                                                type='date'
                                                className="mt-1"
                                                onChange={(e) => setData('start_date', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">End Date</Label>
                                            <Input
                                                value={data.end_date}
                                                type='date'
                                                className="mt-1"
                                                onChange={(e) => setData('end_date', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Label className="text-sm font-light">Duration</Label>
                                            <Input
                                                value={
                                                    data.start_date && data.end_date
                                                        ? (() => {
                                                            const start = new Date(data.start_date);
                                                            const end = new Date(data.end_date);
                                                            const diffTime = Math.abs(end.getTime() - start.getTime());
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                                            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
                                                        })()
                                                        : 'Not specified'
                                                }
                                                readOnly
                                                className="mt-1 bg-muted"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

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
                                        {partner.attachment_path ? (
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
