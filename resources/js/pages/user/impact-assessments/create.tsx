import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle, Award, FileText, Users, Target, Building, Calendar, AwardIcon, CalendarRange, ScrollText } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem, Project, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Impact Assessment',
        href: '/user/impact-assessments',
    },
    {
        title: 'Create New Impact Assessment',
        href: '/user/impact-assessments/create',
    }
];

type PageProps = {
    projects: Project[];
    user: User;
    flash?: { message?: string };
};

export default function CreateAssessment() {
    const { projects, user, flash } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState('assessment-details');

    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: '',
        beneficiary: '',
        geographic_coverage: '',
        num_direct_beneficiary: 0,
        num_indirect_beneficiary: 0,

        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user.impact-assessments.store'), {
            onSuccess: () => {
                toast.success('Impact Assessment created successfully!');
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Assessment" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Add New Assessment</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="college" className="text-base font-medium">
                                College
                            </Label>
                            <Input
                                id="college"
                                value={`${user.campus_college.campus.name} - ${user.campus_college.college.code}`}
                                readOnly
                                className="h-10 bg-muted"
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
                                readOnly
                                className="h-10 bg-muted"
                            />
                        </div>
                    </div>

                    {/* Tabbed Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="assessment-details" className="text-sm">
                                Assessment Details
                            </TabsTrigger>
                        </TabsList>

                        {/* Assessment Details Tab */}
                        <TabsContent value="assessment-details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ScrollText className="h-5 w-5" />
                                        Assessment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="beneficiary">
                                                Beneficiary
                                            </Label>
                                            <Input
                                                id="beneficiary"
                                                value={data.beneficiary}
                                                onChange={(e) => setData('beneficiary', e.target.value)}
                                                placeholder="Enter beneficiary type (e.g., farmers, SMEs, local government, schools)"
                                                className="h-10"
                                                required
                                                disabled={processing}
                                            />
                                            <InputError message={errors.beneficiary} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="geographic_coverage">Geographic Coverage</Label>
                                            <Input
                                                id="geographic_coverage"
                                                value={data.geographic_coverage}
                                                onChange={(e) => setData('geographic_coverage', e.target.value)}
                                                placeholder="Enter geographic coverage"
                                                className="h-10"
                                                required
                                                disabled={processing}
                                            />
                                            <InputError message={errors.geographic_coverage} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="num_direct_beneficiary">Direct Beneficiary</Label>
                                            <Input
                                                id="num_direct_beneficiary"
                                                value={data.num_direct_beneficiary}
                                                type='number'
                                                onChange={(e) => setData('num_direct_beneficiary', parseInt(e.target.value))}
                                                placeholder="Enter Organization/Institution"
                                                disabled={processing}
                                                required
                                            />
                                            <InputError message={errors.num_direct_beneficiary} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="num_indirect_beneficiary">Indirect Beneficiary</Label>
                                            <Input
                                                id="num_indirect_beneficiary"
                                                value={data.num_indirect_beneficiary}
                                                type='number'
                                                onChange={(e) => setData('num_indirect_beneficiary', parseInt(e.target.value))}
                                                placeholder="Enter Organization/Institution"
                                                disabled={processing}
                                                required
                                            />
                                            <InputError message={errors.num_indirect_beneficiary} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Project</Label>
                                            <Select
                                                value={data.project_id ? data.project_id : ''}
                                                onValueChange={(value) => {
                                                    setData('project_id', value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {projects.map((project) => (
                                                            <SelectItem
                                                                key={project.id}
                                                                value={project.id.toString()}
                                                            >
                                                                {project.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.project_id && <span className="text-sm text-red-500">Project field is required</span>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

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
