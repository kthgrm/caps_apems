import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Project, type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarDays, Users, Building, Target, FileText, ExternalLink, Download, MapPin, Mail, Phone, User, CheckCircle, XCircle, CircleX, CircleCheck, CircleDot, Image, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import InputError from "@/components/input-error";

interface ProjectEditProps {
    project: Project;
    flash?: { message?: string };
}

export default function ProjectEdit() {
    const { project, flash } = usePage().props as unknown as ProjectEditProps;

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
            title: 'Edit Project',
            href: `/admin/technology-transfer/${project.campus_college?.campus?.id}/${project.campus_college?.college?.id}/projects/${project.id}/edit`,
        },
    ];

    // Form handling with all project fields
    const { data, setData, post, processing, errors, transform } = useForm({
        name: project.name || '',
        description: project.description || '',
        category: project.category || 'private',
        purpose: project.purpose || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        budget: project.budget?.toString() || '',
        funding_source: project.funding_source || '',
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
        attachment: null as File | null,
        attachment_link: project.attachment_link || '',
        remarks: project.remarks || '',
        _method: 'PUT'
    });

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    // Transform data before sending
    transform((data) => ({
        ...data,
        budget: data.budget ? parseFloat(data.budget) : null,
        reporting_frequency: data.reporting_frequency ? parseInt(data.reporting_frequency) : null,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/technology-transfer/projects/${project.id}`, {
            onSuccess: () => {
                toast.success('Project updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update project. Please check the form and try again.');
            }
        });
    };

    const asset = (path: string) => {
        return `/storage/${path}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project" />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className='text-2xl font-bold flex items-center gap-2'>
                                Edit Project
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Updating...' : 'Update Project'}
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
                                            <Label className="text-sm font-light" htmlFor="name">Project Name *</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter project name"
                                            />
                                            {errors.name && <InputError message={errors.name} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="category">Category *</Label>
                                            <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="private">Private</SelectItem>
                                                    <SelectItem value="government">Government</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.category && <InputError message={errors.category} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="leader">Project Leader *</Label>
                                            <Input
                                                id="leader"
                                                value={data.leader}
                                                onChange={(e) => setData('leader', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter project leader name"
                                            />
                                            {errors.leader && <InputError message={errors.leader} className="mt-1" />}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Provide a detailed description of the project"
                                        />
                                        {errors.description && <InputError message={errors.description} className="mt-1" />}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="purpose">Purpose *</Label>
                                        <Textarea
                                            id="purpose"
                                            value={data.purpose}
                                            onChange={(e) => setData('purpose', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Explain the purpose and objectives of the project"
                                        />
                                        {errors.purpose && <InputError message={errors.purpose} className="mt-1" />}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="deliverables">Deliverables *</Label>
                                        <Textarea
                                            id="deliverables"
                                            value={data.deliverables}
                                            onChange={(e) => setData('deliverables', e.target.value)}
                                            className="mt-1 min-h-[80px]"
                                            placeholder="List the expected deliverables and outcomes"
                                        />
                                        {errors.deliverables && <InputError message={errors.deliverables} className="mt-1" />}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="tags">Tags *</Label>
                                        <Input
                                            id="tags"
                                            value={data.tags}
                                            onChange={(e) => setData('tags', e.target.value)}
                                            className="mt-1"
                                            placeholder="Enter tags separated by commas (e.g., research, technology, innovation)"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Separate multiple tags with commas
                                        </p>
                                        {errors.tags && <InputError message={errors.tags} className="mt-1" />}
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
                                            <Label className="text-sm font-light" htmlFor="agency_partner">Agency Partner *</Label>
                                            <Input
                                                id="agency_partner"
                                                value={data.agency_partner}
                                                onChange={(e) => setData('agency_partner', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter agency partner name"
                                            />
                                            {errors.agency_partner && <InputError message={errors.agency_partner} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="contact_person">Contact Person *</Label>
                                            <Input
                                                id="contact_person"
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter contact person name"
                                            />
                                            {errors.contact_person && <InputError message={errors.contact_person} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light flex items-center gap-1" htmlFor="contact_email">
                                                <Mail className="h-4 w-4" />
                                                Email *
                                            </Label>
                                            <Input
                                                id="contact_email"
                                                type="email"
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter contact email"
                                            />
                                            {errors.contact_email && <InputError message={errors.contact_email} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light flex items-center gap-1" htmlFor="contact_phone">
                                                <Phone className="h-4 w-4" />
                                                Phone *
                                            </Label>
                                            <Input
                                                id="contact_phone"
                                                type="tel"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter contact phone number"
                                            />
                                            {errors.contact_phone && <InputError message={errors.contact_phone} className="mt-1" />}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light flex items-center gap-1" htmlFor="contact_address">
                                            <MapPin className="h-4 w-4" />
                                            Address
                                        </Label>
                                        <Textarea
                                            id="contact_address"
                                            value={data.contact_address}
                                            onChange={(e) => setData('contact_address', e.target.value)}
                                            className="mt-1 min-h-[80px]"
                                            placeholder="Enter full address"
                                        />
                                        {errors.contact_address && <InputError message={errors.contact_address} className="mt-1" />}
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
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="is_assessment_based"
                                                checked={data.is_assessment_based}
                                                onCheckedChange={(checked) => setData('is_assessment_based', checked)}
                                            />
                                            <Label htmlFor="is_assessment_based" className="text-sm font-light">
                                                Assessment Based Project
                                            </Label>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="reporting_frequency">Reporting Frequency (times per year)</Label>
                                            <Input
                                                id="reporting_frequency"
                                                type="number"
                                                min="0"
                                                max="12"
                                                value={data.reporting_frequency}
                                                onChange={(e) => setData('reporting_frequency', e.target.value)}
                                                className="mt-1"
                                                placeholder="0"
                                            />
                                            {errors.reporting_frequency && <InputError message={errors.reporting_frequency} className="mt-1" />}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="monitoring_evaluation_plan">Monitoring & Evaluation Plan</Label>
                                        <Textarea
                                            id="monitoring_evaluation_plan"
                                            value={data.monitoring_evaluation_plan}
                                            onChange={(e) => setData('monitoring_evaluation_plan', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Describe the monitoring and evaluation plan"
                                        />
                                        {errors.monitoring_evaluation_plan && <InputError message={errors.monitoring_evaluation_plan} className="mt-1" />}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="sustainability_plan">Sustainability Plan</Label>
                                        <Textarea
                                            id="sustainability_plan"
                                            value={data.sustainability_plan}
                                            onChange={(e) => setData('sustainability_plan', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Describe the sustainability plan"
                                        />
                                        {errors.sustainability_plan && <InputError message={errors.sustainability_plan} className="mt-1" />}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Remarks */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Remarks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="remarks">Remarks</Label>
                                        <Textarea
                                            id="remarks"
                                            value={data.remarks}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Any additional remarks or notes"
                                        />
                                        {errors.remarks && <InputError message={errors.remarks} className="mt-1" />}
                                    </div>
                                </CardContent>
                            </Card>
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
                                            <Label className="text-sm font-light" htmlFor="start_date">Start Date *</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.start_date && <InputError message={errors.start_date} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="end_date">End Date *</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.end_date && <InputError message={errors.end_date} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="budget">Budget *</Label>
                                            <Input
                                                id="budget"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.budget}
                                                onChange={(e) => setData('budget', e.target.value)}
                                                className="mt-1"
                                                placeholder="0.00"
                                            />
                                            {errors.budget && <InputError message={errors.budget} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="funding_source">Funding Source *</Label>
                                            <Input
                                                id="funding_source"
                                                value={data.funding_source}
                                                onChange={(e) => setData('funding_source', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter funding source"
                                            />
                                            {errors.funding_source && <InputError message={errors.funding_source} className="mt-1" />}
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
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="attachment">Upload Attachment</Label>
                                        <Input
                                            id="attachment"
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Supported formats: Images, PDF, DOC, DOCX (Max 10MB)
                                        </p>
                                        {errors.attachment && <InputError message={errors.attachment} className="mt-1" />}
                                    </div>

                                    {/* Current attachment display */}
                                    {project.attachment_path && (
                                        <div className="mt-3">
                                            <Label className="text-sm font-medium">Current Attachment</Label>
                                            <div className="mt-1 p-2 border rounded-md">
                                                <Dialog>
                                                    <DialogTrigger className='flex items-center gap-2 text-blue-500 hover:underline w-full'>
                                                        <Image className="h-4 w-4" />
                                                        <p className="text-sm">View Current Attachment</p>
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
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label className="text-sm font-light" htmlFor="attachment_link">Attachment Link</Label>
                                        <Input
                                            id="attachment_link"
                                            type="url"
                                            value={data.attachment_link}
                                            onChange={(e) => setData('attachment_link', e.target.value)}
                                            className="mt-1"
                                            placeholder="https://example.com/document"
                                        />
                                        {errors.attachment_link && <InputError message={errors.attachment_link} className="mt-1" />}
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
                                        <Label className="text-sm font-light" htmlFor="copyright">Copyright Status</Label>
                                        <Select value={data.copyright} onValueChange={(value) => setData('copyright', value as 'yes' | 'no' | 'pending')}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select copyright status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.copyright && <InputError message={errors.copyright} className="mt-1" />}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="ip_details">IP Details</Label>
                                        <Textarea
                                            id="ip_details"
                                            value={data.ip_details}
                                            onChange={(e) => setData('ip_details', e.target.value)}
                                            className="mt-1 min-h-[100px]"
                                            placeholder="Provide details about intellectual property"
                                        />
                                        {errors.ip_details && <InputError message={errors.ip_details} className="mt-1" />}
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
            </form>
        </AppLayout>
    );
}
