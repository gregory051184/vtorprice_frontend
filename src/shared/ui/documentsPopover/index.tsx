/* eslint-disable react/prop-types.ts */
import { useBoolean } from '@box/shared/hooks';
import Link from 'next/link';
import FileIcon from '@assets/icons/24_file.svg';
import { IContractorDocument } from '@box/entities/contractors/model';
import { Popover } from '../popover';

export const DocumentPopover: React.FC<{
  documents: Array<IContractorDocument>;
}> = ({ documents }) => {
  const { value: showCalendar, toggle, setValue } = useBoolean(false);
  const documentsCount = documents?.length;
  return (
    <Popover
      width={200}
      containerSize={200}
      opened={showCalendar}
      center
      close={() => setValue(false)}
    >
      <Popover.Target>
        <div
          onClick={() => {
            toggle();
          }}
        >
          <FileIcon className="fill-primaryGreen-main ml-8 cursor-pointer" />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="rounded-[10px] bg-white p-[20px] shadow border-[1px] border-grey-20">
          <p className="text-primaryGreen-dark">Договор поставки</p>
          {documentsCount > 0 
            ? (
              <ul> 
                {documents.map((document) => (
                  <li key={document.id} className="mt-2"><Link href={document.document} target="_blank">{document.name}</Link></li>
                ))}
              </ul>
            )
            : <p className="mt-2">Нет договоров</p>}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
