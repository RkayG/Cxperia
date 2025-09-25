import Link from "next/link";
import { cn } from "@/lib/utils";


export function Logo(props: { className?: string, link?: string }) {
  return (
    <Link
      href={props.link ?? '/'}
      className={cn("items-center space-x-2", props.className)}
      legacyBehavior>
      <span className="font-bold sm:inline-block">Stack Template</span>
    </Link>
  );
}
