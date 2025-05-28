import { IDrawer } from '@box/shared/ui/drawer/types';

export interface ICompanyRejectDrawer extends Omit<IDrawer, 'title' | 'children' | 'bottomActions'> {
  onSubmit:(message: string)=>void;
}
