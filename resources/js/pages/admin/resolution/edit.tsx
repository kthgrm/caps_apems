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

interface ResolutionEditProps {
    resolution: Resolution;
}

export default function ResolutionEdit({ resolution }: ResolutionEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Resolutions', href: '/admin/resolutions' },
        { title: resolution.resolution_number, href: `/admin/resolutions/${resolution.id}` },
        { title: 'Edit', href: `/admin/resolutions/${resolution.id}/edit` },
    ];

    const { data, setData, patch, processing, errors, isDirty } = useForm({
        resolution_number: resolution.resolution_number || '',
        year_of_effectivity: resolution.year_of_effectivity ? new Date(resolution.year_of_effectivity).toISOString().split('T')[0] : '',
        expiration: resolution.expiration ? new Date(resolution.expiration).toISOString().split('T')[0] : '',
        contact_person: resolution.contact_person || '',
        contact_number_email: resolution.contact_number_email || '',
        partner_agency_organization: resolution.partner_agency_organization || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/resolutions/${resolution.id}`, {
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
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                                Edit Resolution
                            </h1>
                            <p className="text-gray-600">
                                Update resolution information and details
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href={`/admin/resolutions/${resolution.id}`}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            form="resolution-edit-form"
                            disabled={processing || !isDirty}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Saving...' : 'Save Changes'}
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
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        Resolution Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="resolution_number">Resolution Number</Label>
                                        <Input
                                            id="resolution_number"
                                            type="text"
                                            value={data.resolution_number}
                                            onChange={(e) => setData('resolution_number', e.target.value)}
                                            placeholder="Enter resolution number"
                                            className={errors.resolution_number ? 'border-red-500' : ''}
                                        />
                                        {errors.resolution_number && (
                                            <p className="text-sm text-red-500 mt-1">{errors.resolution_number}</p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="year_of_effectivity" className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Year of Effectivity
                                            </Label>
                                            <Input
                                                id="year_of_effectivity"
                                                type="date"
                                                value={data.year_of_effectivity}
                                                onChange={(e) => setData('year_of_effectivity', e.target.value)}
                                                className={errors.year_of_effectivity ? 'border-red-500' : ''}
                                            />
                                            {errors.year_of_effectivity && (
                                                <p className="text-sm text-red-500 mt-1">{errors.year_of_effectivity}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="expiration" className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Expiration Date
                                            </Label>
                                            <Input
                                                id="expiration"
                                                type="date"
                                                value={data.expiration}
                                                onChange={(e) => setData('expiration', e.target.value)}
                                                className={errors.expiration ? 'border-red-500' : ''}
                                            />
                                            {errors.expiration && (
                                                <p className="text-sm text-red-500 mt-1">{errors.expiration}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Partner Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5 text-green-600" />
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
                                            className={errors.partner_agency_organization ? 'border-red-500' : ''}
                                        />
                                        {errors.partner_agency_organization && (
                                            <p className="text-sm text-red-500 mt-1">{errors.partner_agency_organization}</p>
                                        )}
                                    </div>

                                    <Separator />

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
                                                className={errors.contact_person ? 'border-red-500' : ''}
                                            />
                                            {errors.contact_person && (
                                                <p className="text-sm text-red-500 mt-1">{errors.contact_person}</p>
                                            )}
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
                                                className={errors.contact_number_email ? 'border-red-500' : ''}
                                            />
                                            {errors.contact_number_email && (
                                                <p className="text-sm text-red-500 mt-1">{errors.contact_number_email}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Submission Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Submission Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Submitted By</Label>
                                        <p className="font-medium flex items-center gap-2">
                                            <User className="h-4 w-4 text-purple-600" />
                                            {resolution.user.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Created At</Label>
                                        <p className="text-sm">{new Date(resolution.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                                        <p className="text-sm">{new Date(resolution.updated_at).toLocaleString()}</p>
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
