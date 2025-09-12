import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            {/* Connection lines */}
            <line x1="18" y1="5" x2="6" y2="13" stroke="currentColor" strokeWidth="2" />
            <line x1="6" y1="13" x2="17" y2="18" stroke="currentColor" strokeWidth="2" />

            {/* Network nodes */}
            <circle cx="18" cy="5" r="3.5" fill="currentColor" />
            <circle cx="6" cy="13" r="3.5" fill="currentColor" />
            <circle cx="17" cy="18" r="4" fill="currentColor" />

            {/* Inner circles for hollow effect */}
            <circle cx="18" cy="5" r="2" fill="black" />
            <circle cx="6" cy="13" r="2" fill="black" />
            <circle cx="17" cy="18" r="2" fill="black" />
        </svg>
    );
}
