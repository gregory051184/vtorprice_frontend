import React from 'react';

interface ISeparator {
  // eslint-disable-next-line react/require-default-props
  h?: number

}
export const Separator: React.FC<ISeparator> = ({
  h = 25
}) => (
  <div
    style={{
      marginTop: h,
      marginBottom: h
    }}
    className="border-b w-full border-b-grey-20"
  />
);
