import { IWithChildren, IWithClass } from "@types";

interface ITooltip extends IWithClass, IWithChildren {
  content: JSX.Element | string;
}

export type { ITooltip };