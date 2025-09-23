import { Award, LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    isDropdown?: boolean;
    subItems?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    campus_college_id: number;
    campus_college: CampusCollege;
    name: string;
    email: string;
    avatar?: string;
    is_admin: boolean;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Campus {
    id: number;
    name: string;
    logo: string;
    created_at: string;
    updated_at: string;
}

export interface College {
    id: number;
    name: string;
    code: string;
    logo: string;
    campus_id: number;
    created_at: string;
    updated_at: string;
}

export interface CampusCollege {
    id: number;
    campus_id: number;
    college_id: number;
    campus: Campus;
    college: College;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    user: User;
    campus_college: CampusCollege;

    name: string;
    description?: string | null;
    category?: string | null;
    purpose?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    budget?: number | null;
    funding_source?: string | null;
    tags?: string | null;
    leader?: string | null;
    deliverables?: string | null;

    agency_partner?: string | null;
    contact_person?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    contact_address?: string | null;

    copyright: 'yes' | 'no' | 'pending';
    ip_details?: string | null;

    is_assessment_based: boolean;
    monitoring_evaluation_plan?: string | null;
    sustainability_plan?: string | null;
    reporting_frequency?: number | null;

    attachment_path?: string | null;
    attachment_link?: string | null;

    remarks?: string | null;
    is_archived: boolean;

    created_at: string;
    updated_at: string;
}

export interface Award {
    id: number;
    user: User;
    campus_college: CampusCollege;

    award_name: string;
    description: string;
    level: 'local' | 'regional' | 'national' | 'international';
    date_received: string;
    
    event_details: string;
    location: string;
    awarding_body: string;
    people_involved: string;

    attachment_path?: string | null;
    attachment_link?: string | null;
    is_archived: boolean;

    created_at: string;
    updated_at: string;
}

export interface ImpactAssessment {
    id: number;
    user: User;
    project: Project;

    project_id: number;
    beneficiary: string;
    num_direct_beneficiary: number;
    num_indirect_beneficiary: number;
    geographic_coverage: string;
    is_archived: boolean;

    created_at: string;
    updated_at: string;
}

export interface InternationalPartner {
    id: number;
    user: User;
    campus_college: CampusCollege;

    agency_partner: string;
    location: string;
    activity_conducted: string;
    start_date: string;
    end_date: string;
    number_of_participants: number;
    number_of_committee: number;
    narrative: string;

    attachment_path?: string | null;
    attachment_link?: string | null;
    is_archived: boolean;

    created_at: string;
    updated_at: string;
}

export interface Resolution {
    id: number;
    user: User;

    resolution_number: string;
    year_of_effectivity: string;
    expiration: string;
    contact_person: string;
    contact_number_email: string;
    partner_agency_organization: string;

    created_at: string;
    updated_at: string;
}

export interface Modalities {
    id: number;
    user: User;
    project: Project;

    project_id: number;
    modality: string;
    tv_channel?: string | null;
    radio?: string | null;
    online_link?: string | null;
    time_air: string;
    period: string;
    partner_agency: string;
    hosted_by: string;
    is_archived: boolean;

    created_at: string;
    updated_at: string;
}