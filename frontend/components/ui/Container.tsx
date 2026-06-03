import { cn } from "@/lib/cn";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
  bleed?: boolean;
};

export function Container({
  as: Tag = "div",
  className,
  bleed = false,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        bleed ? "max-w-[1440px]" : "max-w-7xl",
        "px-5 sm:px-8 lg:px-12",
        className,
      )}
      {...rest}
    />
  );
}
