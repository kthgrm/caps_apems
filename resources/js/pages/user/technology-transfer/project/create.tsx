import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle, Calendar, FileText, Users, Target, Folder } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, Project, User } from '@/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Technology Transfer',
        href: '/user/technology-transfer',
    },
    {
        title: 'Projects',
        href: '/user/technology-transfer/projects',
    },
    {
        title: 'Create Project',
        href: '/user/technology-transfer/projects/create-new',
    },
];

type ProjectForm = {
    name: string;
    description: string;
    category: 'private' | 'government';
    purpose: string;
    tags: string;
    leader: string;
    deliverables?: string;

    start_date: string;
    end_date: string;
    budget: string;
    funding_source: string;

    agency_partner: string;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;

    copyright: 'yes' | 'no' | 'pending';
    ip_details?: string;

    is_assessment_based: boolean;
    monitoring_evaluation_plan: string;
    sustainability_plan: string;
    reporting_frequency: string;

    attachment: File | null;
    attachment_link: string;

    remarks: string;

    created_at: string;
    updated_at: string;
};

type PageProp = {
    user: User;
};

export default function CreateProjectNew() {
    const { user } = usePage<PageProp>().props;

    const [activeTab, setActiveTab] = useState('project-details');

    const { data, setData, post, processing, errors, reset } = useForm<ProjectForm>({
        name: '',

        description: '',
        category: 'private',
        purpose: '',
        start_date: '',
        end_date: '',
        budget: '',
        funding_source: '',
        tags: '',
        leader: '',
        deliverables: '',

        agency_partner: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',

        copyright: 'no',
        ip_details: '',

        is_assessment_based: false,
        monitoring_evaluation_plan: '',
        sustainability_plan: '',
        reporting_frequency: '',

        attachment: null,
        attachment_link: '',

        remarks: '',

        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user.technology-transfer.store'), {
            onSuccess: () => {
                toast.success('Project created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Technology Transfer" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Create New Project</h1>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Header Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="college" className="text-base font-medium">
                                College
                            </Label>
                            <Input
                                id="college"
                                value={`${user.campus_college.campus.name} - ${user.campus_college.college.code}`}
                                className="h-10 bg-muted"
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="created_at" className="text-base font-medium">
                                Created At
                            </Label>
                            <Input
                                id="created_at"
                                type="date"
                                value={data.created_at}
                                className="h-10 bg-muted"
                                readOnly
                            />
                            <InputError message={errors.created_at} />
                        </div>
                    </div>

                    {/* Tabbed Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <ScrollArea className='white-space-nowrap py-2 lg:py-0'>
                            <TabsList className='flex w-full'>
                                <TabsTrigger value="project-details" className="text-sm">
                                    Project Details
                                </TabsTrigger>
                                <TabsTrigger value="timeline-budgeting" className="text-sm">
                                    Timeline and Budgeting
                                </TabsTrigger>
                                <TabsTrigger value="partner-information" className="text-sm">
                                    Partner Information
                                </TabsTrigger>
                                <TabsTrigger value="ip-status" className="text-sm">
                                    Intellectual Property & Status
                                </TabsTrigger>
                                <TabsTrigger value="assessment-reporting" className="text-sm">
                                    Assessment & Reporting
                                </TabsTrigger>
                                <TabsTrigger value="attachments" className="text-sm">
                                    Attachments
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>


                        {/* Project Details Tab */}
                        <TabsContent value="project-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Folder className="h-5 w-5" />
                                        Project Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="project_name" className="text-base font-medium">
                                                Project Name
                                            </Label>
                                            <Input
                                                id="project_name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter project name"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={3}
                                                placeholder="Brief description of the project"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.description} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end_date">Category</Label>
                                            <Select
                                                onValueChange={(e) => setData('category', e as 'private' | 'government')}
                                                defaultValue={data.category}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="private">Private</SelectItem>
                                                    <SelectItem value="government">Government</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="leader">Project Leader</Label>
                                            <Input
                                                id="leader"
                                                type="text"
                                                value={data.leader}
                                                onChange={(e) => setData('leader', e.target.value)}
                                                placeholder="Enter project leader"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.leader} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="purpose">Purpose</Label>
                                            <Textarea
                                                id="purpose"
                                                value={data.purpose}
                                                onChange={(e) => setData('purpose', e.target.value)}
                                                placeholder="Enter project purpose"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.purpose} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tags">Keywords/Tags</Label>
                                            <Input
                                                id="tags"
                                                type="text"
                                                value={data.tags}
                                                onChange={(e) => setData('tags', e.target.value)}
                                                placeholder="Enter keywords or tags (e.g., AI, Research)"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.tags} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="deliverables">Deliverables</Label>
                                            <Input
                                                id="deliverables"
                                                type="text"
                                                value={data.deliverables}
                                                onChange={(e) => setData('deliverables', e.target.value)}
                                                placeholder="Enter deliverables"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.deliverables} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Timeline and Budgeting Tab */}
                        <TabsContent value="timeline-budgeting" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Timeline and Budgeting
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date">Start Date</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.start_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end_date">End Date</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.end_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="budget">Budget</Label>
                                            <Input
                                                id="budget"
                                                type="number"
                                                value={data.budget}
                                                onChange={(e) => setData('budget', e.target.value)}
                                                placeholder="Enter budget"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.budget} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="funding_source">Funding Source</Label>
                                            <Input
                                                id="funding_source"
                                                type="text"
                                                value={data.funding_source}
                                                onChange={(e) => setData('funding_source', e.target.value)}
                                                placeholder="Enter funding source"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.funding_source} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Partner Information Tab */}
                        <TabsContent value="partner-information" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Partner Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="agency_partner" className="text-base font-medium">
                                                Agency Partner
                                            </Label>
                                            <Input
                                                id="agency_partner"
                                                value={data.agency_partner}
                                                onChange={(e) => setData('agency_partner', e.target.value)}
                                                placeholder="Enter agency partner"
                                                className="h-10"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.agency_partner} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_person">Contact Person</Label>
                                            <Input
                                                id="contact_person"
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                placeholder="Enter contact person"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.contact_person} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_email">Email</Label>
                                            <Input
                                                id="contact_email"
                                                type="email"
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                placeholder="Enter contact email"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.contact_email} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_phone">Phone</Label>
                                            <Input
                                                id="contact_phone"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                                placeholder="Enter contact phone"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.contact_phone} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="contact_address">Address</Label>
                                            <Input
                                                id="contact_address"
                                                value={data.contact_address}
                                                onChange={(e) => setData('contact_address', e.target.value)}
                                                placeholder="Enter contact address"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.contact_address} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* IP & Status Tab */}
                        <TabsContent value="ip-status" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Intellectual Property & Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="copyright">Copyright</Label>
                                            <Select
                                                onValueChange={(e) => setData('copyright', e as 'yes' | 'no' | 'pending')}
                                                defaultValue={data.copyright}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select copyright status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="yes">Yes</SelectItem>
                                                    <SelectItem value="no">No</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.copyright} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="ip_details">IP Details</Label>
                                            <Textarea
                                                id="ip_details"
                                                value={data.ip_details}
                                                onChange={(e) => setData('ip_details', e.target.value)}
                                                placeholder="Enter intellectual property details"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.ip_details} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Assessment & Reporting Tab */}
                        <TabsContent value="assessment-reporting" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Assessment & Reporting
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="is_assessment_based">Assessment Based</Label>
                                            <Select
                                                onValueChange={(e) => setData('is_assessment_based', e === 'yes')}
                                                defaultValue={data.is_assessment_based ? 'yes' : 'no'}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Is this assessment based?" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="yes">Yes</SelectItem>
                                                    <SelectItem value="no">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.is_assessment_based} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reporting_frequency">Reporting Frequency</Label>
                                            <Input
                                                id="reporting_frequency"
                                                type="number"
                                                placeholder="Enter reporting frequency"
                                                value={data.reporting_frequency}
                                                onChange={(e) => setData('reporting_frequency', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.reporting_frequency} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="monitoring_evaluation_plan">Monitoring and Evaluation Plan</Label>
                                            <Textarea
                                                id="monitoring_evaluation_plan"
                                                value={data.monitoring_evaluation_plan}
                                                onChange={(e) => setData('monitoring_evaluation_plan', e.target.value)}
                                                placeholder="Enter monitoring and evaluation plan"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.monitoring_evaluation_plan} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="sustainability_plan">Sustainability Plan</Label>
                                            <Textarea
                                                id="sustainability_plan"
                                                value={data.sustainability_plan}
                                                onChange={(e) => setData('sustainability_plan', e.target.value)}
                                                placeholder="Enter sustainability plan"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.sustainability_plan} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Attachments Tab */}
                        <TabsContent value="attachments" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="attachment">Upload File</Label>
                                            <Input
                                                id="attachment"
                                                type="file"
                                                placeholder="Upload your files"
                                                accept=".jpg,.jpeg,.png"
                                                multiple={false}
                                                onChange={(e) => {
                                                    setData('attachment', e.target.files && e.target.files[0] ? e.target.files[0] : null);
                                                }}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.attachment} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="attachment_link">Upload Link</Label>
                                            <Input
                                                id="attachment_link"
                                                type="url"
                                                placeholder="Enter your file link"
                                                value={data.attachment_link}
                                                onChange={(e) => {
                                                    setData('attachment_link', e.target.value);
                                                }}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.attachment_link} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Footer Section */}
                    <div className="mt-6 space-y-2">
                        <Label htmlFor="remarks" className="text-base font-medium">
                            Remarks
                        </Label>
                        <Textarea
                            id="remarks"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis eros, rhoncus non ex vitae, euismod iaculis est. Curabitur in."
                            rows={4}
                            disabled={processing}
                        />
                        <InputError message={errors.remarks} />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-2 rounded-md"
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Submit form
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
