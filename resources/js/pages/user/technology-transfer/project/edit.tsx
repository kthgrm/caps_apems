import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Project, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import {
    FileText,
    Users,
    Target,
    Image,
    CircleX,
    CalendarDays,
    CircleCheck,
    Download
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { asset } from '@/lib/utils';

type ProjectEditProps = {
    project: Project;
    flash?: { message: string; }
}

export default function ProjectEdit() {
    const { project, flash } = usePage<ProjectEditProps>().props;

    const { data, setData, put, processing, errors, transform } = useForm({
        name: project.name || '',
        description: project.description || '',
        category: project.category || '',
        purpose: project.purpose || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        tags: project.tags || '',
        leader: project.leader || '',
        deliverables: project.deliverables || '',
        agency_partner: project.agency_partner || '',
        contact_person: project.contact_person || '',
        contact_email: project.contact_email || '',
        contact_phone: project.contact_phone || '',
        contact_address: project.contact_address || '',
        copyright: project.copyright || 'no',
        ip_details: project.ip_details || '',
        is_assessment_based: project.is_assessment_based || false,
        monitoring_evaluation_plan: project.monitoring_evaluation_plan || '',
        sustainability_plan: project.sustainability_plan || '',
        reporting_frequency: project.reporting_frequency?.toString() || '',
        attachment_link: project.attachment_link || '',
        remarks: project.remarks || '',
        attachment: null as File | null
    });

    // Transform data before submission
    transform((data) => ({
        ...data,
        is_assessment_based: Boolean(data.is_assessment_based),
        reporting_frequency: parseInt(data.reporting_frequency) || 0,
    }));

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
            href: `/user/technology-transfer/project/${project.id}`,
        },
        {
            title: 'Edit',
            href: `/user/technology-transfer/project/${project.id}/edit`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/user/technology-transfer/project/${project.id}`);
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Project: ${project.name}`} />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-medium">Edit Project</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="default">Save Changes</Button>
                            <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
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
                                            <Input value={project.id} readOnly className="mt-1 bg-muted" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor='name'>Project Name</Label>
                                            <Input
                                                id='name'
                                                value={data.name}
                                                className="mt-1"
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light">Category</Label>
                                            <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="private">Private</SelectItem>
                                                    <SelectItem value="government">Government</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor='leader'>Leader</Label>
                                            <Input
                                                id='leader'
                                                value={data.leader}
                                                className="mt-1"
                                                onChange={(e) => setData('leader', e.target.value)}
                                            />
                                            {errors.leader && <p className="text-red-500 text-sm mt-1">{errors.leader}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='description'>Description</Label>
                                        <Textarea
                                            id='description'
                                            value={data.description}
                                            className="mt-1"
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='purpose'>Purpose</Label>
                                        <Textarea
                                            id='purpose'
                                            value={data.purpose}
                                            className="mt-1"
                                            onChange={(e) => setData('purpose', e.target.value)}
                                        />
                                        {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='deliverables'>Deliverables</Label>
                                        <Input
                                            id='deliverables'
                                            value={data.deliverables}
                                            className="mt-1"
                                            onChange={(e) => setData('deliverables', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='tags'>Tags</Label>
                                        <Input
                                            id='tags'
                                            type='text'
                                            value={data.tags}
                                            className="mt-1"
                                            onChange={(e) => setData('tags', e.target.value)}
                                            placeholder="Comma-separated tags (e.g., research, development)"
                                        />
                                        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                                        {data.tags && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {data.tags.split(',').map((tag, index) => (
                                                    <Badge key={index} variant="outline">
                                                        {tag.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
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
                                            <Label className="text-sm font-light" htmlFor='agency_partner'>Agency Partner</Label>
                                            <Input
                                                id='agency_partner'
                                                value={data.agency_partner}
                                                className="mt-1"
                                                onChange={(e) => setData('agency_partner', e.target.value)}
                                            />
                                            {errors.agency_partner && <p className="text-red-500 text-sm mt-1">{errors.agency_partner}</p>}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor='contact_person'>Contact Person</Label>
                                            <Input
                                                id='contact_person'
                                                value={data.contact_person}
                                                className="mt-1"
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                            />
                                            {errors.contact_person && <p className="text-red-500 text-sm mt-1">{errors.contact_person}</p>}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor='contact_email'>Email</Label>
                                            <Input
                                                id='contact_email'
                                                value={data.contact_email}
                                                type='email'
                                                className="mt-1"
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                            />
                                            {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor='contact_phone'>Phone</Label>
                                            <Input
                                                id='contact_phone'
                                                value={data.contact_phone}
                                                className="mt-1"
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                            />
                                            {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='contact_address'>Address</Label>
                                        <Input
                                            id='contact_address'
                                            value={data.contact_address}
                                            className="mt-1"
                                            onChange={(e) => setData('contact_address', e.target.value)}
                                        />
                                        {errors.contact_address && <p className="text-red-500 text-sm mt-1">{errors.contact_address}</p>}
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
                                                <Switch
                                                    checked={data.is_assessment_based}
                                                    onCheckedChange={(value) => setData('is_assessment_based', value)}
                                                />
                                                {data.is_assessment_based ? (
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
                                            <Label className="text-sm font-light" htmlFor='reporting_frequency'>Reporting Frequency</Label>
                                            <Input
                                                id='reporting_frequency'
                                                value={data.reporting_frequency}
                                                type='number'
                                                className="mt-1"
                                                onChange={(e) => setData('reporting_frequency', e.target.value)}
                                            />
                                            {errors.reporting_frequency && <p className="text-red-500 text-sm mt-1">{errors.reporting_frequency}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='monitoring_evaluation_plan'>Monitoring & Evaluation Plan</Label>
                                        <Textarea
                                            id='monitoring_evaluation_plan'
                                            value={data.monitoring_evaluation_plan}
                                            className="mt-1"
                                            onChange={(e) => setData('monitoring_evaluation_plan', e.target.value
                                            )}
                                        />
                                        {errors.monitoring_evaluation_plan && <p className="text-red-500 text-sm mt-1">{errors.monitoring_evaluation_plan}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor='sustainability_plan'>Sustainability Plan</Label>
                                        <Textarea
                                            id='sustainability_plan'
                                            value={data.sustainability_plan}
                                            className="mt-1"
                                            onChange={(e) => setData('sustainability_plan', e.target.value
                                            )}
                                        />
                                        {errors.sustainability_plan && <p className="text-red-500 text-sm mt-1">{errors.sustainability_plan}</p>}
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
                                            <Label className="text-sm font-light" htmlFor='start_date'>Start Date</Label>
                                            <Input
                                                id='start_date'
                                                value={data.start_date}
                                                type="date"
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor='end_date'>End Date</Label>
                                            <Input
                                                id='end_date'
                                                value={data.end_date}
                                                type="date"
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
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
                                    <div>
                                        <Label className="text-sm font-light">Copyright</Label>
                                        <Select
                                            value={data.copyright}
                                            onValueChange={(value) => setData('copyright', value as 'yes' | 'no' | 'pending')}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select copyright status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">IP Details</Label>
                                        <Textarea
                                            value={data.ip_details}
                                            className="mt-1"
                                            onChange={(e) => setData('ip_details', e.target.value)}
                                        />
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

                                        {project.attachment_path ? (
                                            <>
                                                <a href={asset(project.attachment_path)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm ">
                                                    <Image className="h-4 w-4" />
                                                    Current Attachment
                                                </a>
                                            </>
                                        ) : (
                                            <p className='text-sm'>No attachment uploaded</p>
                                        )}
                                        <Label className="text-sm font-light mt-2">Update Attachment</Label>
                                        <Input
                                            type="file"
                                            accept=".jpeg, .jpg, .png"
                                            size={1024}
                                            onChange={(e) => {
                                                setData('attachment', e.target.files && e.target.files[0] ? e.target.files[0] : null)
                                            }}
                                        />
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

