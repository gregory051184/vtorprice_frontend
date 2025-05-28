import React from "react";
import classNames from "classnames";
import { IColorStatus } from "./types";

type IColorSchemaStatus = {
  logist: { [key: string]: string };
  otherRole: { [key: string]: string };
};

const colorSchemeStatus: IColorSchemaStatus = {
  logist: {
    0: "",
    1: "text-yellow-2x-dark",
    2: "text-green-main",
    3: "text-red-dark",
    4: "text-blue-2x-dark",
  },
  otherRole: {
    1: "text-blue-2x-dark",
    2: "text-orange-dark",
    3: "text-orange-dark",
    4: "text-green-dark",
    5: "text-red-dark",
    6: "text-green-dark",
  },
};

export const ColorStatus: React.FC<IColorStatus> = ({ className, status }) => (
  <p
    className={classNames(
      "",
      "font-bold",
      status &&
        colorSchemeStatus[status.logist ? "logist" : "otherRole"][status.id],
      className
    )}
  >
    {status?.label || "-"}
  </p>
);
