import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { InternationalPartner, type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Building, MapPin, Calendar, Clock, FileText, Download, Target, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import InputError from "@/components/input-error";

type PageProps = {
    partnership: InternationalPartner;
    flash?: { message?: string }
}

export default function PartnershipDetails() {
    const { partnership, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'International Partners',
            href: '/admin/international-partners',
        },
        {
            title: 'Campus',
            href: '/admin/international-partners',
        },
        {
            title: 'College',
            href: `/admin/international-partners/${partnership.campus_college.campus.id}`,
        },
        {
            title: 'Partnerships',
            href: `/admin/international-partners/${partnership.campus_college.campus.id}/${partnership.campus_college.college.id}/partnerships`,
        },
        {
            title: 'Engagement Details',
            href: `/admin/international-partners/${partnership.campus_college.campus.id}/${partnership.campus_college.college.id}/partnerships/${partnership.id}`,
        }
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    // Archive functionality state
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleArchive = () => {
        if (!password.trim()) {
            setErrorMessage('Please enter your password to confirm.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        router.patch(`/admin/international-partners/${partnership.id}/archive`, {
            password: password
        }, {
            onSuccess: () => {
                setIsArchiveDialogOpen(false);
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
                toast.success('Partnership archived successfully.');
                // Redirect back to partnerships list
                router.visit(`/admin/international-partners/${partnership.campus_college.campus.id}/${partnership.campus_college.college.id}/partnerships`);
            },
            onError: (errors) => {
                setIsLoading(false);
                if (errors.password) {
                    setErrorMessage(errors.password);
                } else if (errors.message) {
                    setErrorMessage(errors.message);
                } else {
                    setErrorMessage('Archive failed. Please try again.');
                }
            }
        });
    };

    const resetArchiveDialog = () => {
        setIsArchiveDialogOpen(false);
        setPassword('');
        setErrorMessage('');
    };

    const asset = (path: string) => {
        return `/storage/${path}`;
    }

    const getActivityColor = (activity: string) => {
        switch (activity) {
            case 'seminar': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'training': return 'bg-green-100 text-green-800 border-green-200';
            case 'workshop': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'extension service': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'livelihood program': return 'bg-pink-100 text-pink-800 border-pink-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Engagement Details" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-bold'>Partnership Details</h1>
                    <div>
                        <Button
                            variant="destructive"
                            className="w-full justify-start bg-red-800 hover:bg-red-900"
                            onClick={() => setIsArchiveDialogOpen(true)}
                        >
                            Delete Partnership
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Partnership Information */}
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
                                        <Label className="text-sm font-light">Partnership ID</Label>
                                        <Input value={partnership.id} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Agency Partner</Label>
                                        <Input value={partnership.agency_partner} readOnly className="mt-1" />
                                    </div>
                                    <div className='col-span-2'>
                                        <Label className="text-sm font-light flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </Label>
                                        <Input value={partnership.location} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Activity Type</Label>
                                        <div className="mt-1">
                                            <Badge className={`${getActivityColor(partnership.activity_conducted)} border`}>
                                                {partnership.activity_conducted.charAt(0).toUpperCase() + partnership.activity_conducted.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Start Date</Label>
                                        <Input
                                            value={partnership.start_date ? new Date(partnership.start_date).toLocaleDateString() : 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">End Date</Label>
                                        <Input
                                            value={partnership.end_date ? new Date(partnership.end_date).toLocaleDateString() : 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            Duration
                                        </Label>
                                        <Input
                                            value={
                                                partnership.start_date && partnership.end_date
                                                    ? (() => {
                                                        const start = new Date(partnership.start_date);
                                                        const end = new Date(partnership.end_date);
                                                        const diffMs = end.getTime() - start.getTime();
                                                        if (isNaN(diffMs) || diffMs < 0) return 'Invalid dates';
                                                        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
                                                        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
                                                    })()
                                                    : 'Not set'
                                            }
                                            readOnly
                                            className="mt-1"
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
                                        <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-blue-600" />
                                                <span className="text-lg font-semibold text-blue-800">
                                                    {Number(partnership.number_of_participants).toLocaleString()}
                                                </span>
                                                <span className="text-sm text-blue-600">participants</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Committee Members</Label>
                                        <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-green-600" />
                                                <span className="text-lg font-semibold text-green-800">
                                                    {Number(partnership.number_of_committee).toLocaleString()}
                                                </span>
                                                <span className="text-sm text-green-600">committee</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Total Involvement</Label>
                                    <div className="mt-1 p-4 bg-purple-50 border border-purple-200 rounded-md">
                                        <div className="flex items-center justify-center gap-2">
                                            <Users className="h-6 w-6 text-purple-600" />
                                            <span className="text-2xl font-bold text-purple-800">
                                                {(Number(partnership.number_of_participants) + Number(partnership.number_of_committee)).toLocaleString()}
                                            </span>
                                            <span className="text-lg text-purple-600">total people involved</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Narrative */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Activity Narrative
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                    {partnership.narrative || 'No narrative provided'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Attachment */}
                        {partnership.attachment_path && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-5 w-5" />
                                        Attachment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        {partnership.attachment_path ? (
                                            <Dialog>
                                                <DialogTrigger className='flex items-center gap-2 text-blue-500 hover:underline w-full'>
                                                    <Image className="h-4 w-4" />
                                                    <p className="text-sm">Partnership Attachment</p>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Partnership Attachment</DialogTitle>
                                                        <DialogDescription>
                                                            <img src={asset(partnership.attachment_path)} alt="Partnership Attachment" className="w-full h-auto" />
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
                                {partnership.campus_college && (
                                    <>
                                        <div>
                                            <Label className="text-sm font-medium">Campus</Label>
                                            <div className="mt-1 flex items-center gap-2">
                                                {partnership.campus_college.campus?.logo && (
                                                    <img
                                                        src={asset(partnership.campus_college.campus.logo)}
                                                        alt="Campus logo"
                                                        className="h-6 w-6 rounded"
                                                    />
                                                )}
                                                <span className="text-sm">{partnership.campus_college.campus?.name}</span>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Label className="text-sm font-medium">College</Label>
                                            <div className="mt-1 flex items-center gap-2">
                                                {partnership.campus_college.college?.logo && (
                                                    <img
                                                        src={asset(partnership.campus_college.college.logo)}
                                                        alt="College logo"
                                                        className="h-6 w-6 rounded"
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{partnership.campus_college.college?.name}</span>
                                                    <span className="text-xs text-muted-foreground">{partnership.campus_college.college?.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Record Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Record Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Created</span>
                                        <span>{partnership.created_at ? new Date(partnership.created_at).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Created By</span>
                                        <span>{partnership.user.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Last Updated</span>
                                        <span>{partnership.updated_at ? new Date(partnership.updated_at).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Last Updated By</span>
                                        <span>{partnership.user.name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Archive Confirmation Dialog */}
            <Dialog open={isArchiveDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    resetArchiveDialog();
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            You are about to delete the partnership with "{partnership.agency_partner}". This action requires password confirmation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="col-span-3"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleArchive();
                                    }
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <InputError message={errorMessage} className="col-span-4" />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={resetArchiveDialog}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleArchive}
                            disabled={isLoading || !password.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
