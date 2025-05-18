import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  className?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="md:text-[14px] text-[10px] mb-4">
      {items.map((item, index) => (
        <span key={index} className="font-[300]">
          {item.href ? (
            <Link href={item.href} className="text-[#8E8E8E] hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-[400]">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">→</span>}
        </span>
      ))}
    </nav>
  );
}
