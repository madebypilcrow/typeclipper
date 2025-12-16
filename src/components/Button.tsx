import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import "@/styles/button.scss";

type Props<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export default function Button<T extends ElementType = "button">({
  as,
  children,
  className = "",
  ...rest
}: Props<T>) {
  const Component = (as ?? "button") as ElementType;

  return (
    <Component className={["button", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Component>
  );
}