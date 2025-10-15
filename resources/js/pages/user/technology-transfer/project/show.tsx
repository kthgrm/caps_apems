import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Project, ImpactAssessment, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import {
    Edit,
    FileText,
    Users,
    MapPin,
    Phone,
    Mail,
    Target,
    CheckCircle,
    CalendarDays,
    CircleCheck,
    CircleX,
    CircleDot,
    Download,
    ExternalLink,
    Image,
    Eye,
    File
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { asset } from '@/lib/utils';

type ProjectShowProps = {
    project: Project;
    impactAssessment?: ImpactAssessment[];
    flash?: { message: string; }
}

export default function ProjectShow() {
    const { project, impactAssessment, flash } = usePage<ProjectShowProps>().props;
    const [activeTab, setActiveTab] = useState('overview');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Technology Transfer',
            href: '/user/technology-transfer',
        },
        {
            title: 'Projects',
            href: '/user/technology-transfer',
        },
        {
            title: project.name,
            href: `/user/projects/${project.id}`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Project: ${project.name}`} />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-medium">{project.name}</h1>
                            <p className="text-muted-foreground text-sm">Project ID: {project.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/user/technology-transfer/project/${project.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Project
                            </Link>
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
                                            {project.is_assessment_based ? (
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
                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5" />
                                    Timeline
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
                                <div className="space-y-2">
                                    {project.attachment_paths && project.attachment_paths.length > 0 ? (
                                        project.attachment_paths.map((path, index) => {
                                            const fileName = path.split('/').pop() || `Attachment ${index + 1}`;
                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                                            return (
                                                <div key={index} className="flex items-center p-3 border rounded-lg">
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
                                        })
                                    ) : (
                                        <div className="flex items-center p-3 border rounded-lg">
                                            <div className="text-sm gap-2 flex items-center">
                                                <File className="h-4 w-4" />
                                                No Attachment
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    {project.attachment_link ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="text-sm">External Link</span>
                                            </div>

                                            <a
                                                href={project.attachment_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                                            >
                                                {project.attachment_link}
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-sm gap-2 flex items-center">
                                            <ExternalLink className="h-4 w-4" />
                                            No External Link
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
