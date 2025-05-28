import { IWithClass } from "@types";

type IBreacdCrumbsObject = {
  text: string;
  href?: string;
};

export interface IBreadCrumbs extends IWithClass {
  breadcrumbs: Array<IBreacdCrumbsObject>;
}
