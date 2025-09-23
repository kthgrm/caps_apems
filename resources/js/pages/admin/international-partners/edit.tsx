import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { InternationalPartner, type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Building, MapPin, Calendar, FileText, Download, Target, Image, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import InputError from "@/components/input-error";

interface InternationalPartnerEditProps {
    partnership: InternationalPartner;
    flash?: { message?: string };
}

export default function InternationalPartnerEdit() {
    const { partnership, flash } = usePage().props as unknown as InternationalPartnerEditProps;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'International Partners',
            href: '/admin/international-partners',
        },
        {
            title: 'Campus',
            href: '/admin/international-partners',
        },
        {
            title: 'College',
            href: `/admin/international-partners/${partnership.campus_college?.campus?.id}`,
        },
        {
            title: 'Partnerships',
            href: `/admin/international-partners/${partnership.campus_college?.campus?.id}/${partnership.campus_college?.college?.id}/partnerships`,
        },
        {
            title: 'Edit Partnership',
            href: `/admin/international-partners/partnerships/${partnership.id}/edit`,
        },
    ];

    // Form handling with all international partner fields
    const { data, setData, post, processing, errors } = useForm({
        agency_partner: partnership.agency_partner || '',
        location: partnership.location || '',
        activity_conducted: partnership.activity_conducted || '',
        start_date: partnership.start_date || '',
        end_date: partnership.end_date || '',
        number_of_participants: partnership.number_of_participants || '',
        number_of_committee: partnership.number_of_committee || '',
        narrative: partnership.narrative || '',
        attachment: null as File | null,
        attachment_link: partnership.attachment_link || '',
        _method: 'PUT'
    });

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/international-partners/partnerships/${partnership.id}`, {
            onSuccess: () => {
                toast.success('Partnership updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update partnership. Please check the form and try again.');
            }
        });
    };

    const asset = (path: string) => {
        return `/storage/${path}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Partnership" />
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className='text-2xl font-bold flex items-center gap-2'>
                                Edit Partnership
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Updating...' : 'Update Partnership'}
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
                        {/* Main Partnership Information */}
                        <div className="lg:col-span-2 space-y-6">
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
                                            <Label className="text-sm font-light">Partnership ID</Label>
                                            <Input value={partnership.id} readOnly className="mt-1 bg-muted" />
                                        </div>
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
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-light" htmlFor="location">Location *</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter partnership location"
                                            />
                                            {errors.location && <InputError message={errors.location} className="mt-1" />}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Activity Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-light" htmlFor="activity_conducted">Activity Conducted *</Label>
                                        <Input
                                            id="activity_conducted"
                                            value={data.activity_conducted}
                                            type='text'
                                            onChange={(e) => setData('activity_conducted', e.target.value)}
                                            className="mt-1"
                                            placeholder="Describe the activity conducted"
                                        />
                                        {errors.activity_conducted && <InputError message={errors.activity_conducted} className="mt-1" />}
                                    </div>

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
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="number_of_participants">Number of Participants</Label>
                                            <Input
                                                id="number_of_participants"
                                                type="number"
                                                value={data.number_of_participants}
                                                onChange={(e) => setData('number_of_participants', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter number of participants"
                                                min="0"
                                            />
                                            {errors.number_of_participants && <InputError message={errors.number_of_participants} className="mt-1" />}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-light" htmlFor="number_of_committee">Number of Committee Members</Label>
                                            <Input
                                                id="number_of_committee"
                                                type="number"
                                                value={data.number_of_committee}
                                                onChange={(e) => setData('number_of_committee', e.target.value)}
                                                className="mt-1"
                                                placeholder="Enter number of committee members"
                                                min="0"
                                            />
                                            {errors.number_of_committee && <InputError message={errors.number_of_committee} className="mt-1" />}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-light" htmlFor="narrative">Narrative *</Label>
                                        <Textarea
                                            id="narrative"
                                            value={data.narrative}
                                            onChange={(e) => setData('narrative', e.target.value)}
                                            className="mt-1 min-h-[120px]"
                                            placeholder="Provide a detailed narrative about the partnership"
                                        />
                                        {errors.narrative && <InputError message={errors.narrative} className="mt-1" />}
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
                                            {partnership.campus_college?.campus?.logo && (
                                                <img
                                                    src={asset(partnership.campus_college.campus.logo)}
                                                    alt="Campus logo"
                                                    className="h-6 w-6 rounded"
                                                />
                                            )}
                                            <span className="text-sm">{partnership.campus_college?.campus?.name}</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <Label className="text-sm font-medium">College</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            {partnership.campus_college?.college?.logo && (
                                                <img
                                                    src={asset(partnership.campus_college.college.logo)}
                                                    alt="College logo"
                                                    className="h-6 w-6 rounded"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{partnership.campus_college?.college?.name}</span>
                                                <span className="text-xs text-muted-foreground">{partnership.campus_college?.college?.code}</span>
                                            </div>
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
                                    {partnership.attachment_path && (
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
                                                            <DialogTitle>Partnership Attachment</DialogTitle>
                                                            <DialogDescription>
                                                                <img src={asset(partnership.attachment_path)} alt="Partnership Attachment" className="w-full h-auto" />
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

                            {/* Record Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Record Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Created</span>
                                            <span>{partnership.created_at ? new Date(partnership.created_at).toLocaleDateString() : 'Not set'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Date Last Updated</span>
                                            <span>{partnership.updated_at ? new Date(partnership.updated_at).toLocaleDateString() : 'Not set'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Created By</span>
                                            <span>{partnership.user.name}</span>
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