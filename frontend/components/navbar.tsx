"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-6">
					<Link href="/" className="font-bold text-lg">
						x<span className="text-green-600 dark:text-green-400">4</span>
						<span className="text-green-600 dark:text-green-400 inline-block transform scale-x-[-1]">
							2
						</span>
						<span className="text-green-600 dark:text-green-400 inline-block transform scale-x-[-1]">
							0
						</span>{" "}
						Facilitator
					</Link>
					<div className="flex items-center gap-1">
						<Button
							asChild
							variant={pathname === "/" ? "default" : "ghost"}
							size="sm"
						>
							<Link href="/">Home</Link>
						</Button>
						<Button
							asChild
							variant={pathname === "/dashboard" ? "default" : "ghost"}
							size="sm"
						>
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					</div>
				</div>
				<ThemeToggle />
			</div>
		</nav>
	);
}
