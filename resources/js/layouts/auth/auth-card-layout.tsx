import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-[#212529]">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Card className="rounded-xl px-10 py-6">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
