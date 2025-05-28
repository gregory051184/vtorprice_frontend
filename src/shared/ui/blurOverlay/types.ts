import { IWithChildren } from '@types';

export interface IBlurOverlay extends IWithChildren {
  childRef: React.MutableRefObject<HTMLElement | null>
  animationDuration?: number
  visible: boolean
  close: ()=>void
  disableClickOutside?: boolean
}
