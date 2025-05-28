import { Skeleton } from '@box/shared/ui';
import classNames from 'classnames';
import React from 'react';
import { sizes } from './lib/sizes';
import { IAvatar } from './types';

export const Avatar: React.FC<IAvatar> = ({
  size,
  url,
  className,
  loading = false
}) => {
  if (loading) {
    return (
      <Skeleton
        style={{
          width: sizes[size],
          height: sizes[size]
        }}
        className={classNames('rounded-full overflow-hidden', className)}
      />
    );
  }
  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size]
      }}
      className={classNames('rounded-full overflow-hidden', className)}
    >
        {typeof url === 'string' ? <img className="w-full h-full object-cover" src={url} alt=""/>
            : <svg id="Layer_2_00000018956911935115490540000007461669892884427684_" enableBackground="new 0 0 512 512"
                   viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <g id="Icon">
                    <path id="UserSquare"
                          d="m392 0h-272c-66.3 0-120 53.7-120 120v272c0 66.3 53.7 120 120 120h272c66.3 0 120-53.7 120-120v-272c0-66.3-53.7-120-120-120zm-136 53.5c54.6 0 98.9 44.3 98.9 98.9s-44.3 98.9-98.9 98.9-98.9-44.3-98.9-98.9 44.3-98.9 98.9-98.9zm148.3 405h-296.6c-26.8 0-45.8-26.1-37.7-51.6l29.2-91.3c10.9-34.2 48.1-52.4 81.8-40.2 19.9 7.2 44.9 12.6 74.9 12.6s55.1-5.5 74.9-12.6c33.7-12.2 70.8 6 81.8 40.2l29.2 91.3c8.4 25.5-10.7 51.6-37.5 51.6z"/>
                </g>
            </svg>
            /*<img className="w-full h-full object-cover" src="https://icon-library.com/images/unknown-person-icon/unknown-person-icon-4.jpg" alt="" />*/}
    </div>
  );
};
