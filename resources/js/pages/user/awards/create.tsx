import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { LoaderCircle, Award, FileText, Users, Target, Building, Calendar, AwardIcon, CalendarRange, Upload, X, File, Image } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Awards & Recognition',
        href: '/user/awards',
    },
    {
        title: 'Add New Award',
        href: '/user/awards/create',
    },
];

type PageProps = {
    user: User;
    flash?: { message?: string };
};

export default function CreateAward() {
    const { user, flash } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState('award-details');

    const { data, setData, post, processing, errors, reset } = useForm({
        award_name: '',
        description: '',
        date_received: '',

        event_details: '',
        location: '',
        awarding_body: '',
        people_involved: '',

        attachments: [] as File[],
        attachment_link: '',

        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
    });

    // Helper functions for file handling
    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const fileArray = Array.from(newFiles);
        const validFiles = fileArray.filter(file => {
            // Check file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                toast.error(`File ${file.name} is not a valid file type`);
                return false;
            }

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`File ${file.name} is too large. Maximum size is 10MB`);
                return false;
            }

            return true;
        });

        // Replace existing files instead of appending to avoid accumulation
        setData('attachments', validFiles);
    };

    const clearAllFiles = () => {
        setData('attachments', []);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('user.awards.store'), {
            onSuccess: () => {
                toast.success('Award created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Award" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Add New Award</h1>
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
                            <TabsTrigger value="award-details" className="text-sm">
                                Award Details
                            </TabsTrigger>
                            <TabsTrigger value="event-details" className="text-sm">
                                Event Details
                            </TabsTrigger>
                            <TabsTrigger value="attachments" className="text-sm">
                                Attachments
                            </TabsTrigger>
                        </TabsList>

                        {/* Award Details Tab */}
                        <TabsContent value="award-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AwardIcon className="h-5 w-5" />
                                        Award Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="award_name" className="text-base font-medium">
                                            Award Name
                                        </Label>
                                        <Input
                                            id="award_name"
                                            value={data.award_name}
                                            onChange={(e) => setData('award_name', e.target.value)}
                                            placeholder="Enter award name"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.award_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date_received">Date Received</Label>
                                        <Input
                                            id="date_received"
                                            value={data.date_received}
                                            type='date'
                                            onChange={(e) => setData('date_received', e.target.value)}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.date_received} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Provide a brief description of the award"
                                            rows={3}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Event Detials Tab */}
                        <TabsContent value="event-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarRange className="h-5 w-5" />
                                        Event Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="awarding_body">Awarding Body</Label>
                                            <Input
                                                id="awarding_body"
                                                value={data.awarding_body}
                                                onChange={(e) => setData('awarding_body', e.target.value)}
                                                placeholder="Enter Organization/Institution"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.awarding_body} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                placeholder="Enter location of the event"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.location} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="event_details">Event Details</Label>
                                            <Textarea
                                                id="event_details"
                                                value={data.event_details}
                                                onChange={(e) => setData('event_details', e.target.value)}
                                                placeholder="Provide details about the event where the award was received"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.event_details} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="people_involved">People Involved</Label>
                                            <Input
                                                id="people_involved"
                                                value={data.people_involved}
                                                onChange={(e) => setData('people_involved', e.target.value)}
                                                placeholder="Enter names of people involved (e.g., John Doe, Jane Smith)"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.people_involved} />
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
                                            <Label htmlFor="attachments">Upload Files (max size: 10MB each)</Label>
                                            <Input
                                                ref={fileInputRef}
                                                id="attachments"
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                multiple
                                                onChange={(e) => addFiles(e.target.files)}
                                                disabled={processing}
                                                className="flex-1"
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
                                                onChange={(e) => {
                                                    setData('attachment_link', e.target.value);
                                                }}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.attachment_link} />
                                        </div>
                                    </div>

                                    {/* Display selected files */}
                                    {data.attachments.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm text-muted-foreground">
                                                    Selected Files ({data.attachments.length})
                                                </Label>
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
