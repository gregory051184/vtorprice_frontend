import { Badge } from "@box/shared/ui";
import { IWithClass } from "@box/types";
import classNames from "classnames";
import { ParsedUrlQuery } from "querystring";

export const ApplicationInfo: React.FC<IWithClass & { application: ParsedUrlQuery }> = ({ application, className }) => {
  
    return (
      <div className={classNames('flex flex-col gap-[14px] bg-white-80 py-10 px-10', className)}>
        <div className="flex justify-between">
          <div>
            <p className="font-medium mb-[8px]">{application.recyclable}</p>
            <p className="font-semibold text-xl">{application.price}{" "}₽</p>
          </div>
          <div>
            {application.dealType === "2" && (
              <Badge color="red">
                Продажа
              </Badge>
            )}
            {application.dealType === "1" && (
              <Badge color="green">
                Покупка
              </Badge>
            )}
          </div>
        </div>
        <img className="aspect-[16/9] object-cover rounded-[10px]" src={application.image ? application.image as string
                          : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'} alt="" />
        <p className="font-medium">{application.company}</p>
        <p className="text-grey-50">{application.adress}</p>
      </div>
    );
  };