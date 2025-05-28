import React from "react";
import classNames from "classnames";
import Link from "next/link";
import ArrowRight from "@assets/icons/16_arrowRight.svg";

import { IBreadCrumbs } from "./types";

export const BreadCrumbs: React.FC<IBreadCrumbs> = ({
  className,
  breadcrumbs,
}) => {

  return (
    <div className={classNames("flex gap-2 items-center flex-wrap", className)}>
      {breadcrumbs.map((crumb, idx) => (
        //@ts-ignore
        <Crumb key={idx} first={ idx=== 0} last={idx === breadcrumbs.length - 1} {...crumb} />
      ))}
    </div>
  );
};

type ICrumb = {
  href?: string;
  text: string;
  last: boolean;
  first: boolean;
};


function Crumb({ href, text, last, first }: ICrumb) {
  if (first && href) {
    return <Link className="text-sm underline font-medium" href={href}>
      {text}
    </Link>;
  }
  if (last) {
    return <div className="flex gap-2 items-center text-sm">
      <ArrowRight />
      <p className="text-grey-30 text-sm">{text}</p>
    </div>
  }
  if (href) {
    return (
        <div className="flex gap-2 items-center text-sm">
          <ArrowRight />
          <Link className="underline font-medium" href={href}>
            {text}
          </Link>
        </div>
    );
  }
}

