import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Award, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AwardIcon, Trophy, Users, Building, Calendar, Clock, FileText, Download, User, MapPin, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type PageProps = {
    award: Award;
    flash?: { message?: string };
};

export default function AwardsDetails() {
    const { award, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Awards and Recognitions',
            href: '/admin/awards-recognition',
        },
        {
            title: 'Campus',
            href: '/admin/awards-recognition',
        },
        {
            title: 'College',
            href: `/admin/awards-recognition/${award.campus_college.campus.id}`,
        },
        {
            title: 'Awards',
            href: `/admin/awards-recognition/${award.campus_college.campus.id}/${award.campus_college.college.id}`,
        },
        {
            title: 'Details',
            href: `/admin/awards-recognition/awards/${award.id}`,
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

    const getAwardTypeColor = (awardName: string) => {
        // Simple logic to determine award type color based on common keywords
        const name = awardName.toLowerCase();
        if (name.includes('excellence') || name.includes('outstanding')) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        } else if (name.includes('research') || name.includes('innovation')) {
            return 'bg-blue-100 text-blue-800 border-blue-200';
        } else if (name.includes('service') || name.includes('community')) {
            return 'bg-green-100 text-green-800 border-green-200';
        } else if (name.includes('achievement') || name.includes('recognition')) {
            return 'bg-purple-100 text-purple-800 border-purple-200';
        } else {
            return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const daysSinceReceived = Math.floor((new Date().getTime() - new Date(award.date_received).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Award Details" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-bold'>Award Details</h1>
                    <div>
                        <Button variant="destructive" className="w-full justify-start bg-red-800 hover:bg-red-900">
                            Delete Award
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
                                    <AwardIcon className="h-5 w-5" />
                                    Award Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Award ID</Label>
                                        <Input value={award.id} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Award Name</Label>
                                        <Input value={award.award_name} readOnly className="mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Description</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {award.description || 'No description provided'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Event Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Event Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-light">Date Received</Label>
                                    <Input value={new Date(award.date_received).toLocaleDateString()} readOnly />
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Event Details</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {award.event_details || 'No event details provided'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* People Involved */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    People Involved
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {award.people_involved ? (
                                    <div className="flex flex-wrap gap-2">
                                        {award.people_involved.split(', ').map((person, index) => (
                                            <Badge key={index} variant="outline" className="text-sm">
                                                {person}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No people involved</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Attachment */}
                        {award.attachment_path && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-5 w-5" />
                                        Attachment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
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
                                </CardContent>
                            </Card>
                        )}

                        {/* Department */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Department
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {award.campus_college && (
                                    <>
                                        <div>
                                            <Label className="text-sm font-medium">Campus</Label>
                                            <div className="mt-1 flex items-center gap-2">
                                                {award.campus_college.campus?.logo && (
                                                    <img
                                                        src={asset(award.campus_college.campus.logo)}
                                                        alt="Campus logo"
                                                        className="h-8 w-8 rounded"
                                                    />
                                                )}
                                                <span className="text-sm font-medium">{award.campus_college.campus?.name}</span>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Label className="text-sm font-medium">College</Label>
                                            <div className="mt-1 flex items-center gap-2">
                                                {award.campus_college.college?.logo && (
                                                    <img
                                                        src={asset(award.campus_college.college.logo)}
                                                        alt="College logo"
                                                        className="h-8 w-8 rounded"
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{award.campus_college.college?.name}</span>
                                                    <span className="text-xs text-muted-foreground">{award.campus_college.college?.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Administrative Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Administrative Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Created</span>
                                        <span>{new Date(award.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Created By</span>
                                        <span>{award.user.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Last Updated</span>
                                        <span>{new Date(award.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Last Updated By</span>
                                        <span>{award.user.name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout >
    );
}
