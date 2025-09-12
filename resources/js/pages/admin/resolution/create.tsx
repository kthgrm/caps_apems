import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, FileText, Users, Building, Mail, Phone } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Resolutions', href: '/admin/resolutions' },
    { title: 'Create Resolution', href: '/admin/resolutions/create' },
];

export default function CreateResolution() {
    const { data, setData, post, processing, errors, reset } = useForm({
        resolution_number: '',
        year_of_effectivity: '',
        expiration: '',
        contact_person: '',
        contact_number_email: '',
        partner_agency_organization: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.resolutions.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Resolution" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Create New Resolution</h1>
                            <p className="text-gray-600">
                                Add a new resolution
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Resolution Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Resolution Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="resolution_number">
                                        Resolution Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="resolution_number"
                                        value={data.resolution_number}
                                        onChange={(e) => setData('resolution_number', e.target.value)}
                                        placeholder="e.g., RES-2025-001"
                                        className={errors.resolution_number ? 'border-red-500' : ''}
                                    />
                                    {errors.resolution_number && (
                                        <p className="text-sm text-red-600">{errors.resolution_number}</p>
                                    )}
                                </div>

                                {/* Dates Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year_of_effectivity" className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Year of Effectivity <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="year_of_effectivity"
                                            type="date"
                                            value={data.year_of_effectivity}
                                            onChange={(e) => setData('year_of_effectivity', e.target.value)}
                                            className={errors.year_of_effectivity ? 'border-red-500' : ''}
                                        />
                                        {errors.year_of_effectivity && (
                                            <p className="text-sm text-red-600">{errors.year_of_effectivity}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="expiration" className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Expiration Date <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="expiration"
                                            type="date"
                                            value={data.expiration}
                                            onChange={(e) => setData('expiration', e.target.value)}
                                            className={errors.expiration ? 'border-red-500' : ''}
                                        />
                                        {errors.expiration && (
                                            <p className="text-sm text-red-600">{errors.expiration}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Partner Agency */}
                                <div className="space-y-2">
                                    <Label htmlFor="partner_agency_organization" className="flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Partner Agency/Organization <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="partner_agency_organization"
                                        value={data.partner_agency_organization}
                                        onChange={(e) => setData('partner_agency_organization', e.target.value)}
                                        placeholder="e.g., Department of Science and Technology"
                                        className={errors.partner_agency_organization ? 'border-red-500' : ''}
                                    />
                                    {errors.partner_agency_organization && (
                                        <p className="text-sm text-red-600">{errors.partner_agency_organization}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Contact Person */}
                                <div className="space-y-2">
                                    <Label htmlFor="contact_person">
                                        Contact Person <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="contact_person"
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        placeholder="e.g., Maria Santos"
                                        className={errors.contact_person ? 'border-red-500' : ''}
                                    />
                                    {errors.contact_person && (
                                        <p className="text-sm text-red-600">{errors.contact_person}</p>
                                    )}
                                </div>

                                {/* Contact Number/Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="contact_number_email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Contact Number/Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="contact_number_email"
                                        value={data.contact_number_email}
                                        onChange={(e) => setData('contact_number_email', e.target.value)}
                                        placeholder="e.g., maria.santos@university.edu.ph or +63912-345-6789"
                                        className={errors.contact_number_email ? 'border-red-500' : ''}
                                    />
                                    {errors.contact_number_email && (
                                        <p className="text-sm text-red-600">{errors.contact_number_email}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link href="/admin/resolutions">
                                    Cancel
                                </Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create Resolution'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
