import React from 'react';
import Star from '@assets/icons/star.svg';
import classNames from 'classnames';
import { IRating } from './types';

export const Rating: React.FC<IRating> = ({
  rating,
  total,
  showOnlyStars = false,
  className,
}) => (
  <div className={classNames('flex gap-3 items-center', className)}>
    <div className="flex gap-1">
      {new Array(5).fill(0).map((_, num) => (
        <Star
          /* eslint-disable-next-line react/no-array-index-key */
          key={num}
          className={classNames(
            { 'fill-[#FFC90C]': num < Math.floor(rating) },
            { 'fill-grey-20': num >= Math.floor(rating) },

          )}
        />
      ))}
    </div>
    <div className={`${showOnlyStars ? 'hidden' : undefined}`}>
      <p className="text-xs text-grey-40">
        <span className="text-grey-90">{rating}</span>
        {' '}
        /
        {' '}
        {total}
      </p>
    </div>
  </div>
);
