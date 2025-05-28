import { DisabledView, FileButton } from "@box/shared/ui"
import { IWithClass } from "@box/types"
import classNames from "classnames"
import Upload from '@assets/icons/16_upload.svg'
import Download from '@assets/icons/16_download.svg'
import s from './style.module.scss';
import React, { useEffect, useState } from "react";
import { dealApi } from "@box/entities/deal";
import { useEvent } from "effector-react";
import { uploadDocumentWithTypesFx, uploadEquipmentDocumentWithTypesFx, uploadTransportDocumentWithTypesFx } from "../../forms/addDocument/model";
import { IDeal, IDealDocument } from "@box/entities/deal/model"
import { truncateString } from "@box/shared/lib/helpers"


export const TypedDocsViewer: React.FC<IWithClass & 
{docHelpData: any, docs: (IDealDocument | undefined)[] | null, deal: IDeal, docId: number | undefined, dealType: string}> = ({
    className,
    docHelpData,
    docs = null,
    deal,
    docId,
    dealType
}) => {
    const [docItemsStash, setDocsItemsStash] = useState<(IDealDocument | undefined)[] | null>(docs);
    const [docItems, setDocsItems] = useState<(IDealDocument | undefined)[] | null>(docs);
    const [isTriggered, setTrigger] = useState(false);
    const [show, setShow] = useState(docItemsStash?.length && docItemsStash?.length > 1);
    const [remainingDocuments, setRemainingDocuments] = useState(((docItemsStash?.length) || 0));
    const toggleTrigger = () => {
      setTrigger(!isTriggered);
    };

    const getDoc = async (url: string, id: number, docType: string) => {
        try {
          const { data } = await dealApi.getDoc(url, id, docType)
          if (!!data.document) {
            window.open(`${process.env.NEXT_PUBLIC_API_URL}${data.document}`, '_blank');
          }
        } catch (e) {
          console.log(e);
        }
    }

    const getAdditionalDoc = async (url: string | undefined) => {
        try {
            if (url) {
                window.open(`${url}`, '_blank');
            }
        } catch (e) {
          console.log(e);
        }
    }

    const upload = useEvent(uploadDocumentWithTypesFx);
    const uploadEquipment = useEvent(uploadEquipmentDocumentWithTypesFx);
    const uploadTransport = useEvent(uploadTransportDocumentWithTypesFx);
    const uploadDoc = async (file: File | null, document_type: number) => {
        try {
            if (!file) {
                console.log("It's not a file.");
                return;
            } else {
                let ans: any;
                // @ts-ignore

                if (dealType === "EquipmentDeals") {
                    // @ts-ignore
                    ans = await uploadEquipment({
                      document: file,
                      name: file?.name,
                      document_type: document_type
                    });
                } else if (dealType === "TransportDeals") {
                    // @ts-ignore
                    ans = await uploadTransport({
                      document: file,
                      name: file?.name,
                      document_type: document_type
                    })
                } else if (dealType === "Deals") {
                    // @ts-ignore
                    ans = await upload({
                      document: file,
                      name: file?.name,
                      document_type: document_type
                    });
                }

                const lastDoc = ans.documents[ans.documents.length - 1]
                setDocsItemsStash([...docItemsStash || [], lastDoc])
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(()=>{
        if (!isTriggered) {
            setDocsItems([])
        } else {
            setDocsItems(docItemsStash)
        }
    }, [isTriggered, docItemsStash])

    useEffect(()=>{
        setShow(docItemsStash?.length && docItemsStash?.length > 0)
        setRemainingDocuments(((docItemsStash?.length) || 0))
    }, [docItemsStash])

    return(
        <div className={classNames("p-[16px] bg-grey-10 rounded-[20px]", className)}>
            <p className="text-sm decoration-dotted mx-[5px]">{docHelpData.title}</p>
                <div 
                className={`flex min-h-[60px] items-center cursor-pointer justify-start p-[10px] bg-[#FFFFFF] gap-[8px] rounded-[10px] mt-[15px] ${s.iconColor2}`}
                onClick={()=>{
                    {/* @ts-ignore */}
                    getDoc(docHelpData.url, docId, docHelpData.docType)
                }}
                >
                    <Download />
                    <div>
                        <p className="text-sm cursor-pointer text-[#399977]">{docHelpData.title}</p>
                    </div> 
                </div>
            {docItems?.map((docItem)=>{
                const date = docItem?.createdAt?.split("T") || [undefined];
                const stringDate = `${date[0]} ${date[1]?.split(".")[0]}`;

                return(
                    <div 
                    className={`flex items-center  cursor-pointer justify-start p-[10px] bg-[#FFFFFF] gap-[8px] rounded-[10px] mt-[15px] ${s.iconColor2}`}
                    onClick={()=>{
                        getAdditionalDoc(docItem?.document)
                    }}
                    >
                        <Download />
                        <div>
                            <p className="text-sm cursor-pointer text-[#399977]">{truncateString(`${docItem?.name || "Добавьте документ"}`, 30)}</p>
                            <p className="text-sm cursor-pointer text-[#767A7A]">{truncateString(`${date[1] ? stringDate : "(кнопка ниже)"}`, 30)}</p>
                        </div> 
                    </div>
                )
            })}
            <div className="flex items-center justify-between mt-[15px]">
                {(show) ? (<a onClick={()=>{toggleTrigger()}}><p className="text-sm underline decoration-dotted cursor-pointer text-[#399977]">
                    {!isTriggered ? `Еще ${(remainingDocuments)} документ` : "Свернуть"}
                </p></a>) : (<div></div>)}
                <FileButton 
                className={`${s.iconColor} ${s.fileButton} rounded-[10px]`}
                onChange={(file: any)=>{uploadDoc(file, docHelpData.typeNum as number)}}>
                    <div className="flex items-center justify-center gap-[8px]">
                        <Upload />
                        <p className="text-[#399977]">{"Добавить"}</p>
                    </div>
                </FileButton>
            </div>
        </div>
    )
}

export const TypedDoscViewerHolder: React.FC<IWithClass & {deal: IDeal, documents: any, dealType: string}> = ({
    deal,
    documents,
    className,
    dealType
}) => {
    const [currentURL, setCurrentUrl] = useState<string>("");
    useEffect(()=>{
        const currentURL = window.location.href;
        setCurrentUrl(currentURL);
    }, [])

    let isLogistics = false;
    if (currentURL.includes('logistics') || currentURL.includes('transport')) {
        isLogistics = true;
    }

    return(
        <div className={`${s.typedDocsHolder} ${className} ${s.firstItemMinusMT} mt-[15px]`}>
        {documents
        .filter((docHelpData: any) => {if(isLogistics){return(docHelpData.isLogistics)}else{return (true)}})
        .map((docHelpData: any, index: any) => {
          const docs = deal?.documents.filter((docItem) => {
            return docItem.documentType?.id === docHelpData.typeNum as number;
          });

            let disable = true;
            let docId: number | undefined = 0;
            let dealStatusId: number | undefined = deal.status.id;
            if (dealType === "EquipmentDeals") {
                docId = (docHelpData.isEquipment ? deal?.id : deal?.transportApplication?.id)
            } else if (dealType === "TransportDeals") {
                docId = (deal.id)
            } else if (dealType === "Deals") {
                docId = (docHelpData.isRecyclable ? deal?.id : deal?.transportApplication?.id)
            }

            if (currentURL.includes('logistics') || currentURL.includes('transport')) {
                if (currentURL.includes('logistics')) {
                    dealStatusId = deal?.transportApplication?.status.id
                }
                disable = docHelpData.logisticsStatusDisabled.includes(dealStatusId ? dealStatusId+1 : 0)
            }

            if (currentURL.includes('deals')) {
                disable = docHelpData.dealStatusDisabled.includes(dealStatusId)
            }

          return(
              <DisabledView disabled={disable} classNameForCloserEl="rounded-[20px]">
                  <TypedDocsViewer
                      docHelpData={docHelpData}
                      docs={docs} deal={deal}
                      docId={docId}
                      className={index === 0 ? "mt-[0px]" : 'mt-[15px]'}
                      dealType={dealType}
                  />
              </DisabledView>
          )
        })}
      </div>
    )
}