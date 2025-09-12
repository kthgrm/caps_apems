import AuthLayoutTemplate from '@/layouts/auth/auth-card-layout';

export default function AuthLayout({ children, title, ...props }: { children: React.ReactNode; title: string; }) {
    return (
        <AuthLayoutTemplate title={title} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
