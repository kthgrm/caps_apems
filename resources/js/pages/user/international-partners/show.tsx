import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Calendar, MapPin, Building, FileText, Edit, ArrowLeft, Download, Share, Clock, Target, ExternalLink, Image } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, InternationalPartner } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
            <Head title={`International Partner: ${partner.agency_partner}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-medium">{partner.agency_partner}</h1>
                            <p className="text-muted-foreground text-sm">Partnership Details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/user/international-partners/${partner.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Partnership
                            </Link>
                        </Button>
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
                                        <Input value={partner.id || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Agency Partner</Label>
                                        <Input value={partner.agency_partner || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <Label className="text-sm font-light">Location</Label>
                                        <Input value={partner.location || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Activity Type</Label>
                                        <div className="mt-1">
                                            <Badge
                                                variant="outline">
                                                {partner.activity_conducted.charAt(0).toUpperCase() + partner.activity_conducted.slice(1) || 'Not specified'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <Label className="text-sm font-light">Narrative</Label>
                                        <Textarea value={partner.narrative || 'No narrative provided'} readOnly className="mt-1" />
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
                                            value={partner.number_of_participants?.toLocaleString() || 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Committee Members</Label>
                                        <Input
                                            value={partner.number_of_committee.toLocaleString() || 'Not specified'}
                                            readOnly
                                            className="mt-1"
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
                                            value={partner.start_date ? new Date(partner.start_date).toLocaleDateString() : 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">End Date</Label>
                                        <Input
                                            value={partner.end_date ? new Date(partner.end_date).toLocaleDateString() : 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <Label className="text-sm font-light">Duration</Label>
                                        <Input
                                            value={
                                                partner.start_date && partner.end_date
                                                    ? (() => {
                                                        const start = new Date(partner.start_date);
                                                        const end = new Date(partner.end_date);
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
                                <div className="flex items-center p-3 border rounded-lg">
                                    {partner.attachment_path ? (
                                        <Dialog>
                                            <DialogTrigger className='flex items-center gap-2 text-blue-500 hover:underline w-full'>
                                                <Image className="h-4 w-4" />
                                                <p className="text-sm">Partnership Attachment</p>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Partnership Attachment</DialogTitle>
                                                    <DialogDescription>
                                                        <img src={asset(partner.attachment_path)} alt="Partnership Attachment" className="w-full h-auto" />
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
                                    {partner.attachment_link ? (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="text-sm">External Link</span>
                                            </div>

                                            <a
                                                href={partner.attachment_link}
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
