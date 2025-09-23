import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { ImpactAssessment, type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Users, MapPin, Edit3, LoaderCircle, Folder, Building, FileText, Paperclip, TrendingUp } from 'lucide-react';
import InputError from "@/components/input-error";
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ImpactAssessmentEditProps {
    assessment: ImpactAssessment;
    projects: { value: number; label: string }[];
    flash?: { message?: string };
}

export default function ImpactAssessmentEdit() {
    const { assessment, projects, flash } = usePage().props as unknown as ImpactAssessmentEditProps;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Impact Assessment',
            href: '/admin/impact-assessment',
        },
        {
            title: 'Campus',
            href: '/admin/impact-assessment',
        },
        {
            title: 'College',
            href: `/admin/impact-assessment/${assessment.project?.campus_college?.campus?.id}`,
        },
        {
            title: 'Assessments',
            href: `/admin/impact-assessment/${assessment.project?.campus_college?.campus?.id}/${assessment.project?.campus_college?.college?.id}/assessments`,
        },
        {
            title: 'Edit Assessment',
            href: `/admin/impact-assessment/assessments/${assessment.id}/edit`,
        },
    ];

    // Form handling with all assessment fields
    const { data, setData, put, processing, errors } = useForm({
        project_id: assessment.project_id || '',
        beneficiary: assessment.beneficiary || '',
        geographic_coverage: assessment.geographic_coverage || '',
        num_direct_beneficiary: assessment.num_direct_beneficiary || 0,
        num_indirect_beneficiary: assessment.num_indirect_beneficiary || 0,
        _method: 'PUT'
    });

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/admin/impact-assessment/assessments/${assessment.id}`, {
            onSuccess: () => {
                toast.success('Impact assessment updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update impact assessment. Please check the form and try again.');
            }
        });
    };

    const asset = (path: string) => {
        return `/storage/${path}`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Impact Assessment" />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className='text-2xl font-bold flex items-center gap-2'>
                                Edit Impact Assessment
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Assessment'
                                )}
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
                        {/* Main Assessment Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Assessment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Assessment ID</Label>
                                        <Input value={assessment.id} readOnly className="mt-1 bg-muted" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium" htmlFor="project_id">Related Project *</Label>
                                        <Select
                                            value={data.project_id.toString()}
                                            onValueChange={(value) => setData('project_id', Number(value))}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select Project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projects.map((project) => (
                                                    <SelectItem key={project.value} value={project.value.toString()}>
                                                        {project.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium" htmlFor="beneficiary">Primary Beneficiary *</Label>
                                        <Input
                                            id="beneficiary"
                                            value={data.beneficiary}
                                            onChange={(e) => setData('beneficiary', e.target.value)}
                                            className="mt-1"
                                            placeholder="Enter beneficiary information"
                                        />
                                        {errors.beneficiary && <InputError message={errors.beneficiary} className="mt-1" />}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium" htmlFor="geographic_coverage">Geographic Coverage *</Label>
                                        <Input
                                            id="geographic_coverage"
                                            value={data.geographic_coverage}
                                            onChange={(e) => setData('geographic_coverage', e.target.value)}
                                            className="mt-1"
                                            placeholder="Enter geographic coverage area"
                                        />
                                        {errors.geographic_coverage && <InputError message={errors.geographic_coverage} className="mt-1" />}
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
                                            <Label className="text-sm font-medium" htmlFor="num_direct_beneficiary">Direct Beneficiaries *</Label>
                                            <Input
                                                id="num_direct_beneficiary"
                                                type="number"
                                                min="0"
                                                value={data.num_direct_beneficiary}
                                                onChange={(e) => setData('num_direct_beneficiary', parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                                placeholder="0"
                                            />
                                            {errors.num_direct_beneficiary && <InputError message={errors.num_direct_beneficiary} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium" htmlFor="num_indirect_beneficiary">Indirect Beneficiaries *</Label>
                                            <Input
                                                id="num_indirect_beneficiary"
                                                type="number"
                                                min="0"
                                                value={data.num_indirect_beneficiary}
                                                onChange={(e) => setData('num_indirect_beneficiary', parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                                placeholder="0"
                                            />
                                            {errors.num_indirect_beneficiary && <InputError message={errors.num_indirect_beneficiary} className="mt-1" />}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Information */}
                        <div className="space-y-6">
                            {/* Department */}
                            {assessment.project && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building className="h-5 w-5" />
                                            Department
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {assessment.project.campus_college && (
                                            <>
                                                <div>
                                                    <Label className="text-sm font-medium">Campus</Label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {assessment.project.campus_college.campus?.logo && (
                                                            <img
                                                                src={asset(assessment.project.campus_college.campus.logo)}
                                                                alt="Campus logo"
                                                                className="h-6 w-6 rounded"
                                                            />
                                                        )}
                                                        <span className="text-sm">{assessment.project.campus_college.campus?.name}</span>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div>
                                                    <Label className="text-sm font-medium">College</Label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {assessment.project.campus_college.college?.logo && (
                                                            <img
                                                                src={asset(assessment.project.campus_college.college.logo)}
                                                                alt="College logo"
                                                                className="h-6 w-6 rounded"
                                                            />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{assessment.project.campus_college.college?.name}</span>
                                                            <span className="text-xs text-muted-foreground">{assessment.project.campus_college.college?.code}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Record Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Record Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Created</span>
                                            <span>{assessment.created_at ? new Date(assessment.created_at).toLocaleDateString() : 'Not Set'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Last Updated</span>
                                            <span>{assessment.updated_at ? new Date(assessment.updated_at).toLocaleDateString() : 'Not Set'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Created By</span>
                                            <span>{assessment.user.name}</span>
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