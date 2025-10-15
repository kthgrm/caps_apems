import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Users, Calendar, FileText, Download, Target, ExternalLink, Image, LoaderCircle, File, X, Upload } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import type { Award, BreadcrumbItem, } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { asset } from '@/lib/utils';
import InputError from '@/components/input-error';

type PageProps = {
    award: Award;
    flash?: { message?: string };
};

export default function InternationalPartnerDetails() {
    const { award, flash, errors } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        {
            title: 'Edit Award',
            href: `/user/awards/${award.id}/edit`,
        },
    ];

    const { data, setData, put, processing } = useForm({
        id: award.id,
        award_name: award.award_name || '',
        description: award.description || '',
        date_received: award.date_received || '',
        event_details: award.event_details || '',
        location: award.location || '',
        awarding_body: award.awarding_body || '',
        people_involved: award.people_involved || '',
        attachments: [] as File[],
        attachment_link: award.attachment_link || '',
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
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/user/awards/${award.id}`, {
            _method: 'PUT',
            ...data,
        }, {
            onSuccess: () => {
                toast.success('Award updated successfully!');
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Award: ${award.award_name}`} />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-medium">Edit Award</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                variant="default"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Award ID</Label>
                                            <Input value={data.id} readOnly className="mt-1 bg-muted" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Award Name</Label>
                                            <Input
                                                value={data.award_name}
                                                className="mt-1"
                                                onChange={(e) => setData('award_name', e.target.value)}
                                            />
                                            <InputError message={errors.award_name} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Date Received</Label>
                                            <Input
                                                value={data.date_received}
                                                type="date"
                                                className="mt-1"
                                                onChange={(e) => setData('date_received', e.target.value)}
                                            />
                                            <InputError message={errors.date_received} className="mt-1" />
                                        </div>
                                        <div className='col-span-3'>
                                            <Label className="text-sm font-light">Description</Label>
                                            <Textarea
                                                value={data.description}
                                                className="mt-1"
                                                onChange={(e) => setData('description', e.target.value)}
                                            />
                                            <InputError message={errors.description} className="mt-1" />

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Event Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Event Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Awarding Body</Label>
                                            <Input
                                                value={data.awarding_body}
                                                className="mt-1"
                                                onChange={(e) => setData('awarding_body', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Location</Label>
                                            <Input
                                                value={data.location}
                                                className="mt-1"
                                                onChange={(e) => setData('location', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Event Details</Label>
                                            <Textarea
                                                value={data.event_details}
                                                className="mt-1"
                                                onChange={(e) => setData('event_details', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">People Involved</Label>
                                            <Input
                                                value={data.people_involved}
                                                className="mt-1"
                                                onChange={(e) => setData('people_involved', e.target.value)}
                                            />
                                            {data.people_involved ? (
                                                <div className="space-x-2">
                                                    {data.people_involved.split(', ').map((person, index) => (
                                                        <Badge key={index} className="mt-2" variant="outline">
                                                            {person}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : null}
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
                                    {/* Display existing attachments */}
                                    {(award.attachment_paths && award.attachment_paths.length > 0) || award.attachment_path ? (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Current Attachments</Label>
                                            <div className="space-y-1">
                                                {/* Handle new attachment_paths array */}
                                                {award.attachment_paths && award.attachment_paths.map((path: string, index: number) => {
                                                    const fileName = path.split('/').pop() || `Attachment ${index + 1}`;
                                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                                                    return (
                                                        <div key={index} className="flex items-center p-2 border rounded-lg">
                                                            <a
                                                                href={asset(path)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 text-blue-500 hover:underline w-full"
                                                            >
                                                                {isImage ? (
                                                                    <Image className="h-4 w-4 flex-shrink-0" />
                                                                ) : (
                                                                    <File className="h-4 w-4 flex-shrink-0" />
                                                                )}
                                                                <span className="text-sm flex-1">{fileName}</span>
                                                                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                                                            </a>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">No attachments uploaded</div>
                                    )}

                                    {/* File upload section */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="attachments" className='font-light'>Upload New Files (max size: 10MB each)</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={clearAllFiles}
                                                disabled={data.attachments.length === 0}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
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
                                        </div>

                                        {data.attachments.length > 0 && (
                                            <div className="space-y-2">
                                                <Label className='font-light'>New Files to Upload ({data.attachments.length})</Label>
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {data.attachments.map((file, index) => (
                                                        <div
                                                            key={`new-${file.name}-${index}`}
                                                            className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                                                        >
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <div className="flex-shrink-0">
                                                                    {file.type.startsWith('image/') ? (
                                                                        <Image className="h-5 w-5 text-green-500" />
                                                                    ) : (
                                                                        <FileText className="h-5 w-5 text-green-500" />
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
                                    </div>

                                    <div>
                                        <Label className="text-sm font-light" htmlFor='attachment_link'>External Link</Label>
                                        <Input
                                            id='attachment_link'
                                            type='url'
                                            value={data.attachment_link}
                                            className="mt-1"
                                            onChange={(e) => setData('attachment_link', e.target.value)}
                                        />
                                        {errors.attachment_link && <p className="text-red-500 text-sm mt-1">{errors.attachment_link}</p>}
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
