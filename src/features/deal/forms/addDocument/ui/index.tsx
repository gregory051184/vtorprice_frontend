import { FileButton } from "@box/shared/ui";
import { useEvent } from "effector-react";
import { FC } from "react";
import { uploadDocumentFx, uploadEquipmentDocumentFx, uploadTransportDocumentFx } from "../model";

export const AddDocuments: FC<{isEquipment?: boolean, isTransport?: boolean}> = ({ isEquipment = false, isTransport = false }) => {
  const upload = useEvent(uploadDocumentFx);
  const uploadEquipment = useEvent(uploadEquipmentDocumentFx);
  const uploadTransport = useEvent(uploadTransportDocumentFx);

  const onSelect = (file: File | null) => {
    if (!file) {
      return;
    }
    if (isEquipment) {
      // @ts-ignore
      uploadEquipment({
        document: file,
        name: file?.name,
      });
    } else if (isTransport) {
      // @ts-ignore
      uploadTransport({
        document: file,
        name: file?.name,
      })
    } else {
      // @ts-ignore
      upload({
        document: file,
        name: file?.name,
      });
    }
  };
  return (
    <div>
      <FileButton onChange={onSelect}>
        <div className="border-primaryGreen-main border-2 border-dashed rounded-[12px] text-center text-primaryGreen-dark w-full p-[16px]">
          Прикрепить документы
        </div>
      </FileButton>
    </div>
  );
};
