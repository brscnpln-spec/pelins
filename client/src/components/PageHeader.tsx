import { format } from "date-fns";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showDate?: boolean;
  childFriendly?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  showDate = true,
  childFriendly = false,
}: PageHeaderProps) {
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border min-h-[60px]">
      <div>
        <h1
          className={`text-2xl font-bold ${
            childFriendly ? "font-display" : ""
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground font-child">{subtitle}</p>
        )}
      </div>
      {showDate && (
        <time className="text-muted-foreground text-lg">{today}</time>
      )}
    </header>
  );
}
