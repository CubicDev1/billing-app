import { ParamListBase, Route } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type GeneralProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: Route<string, object | undefined>;
};





export type OverLaySuccessErrorPopupProps = {
  popupFlag: boolean;
  popupMessage: Array<string>;
  popupType: string;
  popupTitle: string;
  popupButtonText: string;
};

export type RegionPropsTypes = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type ItemProps = {
  id: string | number | null;
  name: string;
};



export type AreaOfSpecialistProps = {
  // id: number;
  // area_specialisation_id: number;
  // area_specialisation_name: string;
  id: number;
  user_detail_id: number;
  area_specialisation_id: number;
  created_at: string;
  area_specialisation: {
    id: number;
    area_specialisation_name: string;
    created_at: string;
  };
};

export type PrescriptionDetailsProps = {
  id: number;
  appointment_id: number;
  prescription_id: number;
  product_name: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  route_id: number;
  timing: string;
  type_value: number;
  other_comments: string;
  created_at: string;
};


export type RootStateProps = {
  overLayReducer: OverLayReducerProps;
};
export type UserDetailsProps = any;

export type UserDetailsReducerProps = {
  userDetails: UserDetailsProps;
};

export type FooterReducer = {
  selectedFooter: string;
};

export type OverLayReducerProps = {
  spinnerFlag: boolean;
  popupFlag: boolean;
  popupMessage: Array<string>;
  popupType: string;
  popupTitle: string;
  popupButtonText: string;
};

export type ImagePickerProps = {
  didCancel?: boolean;
  errorCode?: ErrorCode;
  errorMessage?: string;
  assets?: Asset[];
};
export type ErrorCode = 'camera_unavailable' | 'permission' | 'others';

export type Asset = {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
  duration?: number;
  bitrate?: number;
  timestamp?: string;
  id?: string;
};




export interface UnknownObjects {
  [key: string]: UnknownObjects | boolean | string | number;
}

export type IntervelType = any;








