import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Download, Image, ExternalLink, Target, CalendarRange } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, Award as AwardType } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type PageProps = {
    award: AwardType;
    flash?: { message?: string };
};

export default function AwardDetails() {
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
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const asset = (path: string) => {
        return `/storage/${path}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Award: ${award.award_name}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-medium">{award.award_name}</h1>
                            <p className="text-muted-foreground">Award Details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/user/awards/${award.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Award
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Award Information */}
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
                                        <Input
                                            value={award.id}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Award Name</Label>
                                        <Input
                                            value={award.award_name}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Date Received</Label>
                                        <Input
                                            value={award.date_received ? new Date(award.date_received).toLocaleDateString() : 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className='col-span-3'>
                                        <Label className="text-sm font-light">Description</Label>
                                        <Textarea
                                            value={award.description || 'No description provided'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Event Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarRange className="h-5 w-5" />
                                    Event Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Awarding Body</Label>
                                        <Input
                                            value={award.awarding_body}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Location</Label>
                                        <Input
                                            value={award.location}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Event Details</Label>
                                        <Textarea
                                            value={award.event_details || 'No event details provided'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">People Involved</Label>
                                        <div className='space-x-2'>
                                            {award.people_involved ? award.people_involved.split(', ').map(person => (
                                                <Badge key={person} variant="outline">{person}</Badge>
                                            )) : 'No people specified'}
                                        </div>
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
                                <div className="flex items-center p-3 border rounded-lg">
                                    {award.attachment_path ? (
                                        <Dialog>
                                            <DialogTrigger className='flex items-center gap-2 text-blue-500 hover:underline w-full'>
                                                <Image className="h-4 w-4" />
                                                <p className="text-sm">Partnership Attachment</p>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Partnership Attachment</DialogTitle>
                                                    <DialogDescription>
                                                        <img src={asset(award.attachment_path)} alt="Partnership Attachment" className="w-full h-auto" />
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="text-sm gap-2 flex items-center">
                                            <Image className="h-4 w-4" />
                                            No Attachment
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    {award.attachment_link ? (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="text-sm">External Link</span>
                                            </div>

                                            <a
                                                href={award.attachment_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                Open Link
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-sm gap-2 flex items-center">
                                            <ExternalLink className="h-4 w-4" />
                                            No External Link
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
