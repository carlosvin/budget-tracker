import * as React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

export declare type AppIconType = 'Add' | 'Save' | 'Cancel'| 'Delete' | 'Edit' | 'ImportExport';


// General Icons
export declare type CategoryIconType = 'Beach' | 'Bar' | 'Cafe' | 'Flight' | 'Train' | 
'Bus' | 'Taxi' | 'Boat' | 'Hotel' | 'Exchange' | 'Atm' | 'Fastfood' | 'Restaurant' | 
'Laundry' | 'Grocery' | 'GasStation' | 'Hospital' | 'Pharmacy' | 'Movies' | 'Parking' | 
'Sim' | 'WC' | 'School' | 'Smartphone' | 'Activity' | 'Ticket' | 'Smoking' | 'Mall' | 'Pool' |
'Label' | 'Shopping';

export declare type IconType = AppIconType | CategoryIconType;
export declare type LazyIcon = React.LazyExoticComponent<React.ComponentType<SvgIconProps>>;

const AppIcons: {[k in AppIconType]: LazyIcon} = {
    // internal icons
    'Add': React.lazy(() => import('@material-ui/icons/Add')),
    'Save': React.lazy(() => import('@material-ui/icons/Save')),
    'Cancel': React.lazy(() => import('@material-ui/icons/Cancel')),
    'Delete': React.lazy(() => import('@material-ui/icons/Delete')),
    'Edit': React.lazy(() => import('@material-ui/icons/Edit')),
    'ImportExport': React.lazy(() => import('@material-ui/icons/ImportExport')), 
} as const;

const CategoryIcons: {[k in CategoryIconType]: LazyIcon} = {
    // rest of icons
    'Beach': React.lazy(() => import('@material-ui/icons/BeachAccess')),
    'Bar': React.lazy(() => import('@material-ui/icons/LocalBar')),
    'Cafe': React.lazy(() => import('@material-ui/icons/LocalCafe')),
    'Flight': React.lazy(() => import('@material-ui/icons/Flight')),
    'Train': React.lazy(() => import('@material-ui/icons/Train')),
    'Bus': React.lazy(() => import('@material-ui/icons/DirectionsBus')),
    'Taxi': React.lazy(() => import('@material-ui/icons/LocalTaxi')),
    'Boat': React.lazy(() => import('@material-ui/icons/DirectionsBoat')),
    'Hotel': React.lazy(() => import('@material-ui/icons/Hotel')),
    'Exchange': React.lazy(() => import('@material-ui/icons/LocalAtm')),
    'Atm': React.lazy(() => import('@material-ui/icons/Atm')),
    'Fastfood': React.lazy(() => import('@material-ui/icons/Fastfood')),
    'Restaurant': React.lazy(() => import('@material-ui/icons/LocalDining')),
    'Laundry': React.lazy(() => import('@material-ui/icons/LocalLaundryService')),
    'Grocery': React.lazy(() => import('@material-ui/icons/LocalGroceryStore')),
    'GasStation': React.lazy(() => import('@material-ui/icons/LocalGasStation')),
    'Hospital': React.lazy(() => import('@material-ui/icons/LocalHospital')),
    'Pharmacy': React.lazy(() => import('@material-ui/icons/LocalPharmacy')),
    'Movies': React.lazy(() => import('@material-ui/icons/LocalMovies')),
    'Parking': React.lazy(() => import('@material-ui/icons/LocalParking')),
    'Sim': React.lazy(() => import('@material-ui/icons/SimCard')),
    'WC': React.lazy(() => import('@material-ui/icons/Wc')),
    'School': React.lazy(() => import('@material-ui/icons/School')),
    'Smartphone': React.lazy(() => import('@material-ui/icons/Smartphone')),
    'Activity': React.lazy(() => import('@material-ui/icons/Rowing')),
    'Ticket': React.lazy(() => import('@material-ui/icons/LocalActivity')),
    'Smoking': React.lazy(() => import('@material-ui/icons/SmokingRooms')),
    'Mall': React.lazy(() => import('@material-ui/icons/LocalMall')),
    'Pool': React.lazy(() => import('@material-ui/icons/Pool')),
    'Label': React.lazy(() => import('@material-ui/icons/Label')),
    'Shopping': React.lazy(() => import('@material-ui/icons/ShoppingCart'))
} as const;

const Icons = {...AppIcons, ...CategoryIcons};

export class IconsStore {

    get categoryIcons() {
        return Object.keys(CategoryIcons) as CategoryIconType[];
    }

    getCategoryIcon (type: CategoryIconType) {
        return CategoryIcons[type];
    }

    get appIcons() {
        return Object.keys(AppIcons) as AppIconType[];
    }

    getAppIcon (type: AppIconType) {
        return AppIcons[type];
    }

    getIcon (type: IconType) {
        type
        return Icons[type];
    }

}

export const iconsStore = new IconsStore();
