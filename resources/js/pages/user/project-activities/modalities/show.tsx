import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Download, Image, ExternalLink, Radio, CalendarRange, Folder, Paperclip, Tv, Globe, Clock, Building } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, Modalities } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type PageProps = {
    modality: Modalities;
    flash?: { message?: string };
};

export default function ModalityDetails() {
    const { modality, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Project Activities',
            href: '/user/project-activities',
        },
        {
            title: 'Modalities',
            href: '/user/project-activities/modalities',
        },
        {
            title: modality.project.name,
            href: `/user/project-activities/modalities/${modality.id}`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const getModalityIcon = () => {
        switch (modality.modality?.toLowerCase()) {
            case 'tv':
            case 'television':
                return <Tv className="h-5 w-5" />;
            case 'radio':
                return <Radio className="h-5 w-5" />;
            case 'online':
            case 'internet':
                return <Globe className="h-5 w-5" />;
            default:
                return <Radio className="h-5 w-5" />;
        }
    };

    const getModalityColor = () => {
        switch (modality.modality?.toLowerCase()) {
            case 'tv':
            case 'television':
                return 'bg-purple-100 text-purple-800';
            case 'radio':
                return 'bg-blue-100 text-blue-800';
            case 'online':
            case 'internet':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modality: ${modality.project.name}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-medium">{modality.project.name}</h1>
                            <p className="text-muted-foreground">Delivery Modality Details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/user/modalities/${modality.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Modality
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Modality Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {getModalityIcon()}
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Modality ID</Label>
                                        <Input
                                            value={modality.id}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Air Time / Schedule</Label>
                                        <Input
                                            value={modality.time_air || 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Delivery Mode</Label>
                                        <div className="mt-1">
                                            <Badge className={`flex items-center gap-1 w-fit ${getModalityColor()}`}>
                                                {getModalityIcon()}
                                                {modality.modality || 'Not specified'}
                                            </Badge>
                                        </div>
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
                                            value={modality.tv_channel || 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Radio Station</Label>
                                        <Input
                                            value={modality.radio || 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <Label className="text-sm font-light">Online Link / Platform</Label>
                                        {modality.online_link ? (
                                            <div className="mt-1 flex items-center gap-2">
                                                <Input
                                                    value={modality.online_link}
                                                    readOnly
                                                    className="flex-1"
                                                />
                                                <Button size="sm" variant="outline" asChild>
                                                    <a href={modality.online_link} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        ) : (
                                            <Input
                                                value="Not specified"
                                                readOnly
                                                className="mt-1"
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partnership Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Partnership Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Period / Duration</Label>
                                        <Input
                                            value={modality.period || 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Hosted By</Label>
                                        <Input
                                            value={modality.hosted_by || 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <Label className="text-sm font-light">Partner Agency</Label>
                                        <Input
                                            value={modality.partner_agency || 'Not specified'}
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
                        {/* Associated Project */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Folder className="h-5 w-5" />
                                    Associated Project
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Card>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">{modality.project.name}</h2>
                                            <Link href={`/user/technology-transfer/project/${modality.project.id}`} className="text-blue-600 hover:underline flex space-x-1 items-center">
                                                <span className='text-sm'>View Project Details</span>
                                                <ExternalLink className="w-4" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
