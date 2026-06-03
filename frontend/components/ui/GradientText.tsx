import { cn } from "@/lib/cn";

type GradientTextProps = React.HTMLAttributes<HTMLSpanElement>;

export function GradientText({ className, ...rest }: GradientTextProps) {
  return <span className={cn("text-gradient", className)} {...rest} />;
}
