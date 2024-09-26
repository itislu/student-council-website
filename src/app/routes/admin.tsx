import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLocation } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from '~/components/ui/breadcrumb';
import { requireAdmin } from '~/utils/session.server';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
    return [{ title: 'Admin' }, { name: 'description', content: 'Admin Page' }];
};

export async function loader({ request }: LoaderFunctionArgs) {
    await requireAdmin(request);

    return null;
}

export default function Admin() {
    const [electionsTabVisible, setElectionsTabVisible] = useState(false);

    const toggleElectionsTabVisibility = async () => {
        setElectionsTabVisible(!electionsTabVisible);
        await db.settings.update({
            where: { key: 'electionsTabVisible' },
            data: { value: !electionsTabVisible },
        });
    };

    return (
        <div>
            <AdminCrumb />
            <div className='m-4'>
                <Button onClick={toggleElectionsTabVisibility}>
                    {electionsTabVisible ? 'Hide Elections Tab' : 'Show Elections Tab'}
                </Button>
            </div>
            <Outlet />
        </div>
    );
}

function AdminCrumb() {
    const location = useLocation();
    const pathname = location.pathname.split('/');

    const breadcrumbs = pathname.reduce(
        (acc, item, index) => {
            if (!item.length) return acc;

            const href = `/${pathname.slice(1, index + 1).join('/')}`;
            const label = item.charAt(0).toUpperCase() + item.slice(1);

            acc.push({ label, href });
            return acc;
        },
        [] as { label: string; href: string }[],
    );

    breadcrumbs.unshift({ label: 'Home', href: '/' });

    return (
        <Breadcrumb className='bg-white rounded-lg shadow m-4 p-2'>
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href}>
                        <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                            )}
                            {/* <BreadcrumbSeparator /> idk that one causes errors, so for now using this instead */}
                            {index < breadcrumbs.length - 1 && (
                                <span role='presentation' aria-hidden='true' className='[&>svg]:size-3.5'>
                                    <ChevronRight />
                                </span>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
