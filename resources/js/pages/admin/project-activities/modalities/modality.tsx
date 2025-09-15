import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Modalities, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Radio, Tv, Globe, Building, Clock, Users, FileText, Paperclip, Link } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ModalityDetailsProps = {
    modality: Modalities;
    flash?: { message?: string };
};

export default function ModalityDetails() {
    const { modality, flash } = usePage<ModalityDetailsProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modalities',
            href: '/admin/modalities',
        },
        {
            title: 'Campus',
            href: '/admin/modalities',
        },
        {
            title: 'College',
            href: `/admin/modalities/${modality.project.campus_college.campus.id}`,
        },
        {
            title: 'Modalities',
            href: `/admin/modalities/${modality.project.campus_college.campus.id}/${modality.project.campus_college.college.id}/modalities`,
        },
        {
            title: 'Details',
            href: `/admin/modalities/${modality.id}/details`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const asset = (path: string) => {
        return `/storage/${path}`;
    }

    const getModalityIcon = (modalityType: string) => {
        switch (modalityType.toLowerCase()) {
            case 'tv':
            case 'television':
                return <Tv className="h-5 w-5 text-blue-600" />;
            case 'radio':
                return <Radio className="h-5 w-5 text-green-600" />;
            case 'online':
            case 'digital':
                return <Globe className="h-5 w-5 text-purple-600" />;
            default:
                return <Building className="h-5 w-5 text-gray-600" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modality Details" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-bold'>Modality Details</h1>
                    <div>
                        <Button variant="destructive" className="w-full justify-start bg-red-800 hover:bg-red-900">
                            Delete Modality
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
                                    {getModalityIcon(modality.modality)}
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Modality ID</Label>
                                        <Input value={modality.id} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Modality Type</Label>
                                        <div className="mt-1 p-2 bg-muted rounded-md flex items-center gap-2">
                                            {getModalityIcon(modality.modality)}
                                            <span className="font-medium">{modality.modality}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Broadcast Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Radio className="h-5 w-5" />
                                    Broadcast Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">TV Channel</Label>
                                        <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Tv className="h-5 w-5 text-blue-600" />
                                                <span className="font-semibold text-blue-800">
                                                    {modality.tv_channel || 'Not specified'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Radio Station</Label>
                                        <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Radio className="h-5 w-5 text-green-600" />
                                                <span className="font-semibold text-green-800">
                                                    {modality.radio || 'Not specified'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium">Online Platform</Label>
                                        <div className="mt-1 p-3 bg-purple-50 border border-purple-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-5 w-5 text-purple-600" />
                                                {modality.online_link ? (
                                                    <a
                                                        href={modality.online_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-semibold text-purple-800 hover:text-purple-900 underline"
                                                    >
                                                        {modality.online_link}
                                                    </a>
                                                ) : (
                                                    <span className="font-semibold text-purple-800">
                                                        Not specified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Schedule Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {modality.time_air && (
                                        <div>
                                            <Label className="text-sm font-medium">Air Time</Label>
                                            <Input value={modality.time_air} readOnly className="mt-1" />
                                        </div>
                                    )}
                                    {modality.period && (
                                        <div>
                                            <Label className="text-sm font-medium">Period</Label>
                                            <Input value={modality.period} readOnly className="mt-1" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partnership Information */}
                        {(modality.partner_agency || modality.hosted_by) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Partnership Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {modality.partner_agency && (
                                            <div>
                                                <Label className="text-sm font-medium">Partner Agency</Label>
                                                <Input value={modality.partner_agency} readOnly className="mt-1" />
                                            </div>
                                        )}
                                        {modality.hosted_by && (
                                            <div>
                                                <Label className="text-sm font-medium">Hosted By</Label>
                                                <Input value={modality.hosted_by} readOnly className="mt-1" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Related Project Information */}
                        {modality.project && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Related Project
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center justify-start gap-2"
                                                onClick={() => window.location.href = `/admin/technology-transfer/projects/${modality.project.id}`}
                                            >
                                                <Link className="h-5 w-5" />
                                                {modality.project.name}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Go to project details</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Department */}
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
                                        <span className="text-muted-foreground">Created By</span>
                                        <span>{modality.user.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Last Updated</span>
                                        <span>{modality.updated_at ? new Date(modality.updated_at).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Last Updated By</span>
                                        <span>{modality.user.name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
