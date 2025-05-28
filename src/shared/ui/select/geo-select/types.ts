import { IAppSelect } from "@box/shared/ui";

interface IGeocode {
  address: string;
  latitude: string;
  longitude: string;
  city?: string;
}

interface IGeoSelectValueField {
  value: string,
  onClick: () => void,
}

type TGeoSelectValues = Omit<IGeocode, 'city'>;

interface IGeoSelect extends Omit<IAppSelect, 'data' | 'value' | 'onSelect' | 'wide'> {
  onSelect: (props: IGeocode) => void;
}

export type { IGeocode, IGeoSelect, IGeoSelectValueField, TGeoSelectValues }
