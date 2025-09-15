import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { ImpactAssessment, type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Users, Building, MapPin, TrendingUp, FileText, MapPinned, Paperclip } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import InputError from "@/components/input-error";

type ImpactAssessmentDetailsProps = {
    assessment: ImpactAssessment;
    flash?: { message?: string };
};

export default function ImpactAssessmentDetails() {
    const { assessment: impactAssessment, flash } = usePage<ImpactAssessmentDetailsProps>().props;

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
            href: `/admin/impact-assessment/${impactAssessment.project.campus_college.campus.id}`,
        },
        {
            title: 'Assessments',
            href: `/admin/impact-assessment/${impactAssessment.project.campus_college.campus.id}/${impactAssessment.project.campus_college.college.id}/assessments`,
        },
        {
            title: 'Details',
            href: `/admin/impact-assessment/${impactAssessment.id}/details`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    // Archive functionality state
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleArchive = () => {
        if (!password.trim()) {
            setErrorMessage('Please enter your password to confirm.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        router.patch(`/admin/impact-assessment/${impactAssessment.id}/archive`, {
            password: password
        }, {
            onSuccess: () => {
                setIsArchiveDialogOpen(false);
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
                toast.success('Impact assessment archived successfully.');
                // Redirect back to assessments list
                router.visit(`/admin/impact-assessment/${impactAssessment.project.campus_college.campus.id}/${impactAssessment.project.campus_college.college.id}/assessments`);
            },
            onError: (errors) => {
                setIsLoading(false);
                if (errors.password) {
                    setErrorMessage(errors.password);
                } else if (errors.message) {
                    setErrorMessage(errors.message);
                } else {
                    setErrorMessage('Archive failed. Please try again.');
                }
            }
        });
    };

    const resetArchiveDialog = () => {
        setIsArchiveDialogOpen(false);
        setPassword('');
        setErrorMessage('');
    };

    const asset = (path: string) => {
        return `/storage/${path}`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Impact Assessment Details" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-bold'>Impact Assessment Details</h1>
                    <div>
                        <Button
                            variant="destructive"
                            className="w-full justify-start bg-red-800 hover:bg-red-900"
                            onClick={() => setIsArchiveDialogOpen(true)}
                        >
                            Delete Assessment
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Impact Assessment Information */}
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
                                        <Label className="text-sm font-medium">Assessment ID</Label>
                                        <Input value={impactAssessment.id} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Primary Beneficiary</Label>
                                        <Input value={impactAssessment.beneficiary} readOnly className="mt-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Impact Metrics */}
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
                                        <Label className="text-sm font-medium">Direct Beneficiaries</Label>
                                        <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-green-600" />
                                                <span className="text-lg font-semibold text-green-800">
                                                    {Number(impactAssessment.num_direct_beneficiary).toLocaleString()}
                                                </span>
                                                <span className="text-sm text-green-600">people</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Indirect Beneficiaries</Label>
                                        <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-blue-600" />
                                                <span className="text-lg font-semibold text-blue-800">
                                                    {Number(impactAssessment.num_indirect_beneficiary).toLocaleString()}
                                                </span>
                                                <span className="text-sm text-blue-600">people</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Total Impact</Label>
                                    <div className="mt-1 p-4 bg-purple-50 border border-purple-200 rounded-md">
                                        <div className="flex items-center justify-center gap-2">
                                            <Users className="h-6 w-6 text-purple-600" />
                                            <span className="text-2xl font-bold text-purple-800">
                                                {(Number(impactAssessment.num_direct_beneficiary) + Number(impactAssessment.num_indirect_beneficiary)).toLocaleString()}
                                            </span>
                                            <span className="text-lg text-purple-600">total beneficiaries</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Geographic Coverage */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Geographic Coverage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-2 bg-muted rounded-md">
                                    <div className="flex items-center gap-3 ">
                                        <MapPinned className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {impactAssessment.geographic_coverage}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Project Information */}
                        {impactAssessment.project && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Related Project
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center justify-start gap-2"
                                                onClick={() => window.location.href = `/admin/technology-transfer/projects/${impactAssessment.project.id}`}
                                            >
                                                <Paperclip className="h-5 w-5" />
                                                {impactAssessment.project.name}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Go to project details</p>
                                        </TooltipContent>
                                    </Tooltip>

                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Department */}
                        {impactAssessment.project && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Department
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {impactAssessment.project.campus_college && (
                                        <>
                                            <div>
                                                <Label className="text-sm font-medium">Campus</Label>
                                                <div className="mt-1 flex items-center gap-2">
                                                    {impactAssessment.project.campus_college.campus?.logo && (
                                                        <img
                                                            src={asset(impactAssessment.project.campus_college.campus.logo)}
                                                            alt="Campus logo"
                                                            className="h-6 w-6 rounded"
                                                        />
                                                    )}
                                                    <span className="text-sm">{impactAssessment.project.campus_college.campus?.name}</span>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <Label className="text-sm font-medium">College</Label>
                                                <div className="mt-1 flex items-center gap-2">
                                                    {impactAssessment.project.campus_college.college?.logo && (
                                                        <img
                                                            src={asset(impactAssessment.project.campus_college.college.logo)}
                                                            alt="College logo"
                                                            className="h-6 w-6 rounded"
                                                        />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{impactAssessment.project.campus_college.college?.name}</span>
                                                        <span className="text-xs text-muted-foreground">{impactAssessment.project.campus_college.college?.code}</span>
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
                                        <span>{impactAssessment.created_at ? new Date(impactAssessment.created_at).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Created By</span>
                                        <span>{impactAssessment.user.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Last Updated</span>
                                        <span>{impactAssessment.updated_at ? new Date(impactAssessment.updated_at).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Last Updated By</span>
                                        <span>{impactAssessment.user.name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Archive Confirmation Dialog */}
            <Dialog open={isArchiveDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    resetArchiveDialog();
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            You are about to delete the impact assessment for "{impactAssessment.project?.name || 'Unknown Project'}". This action requires password confirmation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="col-span-3"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleArchive();
                                    }
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <InputError message={errorMessage} className="col-span-4" />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={resetArchiveDialog}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleArchive}
                            disabled={isLoading || !password.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
