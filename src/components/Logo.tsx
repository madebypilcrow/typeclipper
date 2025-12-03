import React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  src?: string;
}

export default function Logo({
  src,
  className,
  ...rest
}: LogoProps) {
  const wrapperClass = ["logo", className].filter(Boolean).join(" ");

  const resolvedSrc =
    src ?? `${import.meta.env.BASE_URL}assets/typeclipper-logo.svg`;

  return (
    <div className={wrapperClass} aria-hidden="true">
      <img
        src={resolvedSrc}
        alt=""
        className="logo__image"
        {...rest}
      />
    </div>
  );
}