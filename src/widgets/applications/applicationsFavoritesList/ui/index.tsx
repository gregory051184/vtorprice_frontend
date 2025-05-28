import React from "react";
import {useGate, useStore, useUnit} from "effector-react";
import classNames from "classnames";
import {Button, Pagination, Table} from "@box/shared/ui";
import {IWithClass} from "@box/types";
import {LandingApplicationCard} from "@box/entities/application";
import {applicationsFavororiteListModel} from "@box/widgets/applications/applicationsFavoritesList";
import {UsersFavoritesApplicationListFilters} from "@box/features/application/filters/usersApplicationsFavorites";
import {ApplicationFavoriteRow} from "@box/entities/application/ui/rows/applicationFavoriteRow";
import {useScreenSize} from "@box/shared/hooks";
import {useOrdering} from "@box/shared/lib/factories";
import {headers} from "../lib";
import {pagination} from "../model";
import s from "./style.module.scss";

export const UsersFavoritesApplicationsList: React.FC<IWithClass> = ({
                                                                         className,
                                                                     }) => {
    const favoriteApplication = useStore(
        applicationsFavororiteListModel.$getFavoritesApplicationFx
    );
    const updateInFavorite = useUnit(
        applicationsFavororiteListModel.updateApplicationInFavoriteFx
    );
    const loadingApplication = useStore(
        applicationsFavororiteListModel.favoriteAppplicationsLoading.$loaderStore
    );
    useGate(applicationsFavororiteListModel.gate);
    const ord = useOrdering(applicationsFavororiteListModel.ordering);
    const [, satisfies] = useScreenSize();

    const handleChangeIsFavorite = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        id: number
    ) => {
        e.stopPropagation();
        updateInFavorite(id);
    };

    return (
        <div className={className}>
            <UsersFavoritesApplicationListFilters/>
            {satisfies("md") ? (
                <Table
                    separate
                    pagination={<Pagination pagination={pagination}/>}
                    loading={loadingApplication}
                    empty={favoriteApplication.length === 0}
                    className={classNames("mt-[14px]", s.table_view, className)}
                >
                    <Table.Head
                        className={s.headrewrew}
                        headers={headers}
                        ordering={ord.ordering}
                        onOrderingChange={ord.setOrdering}
                    />
                    <Table.Body>
                        {favoriteApplication.map((application) => (
                            <ApplicationFavoriteRow
                                application={application}
                                key={application.id}
                                favoriteButton={
                                    <Button
                                        onClick={(e) => handleChangeIsFavorite(e, application.id)}
                                        className="w-[120px]"
                                        mode={application.isFavorite ? "stroke" : "fill"}
                                        type="mini"
                                    >
                                        {application.isFavorite ? "Отписаться" : "Подписаться"}
                                    </Button>
                                }
                            />
                        ))}
                    </Table.Body>
                </Table>
            ) : (
                <div className={s.card_view}>
                    <div className={classNames(s.card_view_block)}>
                        {favoriteApplication.map((application) => (
                            <LandingApplicationCard
                                className={s.card_view_card}
                                key={application.id}
                                application={application}
                            />
                        ))}
                    </div>
                    <Pagination pagination={pagination}/>
                </div>
            )}
        </div>
    );
};
