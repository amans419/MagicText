import { Github } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface HeaderProps {
    description?: string;
    className?: string;
}

export function Header({
    description = "100% Open Source Project on GitHub",
    className,
}: HeaderProps) {
    return (
        <div
            className={cn(
                "relative w-full bg-primary/5 px-3 py-2.5",
                "flex flex-col md:flex-row items-center justify-center gap-2",
                "text-sm text-muted-foreground",
                className
            )}
        >
            <div className="flex items-center gap-2">
                <Github className="size-4" />
                <span>{description}</span>
            </div>
            <Link
                href="https://github.com/yourusername/MagicText"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
            >
                Star on GitHub
            </Link>
        </div>
    );
}