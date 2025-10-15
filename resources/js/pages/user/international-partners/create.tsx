import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { LoaderCircle, Users, FileText, Clock3, File as FileIcon, Image, X, Upload } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'International Partners',
        href: '/user/international-partners',
    },
    {
        title: 'Add New International Partner',
        href: '/user/international-partners/create',
    },
];

type PartnerForm = {
    agency_partner: string;
    location: string;
    activity_conducted: string;
    start_date: string;
    end_date: string;
    number_of_participants: string;
    number_of_committee: string;
    narrative: string;
    remarks: string;
    attachments: File[];
    attachment_link?: string;
    created_at: string;
    updated_at: string;
}

type PageProps = {
    user: User;
    flash?: { message?: string };
};

export default function CreateEngagement() {
    const { user, flash } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState('partnership-details');

    const { data, setData, post, processing, errors, reset } = useForm<PartnerForm>({
        agency_partner: '',
        location: '',
        activity_conducted: '',
        start_date: '',
        end_date: '',
        number_of_participants: '',
        number_of_committee: '',
        narrative: '',
        remarks: '',

        attachments: [] as File[],
        attachment_link: '',

        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper functions for file handling
    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const fileArray = Array.from(newFiles);
        const validFiles = fileArray.filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                toast.error(`File ${file.name} is not a valid file type`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`File ${file.name} is too large. Maximum size is 10MB`);
                return false;
            }
            return true;
        });

        // Replace existing files instead of appending
        setData('attachments', validFiles);
    };

    const clearAllFiles = () => {
        setData('attachments', []);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Use router.post to ensure multipart/form-data is handled when files present
        post(route('user.international-partners.store'), {
            onSuccess: () => {
                toast.success('Record created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="International Partnership" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Add New Partnership</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="college" className="text-base font-medium">
                                College
                            </Label>
                            <Input
                                id="college"
                                value={`${user.campus_college.campus.name} - ${user.campus_college.college.code}`}
                                readOnly
                                className="h-10 bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="created_at" className="text-base font-medium">
                                Created At
                            </Label>
                            <Input
                                id="created_at"
                                type="date"
                                value={data.created_at}
                                readOnly
                                className="h-10 bg-muted"
                            />
                        </div>
                    </div>

                    {/* Tabbed Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="partnership-details" className="text-sm">
                                Partnership Details
                            </TabsTrigger>
                            <TabsTrigger value="timeline-duration" className="text-sm">
                                Timeline & Duration
                            </TabsTrigger>
                            <TabsTrigger value="participation-metrics" className="text-sm">
                                Participation Metrics
                            </TabsTrigger>
                            <TabsTrigger value="attachments" className="text-sm">
                                Attachments
                            </TabsTrigger>
                        </TabsList>

                        {/* Partnership Details Tab */}
                        <TabsContent value="partnership-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock3 className="h-5 w-5" />
                                        Partnership Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="agency_partner" className="text-base font-medium">
                                            Agency Partner
                                        </Label>
                                        <Input
                                            id="agency_partner"
                                            value={data.agency_partner}
                                            onChange={(e) => setData('agency_partner', e.target.value)}
                                            placeholder="Enter agency partner name"
                                            className="h-10"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.agency_partner} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Enter location of the agency partner"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.location} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="activity_conducted">Activity Conducted</Label>
                                        <Input
                                            id="activity_conducted"
                                            value={data.activity_conducted}
                                            onChange={(e) => setData('activity_conducted', e.target.value)}
                                            placeholder="Enter activity conducted (e.g., Workshop, Seminar, Training)"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.activity_conducted} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="narrative">Narrative</Label>
                                        <Textarea
                                            id="narrative"
                                            value={data.narrative}
                                            onChange={(e) => setData('narrative', e.target.value)}
                                            placeholder="Provide a brief narrative of the partnership"
                                            rows={3}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.narrative} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Timeline Tab */}
                        <TabsContent value="timeline-duration" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock3 className="h-5 w-5" />
                                        Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date">Start Date</Label>
                                            <Input
                                                id="start_date"
                                                value={data.start_date}
                                                type='date'
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.start_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end_date">End Date</Label>
                                            <Input
                                                id="end_date"
                                                value={data.end_date}
                                                type='date'
                                                min={data.start_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.end_date} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Participation Metrics Tab */}
                        <TabsContent value="participation-metrics" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Participation Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="number_of_participants">Number of Participants</Label>
                                            <Input
                                                id="number_of_participants"
                                                value={data.number_of_participants}
                                                type="number"
                                                min={1}
                                                onChange={(e) => setData('number_of_participants', e.target.value)}
                                                placeholder='0'
                                                disabled={processing}
                                            />
                                            <InputError message={errors.number_of_participants} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="number_of_committee">Number of Committee</Label>
                                            <Input
                                                id="number_of_committee"
                                                value={data.number_of_committee}
                                                type="number"
                                                min={1}
                                                onChange={(e) => setData('number_of_committee', e.target.value)}
                                                placeholder='0'
                                                disabled={processing}
                                            />
                                            <InputError message={errors.number_of_committee} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Attachments Tab */}
                        <TabsContent value="attachments" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="attachments">Upload Files</Label>
                                            <Input
                                                ref={fileInputRef}
                                                id="attachments"
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                multiple={true}
                                                onChange={(e) => addFiles(e.target.files)}
                                                disabled={processing}
                                                className="file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)
                                            </p>
                                            <InputError message={errors.attachments} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="attachment_link">Upload Link</Label>
                                            <Input
                                                id="attachment_link"
                                                type="url"
                                                placeholder="Enter your file link"
                                                value={data.attachment_link}
                                                onChange={(e) => setData('attachment_link', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.attachment_link} />
                                        </div>
                                    </div>

                                    {/* File List */}
                                    {data.attachments.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-medium">Selected Files ({data.attachments.length})</Label>
                                                {data.attachments.length > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={clearAllFiles}
                                                        disabled={processing}
                                                        className="text-xs"
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {data.attachments.map((file, index) => (
                                                    <div
                                                        key={`${file.name}-${index}`}
                                                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="flex-shrink-0">
                                                                {file.type.startsWith('image/') ? (
                                                                    <FileText className="h-5 w-5 text-blue-500" />
                                                                ) : (
                                                                    <FileText className="h-5 w-5 text-gray-500" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatFileSize(file.size)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-2 rounded-md"
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Submit form
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
