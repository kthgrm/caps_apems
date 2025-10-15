import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Download, Image, ExternalLink, Target, CalendarRange, Folder, Paperclip, TrendingUp } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, ImpactAssessment } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type PageProps = {
    assessment: ImpactAssessment;
    flash?: { message?: string };
};

export default function ImpactAssessmentDetails() {
    const { assessment, flash } = usePage<PageProps>().props;

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
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Impact Assessment: ${assessment.project?.name || 'Unknown Project'}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-medium">{assessment.project?.name || 'Unknown Project'}</h1>
                            <p className="text-muted-foreground">Assessment Details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/user/impact-assessments/${assessment.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Assessment
                            </Link>
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
                                    <Target className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Assessment ID</Label>
                                        <Input
                                            value={assessment.id}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Beneficiary</Label>
                                        <Input
                                            value={assessment.beneficiary || 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <Label className="text-sm font-light">Geographic Coverage</Label>
                                        <Input
                                            value={assessment.geographic_coverage || 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Impact Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Direct Beneficiary</Label>
                                        <Input
                                            value={assessment.num_direct_beneficiary || 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Indirect Beneficiary</Label>
                                        <Input
                                            value={assessment.num_indirect_beneficiary || 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Associated Project */}
                        {assessment.project && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Folder className="h-5 w-5" />
                                        Associated Project
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Card>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-lg font-semibold">{assessment.project.name}</h2>
                                                    {assessment.project.is_archived && (
                                                        <Badge variant="destructive" className="ml-2">Deleted</Badge>
                                                    )}
                                                </div>
                                                {assessment.project.is_archived ? (
                                                    <span className="text-gray-400 flex space-x-1 items-center cursor-not-allowed select-none">
                                                        <span className='text-sm'>Project Deleted</span>
                                                        <ExternalLink className="w-4" />
                                                    </span>
                                                ) : (
                                                    <Link href={`/user/technology-transfer/project/${assessment.project.id}`} className="text-blue-600 hover:underline flex space-x-1 items-center">
                                                        <span className='text-sm'>View Project Details</span>
                                                        <ExternalLink className="w-4" />
                                                    </Link>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
