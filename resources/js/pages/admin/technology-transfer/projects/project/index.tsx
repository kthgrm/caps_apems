import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Project, type BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Users, Building, Target, FileText, ExternalLink, Download, MapPin, Mail, Phone, User, CheckCircle, XCircle, CircleX, CircleCheck, CircleDot, Image, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import InputError from "@/components/input-error";

export default function TechnologyTransfer() {
    const { project, flash } = usePage().props as unknown as {
        project: Project;
        flash?: { message?: string }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Technology Transfer',
            href: '/admin/technology-transfer',
        },
        {
            title: 'Campus',
            href: '/admin/technology-transfer',
        },
        {
            title: 'College',
            href: `/admin/technology-transfer/${project.campus_college?.campus?.id}`,
        },
        {
            title: 'Projects',
            href: `/admin/technology-transfer/${project.campus_college?.campus?.id}/${project.campus_college?.college?.id}/projects`,
        },
        {
            title: 'Details',
            href: `/admin/technology-transfer/${project.campus_college?.campus?.id}/${project.campus_college?.college?.id}/projects/${project.id}`,
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

        router.patch(`/admin/technology-transfer/projects/${project.id}/archive`, {
            password: password
        }, {
            onSuccess: () => {
                setIsArchiveDialogOpen(false);
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
                toast.success('Project archived successfully.');
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
            <Head title="Project Details" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-bold'>Project Details</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(`/admin/technology-transfer/projects/${project.id}/edit`)}
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Project
                        </Button>
                        <Button
                            variant="destructive"
                            className="justify-start bg-red-800 hover:bg-red-900"
                            onClick={() => setIsArchiveDialogOpen(true)}
                        >
                            Delete Project
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Project Information */}
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
                                        <Label className="text-sm font-light">Project ID</Label>
                                        <Input value={project.id} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Project Name</Label>
                                        <Input value={project.name} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Category</Label>
                                        <Input value={project.category || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Leader</Label>
                                        <Input value={project.leader || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Description</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {project.description || 'No description provided'}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Purpose</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {project.purpose || 'No purpose provided'}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Deliverables</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {project.deliverables || 'No deliverables provided'}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Tags</Label>
                                    {project.tags && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {project.tags.split(',').map((tag, index) => (
                                                <Badge key={index} variant="outline">
                                                    {tag.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {!project.tags && (
                                        <div className="mt-1 text-sm text-muted-foreground">No tags specified</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partner Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Partner Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Agency Partner</Label>
                                        <Input value={project.agency_partner || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Contact Person</Label>
                                        <Input value={project.contact_person || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </Label>
                                        <Input value={project.contact_email || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            Phone
                                        </Label>
                                        <Input value={project.contact_phone || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        Address
                                    </Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {project.contact_address || 'No address provided'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assessment & Reporting */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Assessment & Reporting
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Assessment Based</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            {project.is_assessment_based === true ? (
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <CircleCheck className="w-4 text-green-500" />
                                                    Yes
                                                </Badge>

                                            ) : (
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <CircleX className="w-4 text-red-500" />
                                                    No
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Reporting Frequency</Label>
                                        <Input
                                            value={project.reporting_frequency ? `${project.reporting_frequency} times` : 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Monitoring & Evaluation Plan</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {project.monitoring_evaluation_plan || 'No plan provided'}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">Sustainability Plan</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {project.sustainability_plan || 'No plan provided'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Remarks */}
                        {project.remarks && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Remarks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-3 bg-muted rounded-md text-sm">
                                        {project.remarks}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Institution Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Department
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Campus</Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        {project.campus_college?.campus?.logo && (
                                            <img
                                                src={asset(project.campus_college.campus.logo)}
                                                alt="Campus logo"
                                                className="h-6 w-6 rounded"
                                            />
                                        )}
                                        <span className="text-sm">{project.campus_college?.campus?.name}</span>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="text-sm font-medium">College</Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        {project.campus_college?.college?.logo && (
                                            <img
                                                src={asset(project.campus_college.college.logo)}
                                                alt="College logo"
                                                className="h-6 w-6 rounded"
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{project.campus_college?.college?.name}</span>
                                            <span className="text-xs text-muted-foreground">{project.campus_college?.college?.code}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline and Budget */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5" />
                                    Timeline & Budget
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Start Date</Label>
                                        <Input
                                            value={project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">End Date</Label>
                                        <Input
                                            value={project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Budget</Label>
                                        <Input
                                            value={project.budget ? `₱${Number(project.budget).toLocaleString()}` : 'Not specified'}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Funding Source</Label>
                                        <Input value={project.funding_source || 'Not specified'} readOnly className="mt-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Intellectual Property */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Intellectual Property
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Copyright</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            {project.copyright === 'yes' ? (
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <CheckCircle className="w-4 text-green-500" />
                                                    Yes
                                                </Badge>
                                            ) : project.copyright === 'pending' ? (
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <CircleDot className="w-4 text-yellow-500" />
                                                    Pending
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <CircleX className="w-4 text-red-500" />
                                                    No
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-light">IP Details</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {project.ip_details ? project.ip_details : 'No details provided'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attachments */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Attachments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center p-3 border rounded-lg">
                                    {project.attachment_path ? (
                                        <Dialog>
                                            <DialogTrigger className='flex items-center gap-2 text-blue-500 hover:underline w-full'>
                                                <Image className="h-4 w-4" />
                                                <p className="text-sm">Project Attachment</p>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Project Attachment</DialogTitle>
                                                    <DialogDescription>
                                                        <img src={asset(project.attachment_path)} alt="Project Attachment" className="w-full h-auto" />
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="text-sm gap-2 flex items-center">
                                            <Image className="h-4 w-4" />
                                            No Attachment
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4" />
                                            {project.attachment_link ? (
                                                <a
                                                    href={project.attachment_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-sm flex items-center gap-1 truncate"
                                                >
                                                    {project.attachment_link}
                                                </a>
                                            ) : (
                                                <span className="text-sm">No Attachment Link</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Record Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Record Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Created</span>
                                        <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Last Updated</span>
                                        <span>{project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Created By</span>
                                        <span>{project.user.name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Archive Confirmation Dialog */}
            <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            To permanently delete this project, please enter your password to confirm this action.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isLoading) {
                                        handleArchive();
                                    }
                                }}
                            />
                            {errorMessage && (
                                <InputError message={errorMessage} className="mt-2" />
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetArchiveDialog} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleArchive} disabled={isLoading} className="bg-red-700 hover:bg-red-800">
                            {isLoading ? 'Deleting...' : 'Delete Project'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
