import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Award, type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AwardIcon, Trophy, Users, Building, Calendar, Clock, FileText, Download, User, MapPin, Image, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import InputError from "@/components/input-error";
import { asset } from '@/lib/utils';

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
            href: `/admin/awards-recognition/${award.campus_college.campus.id}/${award.campus_college.college.id}/awards`,
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

        router.patch(`/admin/awards-recognition/${award.id}/archive`, {
            password: password
        }, {
            onSuccess: () => {
                setIsArchiveDialogOpen(false);
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
                toast.success('Award archived successfully.');
                // Redirect back to awards list
                router.visit(`/admin/awards-recognition/${award.campus_college.campus.id}/${award.campus_college.college.id}/awards`);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Award Details" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-bold'>Award Details</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(`/admin/awards-recognition/awards/${award.id}/edit`)}
                        >
                            Edit Award
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-800 hover:bg-red-900"
                            onClick={() => setIsArchiveDialogOpen(true)}
                        >
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

                        {/* Attachment */}
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
                                                <p className="text-sm">award Attachment</p>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Award Attachment</DialogTitle>
                                                    <DialogDescription>
                                                        <img src={asset(award.attachment_path)} alt="Award Attachment" className="w-full h-auto" />
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
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4" />
                                            {award.attachment_link ? (
                                                <a
                                                    href={award.attachment_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-sm flex items-center gap-1 truncate"
                                                >
                                                    {award.attachment_link}
                                                </a>
                                            ) : (
                                                <span className="text-sm">No Attachment Link</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                                        <span>{new Date(award.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Last Updated</span>
                                        <span>{new Date(award.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Created By</span>
                                        <span>{award.user.name}</span>
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
                            You are about to delete the award "{award.award_name}". This action requires password confirmation.
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
        </AppLayout >
    );
}
