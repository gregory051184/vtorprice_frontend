import React from 'react';

export const NoGraphData: React.FC<{ text?: string | undefined}> = ({
    text = undefined,
  }) => {

    return(
        <>
        {!!text && <p className='mx-auto text-center text-grey-40 mt-[10px]'>{text}</p>}
        <div className='flex mt-[30px]'>
          <div className='flex self-end mb-[-8px] mr-[8px] text-sm'>0</div>
          <div className="flex flex-col gap-[35px] w-full">
            <div className="border border-b-0 border-grey-20"></div>
            <div className="border border-b-0 border-grey-20"></div>
            <div className="border border-b-0 border-grey-20"></div>
            <div className="border border-b-0 border-grey-20"></div>
            <div className="border border-b-0 border-grey-20"></div>
            <div className="border border-b-0 border-grey-40"></div>
          </div>
        </div>
        </>
    );
  }