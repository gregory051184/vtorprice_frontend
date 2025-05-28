import { IWithChildren } from "@box/types";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const Portal: React.FC<IWithChildren & { containerId: string }> = ({
  children,
  containerId,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(
        children,
        document.getElementById(containerId) as HTMLDivElement
      )
    : null;
};
