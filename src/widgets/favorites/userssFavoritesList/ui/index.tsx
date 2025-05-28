import { favoritesTypes } from '@box/widgets/favorites/userssFavoritesList/lib';
import { TabSelect } from '@box/shared/ui';
import { UsersFavoritesApplicationsList } from '@box/widgets/applications/applicationsFavoritesList';
import { useEvent, useStore } from 'effector-react';
import { $favoriteListType, changeFavoriteListType } from '../model';
import {CompaniesFavouriteListForMakingMessages} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";

export const UsersFavoritesList: React.FC = () => {
  const listType = useStore($favoriteListType);
  const changeListType = useEvent(changeFavoriteListType);
  return (
    <>
      <TabSelect
        onChange={(event) => changeListType(event.id)}
        values={favoritesTypes}
        value={listType} 
      />
      {listType.id === 1 && <CompaniesFavouriteListForMakingMessages /> /*<UsersFavoritesCompaniesList />*/}
      {listType.id === 2 && <UsersFavoritesApplicationsList />} 
    </>
  );
};
