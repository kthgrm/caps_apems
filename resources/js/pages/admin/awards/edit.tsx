import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Award, type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AwardIcon, Trophy, Users, Building, Calendar, FileText, Download, MapPin, Image, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import InputError from "@/components/input-error";
import { asset } from '@/lib/utils';

interface AwardEditProps {
    award: Award;
    flash?: { message?: string };
}

export default function AwardEdit() {
    const { award, flash } = usePage().props as unknown as AwardEditProps;

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
            href: `/admin/awards-recognition/${award.campus_college?.campus?.id}`,
        },
        {
            title: 'Awards',
            href: `/admin/awards-recognition/${award.campus_college?.campus?.id}/${award.campus_college?.college?.id}/awards`,
        },
        {
            title: 'Edit Award',
            href: `/admin/awards-recognition/awards/${award.id}/edit`,
        },
    ];

    // Form handling with all award fields
    const { data, setData, post, processing, errors, transform } = useForm({
        award_name: award.award_name || '',
        description: award.description || '',
        date_received: award.date_received || '',
        event_details: award.event_details || '',
        location: award.location || '',
        awarding_body: award.awarding_body || '',
        people_involved: award.people_involved || '',
        attachment: null as File | null,
        attachment_link: award.attachment_link || '',
        _method: 'PUT'
    });

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/awards-recognition/awards/${award.id}`, {
            onSuccess: () => {
                toast.success('Award updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update award. Please check the form and try again.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Award" />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className='text-2xl font-bold flex items-center gap-2'>
                                <Edit3 className="h-6 w-6" />
                                Edit Award
                            </h1>
                            <p className="text-muted-foreground">Update award information and details</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Updating...' : 'Update Award'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
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
                                            <Input value={award.id} readOnly className="mt-1 bg-muted" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="award_name">Award Name *</Label>
                                            <Input
                                                id="award_name"
                                                value={data.award_name}
                                                onChange={(e) => setData('award_name', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter award name"
                                            />
                                            {errors.award_name && <InputError message={errors.award_name} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="date_received">Date Received *</Label>
                                            <Input
                                                id="date_received"
                                                type="date"
                                                value={data.date_received}
                                                onChange={(e) => setData('date_received', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.date_received && <InputError message={errors.date_received} className="mt-1" />}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Provide a detailed description of the award"
                                        />
                                        {errors.description && <InputError message={errors.description} className="mt-1" />}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="awarding_body">Awarding Body *</Label>
                                            <Input
                                                id="awarding_body"
                                                value={data.awarding_body}
                                                onChange={(e) => setData('awarding_body', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter awarding body/organization"
                                            />
                                            {errors.awarding_body && <InputError message={errors.awarding_body} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="location">Location *</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter event location"
                                            />
                                            {errors.location && <InputError message={errors.location} className="mt-1" />}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="event_details">Event Details *</Label>
                                        <Textarea
                                            id="event_details"
                                            value={data.event_details}
                                            onChange={(e) => setData('event_details', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Provide details about the event where the award was received"
                                        />
                                        {errors.event_details && <InputError message={errors.event_details} className="mt-1" />}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="people_involved">People Involved *</Label>
                                        <Input
                                            id="people_involved"
                                            value={data.people_involved}
                                            onChange={(e) => setData('people_involved', e.target.value)}
                                            className="mt-1"
                                            placeholder="Enter names of people involved (e.g., John Doe, Jane Smith)"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Separate multiple names with commas
                                        </p>
                                        {errors.people_involved && <InputError message={errors.people_involved} className="mt-1" />}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Institution Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Department
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Campus</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            {award.campus_college?.campus?.logo && (
                                                <img
                                                    src={asset(award.campus_college.campus.logo)}
                                                    alt="Campus logo"
                                                    className="h-6 w-6 rounded"
                                                />
                                            )}
                                            <span className="text-sm">{award.campus_college?.campus?.name}</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <Label className="text-sm font-medium">College</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            {award.campus_college?.college?.logo && (
                                                <img
                                                    src={asset(award.campus_college.college.logo)}
                                                    alt="College logo"
                                                    className="h-6 w-6 rounded"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{award.campus_college?.college?.name}</span>
                                                <span className="text-xs text-muted-foreground">{award.campus_college?.college?.code}</span>
                                            </div>
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
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="attachment">Upload Attachment</Label>
                                        <Input
                                            id="attachment"
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Supported formats: Images, PDF, DOC, DOCX (Max 10MB)
                                        </p>
                                        {errors.attachment && <InputError message={errors.attachment} className="mt-1" />}
                                    </div>

                                    {/* Current attachment display */}
                                    {award.attachment_path && (
                                        <div className="mt-3">
                                            <Label className="text-sm font-medium">Current Attachment</Label>
                                            <div className="mt-1 p-2 border rounded-md">
                                                <Dialog>
                                                    <DialogTrigger className='flex items-center gap-2 text-blue-500 hover:underline w-full'>
                                                        <Image className="h-4 w-4" />
                                                        <p className="text-sm">View Current Attachment</p>
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
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label className="text-sm font-light" htmlFor="attachment_link">Attachment Link</Label>
                                        <Input
                                            id="attachment_link"
                                            type="url"
                                            value={data.attachment_link}
                                            onChange={(e) => setData('attachment_link', e.target.value)}
                                            className="mt-1"
                                            placeholder="https://example.com/document"
                                        />
                                        {errors.attachment_link && <InputError message={errors.attachment_link} className="mt-1" />}
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
                                            <span>{award.created_at ? new Date(award.created_at).toLocaleDateString() : 'Not set'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Last Updated</span>
                                            <span>{award.updated_at ? new Date(award.updated_at).toLocaleDateString() : 'Not set'}</span>
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
            </form>
        </AppLayout>
    );
}