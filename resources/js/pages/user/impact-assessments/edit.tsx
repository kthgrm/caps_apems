import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Target, LoaderCircle, Folder } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, ImpactAssessment, } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

type PageProps = {
    projects: { value: number; label: string }[];
    assessment: ImpactAssessment;
    flash?: { message?: string };
};

export default function ImpactAssessmentDetails() {
    const { projects, assessment, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Project Activities',
            href: '/user/impact-assessments',
        },
        {
            title: 'Impact Assessment',
            href: '/user/impact-assessments',
        },
        {
            title: assessment.project?.name || 'Unknown Project',
            href: `/user/impact-assessments/${assessment.id}`
        },
        {
            title: 'Edit Assessment',
            href: `/user/impact-assessments/${assessment.id}/edit`,
        }
    ];

    const { data, setData, put, processing, errors } = useForm({
        id: assessment.id,
        beneficiary: assessment.beneficiary,
        geographic_coverage: assessment.geographic_coverage,
        num_direct_beneficiary: assessment.num_direct_beneficiary,
        num_indirect_beneficiary: assessment.num_indirect_beneficiary,
        project_id: assessment.project_id,
    });

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/user/impact-assessments/${assessment.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Impact Assessment: ${assessment.project?.name || 'Unknown Project'}`} />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-medium">Edit Assessment</h1>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Assessment ID</Label>
                                            <Input
                                                value={data.id}
                                                readOnly
                                                className="mt-1 bg-muted"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Beneficiary</Label>
                                            <Input
                                                value={data.beneficiary}
                                                onChange={(e) => setData('beneficiary', e.target.value)}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.beneficiary} />
                                        </div>
                                        <div className='col-span-2'>
                                            <Label className="text-sm font-light">Geographic Coverage</Label>
                                            <Input
                                                value={data.geographic_coverage}
                                                onChange={(e) => setData('geographic_coverage', e.target.value)}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.geographic_coverage} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Impact Metrics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Impact Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light">Direct Beneficiary</Label>
                                            <Input
                                                value={data.num_direct_beneficiary}
                                                type='number'
                                                onChange={(e) => setData('num_direct_beneficiary', parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.num_direct_beneficiary} />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Indirect Beneficiary</Label>
                                            <Input
                                                value={data.num_indirect_beneficiary}
                                                type='number'
                                                onChange={(e) => setData('num_indirect_beneficiary', parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.num_indirect_beneficiary} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Folder className="h-5 w-5" />
                                        Related Project
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <Select
                                            value={data.project_id.toString()}
                                            onValueChange={(value) => {
                                                setData('project_id', Number(value));
                                                console.log('Selected project ID:', value);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {projects.map((project) => (
                                                        <SelectItem
                                                            key={project.value}
                                                            value={project.value.toLocaleString()}
                                                        >
                                                            {project.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
