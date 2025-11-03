import React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  label?: string;
  src?: string;
}

export default function Logo({
  label = "Typeclipper",
  src = "/assets/typeclipper-logo.svg",
  className,
  ...rest
}: LogoProps) {
  const wrapperClass = ["inline-block", "relative", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="block h-auto w-auto"
        {...rest}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}