import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, X, Calendar, User, Building, Phone, Mail, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem, Resolution } from '@/types';
import InputError from '@/components/input-error';

interface ResolutionEditProps {
    resolution: Resolution;
}

export default function ResolutionEdit({ resolution }: ResolutionEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Resolutions', href: '/admin/resolutions' },
        { title: resolution.resolution_number, href: `/admin/resolutions/${resolution.id}` },
        { title: 'Edit', href: `/admin/resolutions/${resolution.id}/edit` },
    ];

    const { data, setData, put, processing, errors, isDirty } = useForm({
        resolution_number: resolution.resolution_number || '',
        year_of_effectivity: resolution.year_of_effectivity ? new Date(resolution.year_of_effectivity).toISOString().split('T')[0] : '',
        expiration: resolution.expiration ? new Date(resolution.expiration).toISOString().split('T')[0] : '',
        contact_person: resolution.contact_person || '',
        contact_number_email: resolution.contact_number_email || '',
        partner_agency_organization: resolution.partner_agency_organization || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/resolutions/${resolution.id}`, {
            onSuccess: () => {
                // Success is handled by the redirect in the controller
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Resolution - ${resolution.resolution_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        Edit Resolution
                    </h1>
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            form="resolution-edit-form"

                            disabled={processing}
                        >
                            {processing ? 'Updating...' : 'Update Resolution'}
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

                <form id="resolution-edit-form" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Resolution Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Resolution Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="id">Id</Label>
                                        <Input
                                            id="id"
                                            type="text"
                                            value={resolution.id}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="resolution_number">Resolution Number</Label>
                                        <Input
                                            id="resolution_number"
                                            type="text"
                                            value={data.resolution_number}
                                            onChange={(e) => setData('resolution_number', e.target.value)}
                                            placeholder="Enter resolution number"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.resolution_number} />
                                    </div>
                                    <div>
                                        <Label htmlFor="year_of_effectivity" className="flex items-center gap-2">
                                            Year of Effectivity
                                        </Label>
                                        <Input
                                            id="year_of_effectivity"
                                            type="date"
                                            value={data.year_of_effectivity}
                                            onChange={(e) => setData('year_of_effectivity', e.target.value)}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.year_of_effectivity} />
                                    </div>
                                    <div>
                                        <Label htmlFor="expiration" className="flex items-center gap-2">
                                            Expiration Date
                                        </Label>
                                        <Input
                                            id="expiration"
                                            type="date"
                                            value={data.expiration}
                                            onChange={(e) => setData('expiration', e.target.value)}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.expiration} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Partner Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Partner Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="partner_agency_organization">Partner Agency/Organization</Label>
                                        <Input
                                            id="partner_agency_organization"
                                            type="text"
                                            value={data.partner_agency_organization}
                                            onChange={(e) => setData('partner_agency_organization', e.target.value)}
                                            placeholder="Enter partner agency or organization"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.partner_agency_organization} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="contact_person" className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Contact Person
                                            </Label>
                                            <Input
                                                id="contact_person"
                                                type="text"
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                placeholder="Enter contact person name"
                                                className="mt-1"
                                            />
                                            <InputError message={errors.contact_person} />
                                        </div>
                                        <div>
                                            <Label htmlFor="contact_number_email" className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                Contact Number/Email
                                            </Label>
                                            <Input
                                                id="contact_number_email"
                                                type="text"
                                                value={data.contact_number_email}
                                                onChange={(e) => setData('contact_number_email', e.target.value)}
                                                placeholder="Enter phone number or email"
                                                className="mt-1"
                                            />
                                            <InputError message={errors.contact_number_email} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Record Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Record Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Created</span>
                                            <span>{new Date(resolution.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Last Updated</span>
                                            <span>{new Date(resolution.updated_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Created By</span>
                                            <span>{resolution.user.name}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
