import { ReactNode } from "react";
import { IWithChildren, IWithClass } from "@types";

export interface IDrawer extends IWithChildren, IWithClass {
  title?: string;
  visible: boolean;
  close: () => void;
  bottomActions?: ReactNode;
  disableClickOutside?: boolean;
}
