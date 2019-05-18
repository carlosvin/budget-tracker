import * as React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { range } from '../utils';

export declare type IconType =  'Add' | 'Save';

// Implement Icons as IconsProof
const IconsProof: {[k in IconType]: LazyIcon} = {
    'Add': React.lazy(() => import('@material-ui/icons/Add')),
    'Save': React.lazy(() => import('@material-ui/icons/Add'))
};

export const enum IconName {
    // Internal Icons
    Add = 1, Save, Cancel, Delete, Edit, ImportExport, 
    // General Icons
    Beach, Bar, Cafe, Flight, Train, Bus, Taxi, Boat, Hotel,
    Exchange, Atm, Fastfood, Restaurant, Laundry, Grocery, GasStation, 
    Hospital, Pharmacy, Movies, Parking, Sim, WC, School, Smartphone, 
    Activity, Ticket, Smoking, Mall,Pool, Label, Shopping
};

export declare type LazyIcon = React.LazyExoticComponent<React.ComponentType<SvgIconProps>>;

const Icons: {[k in IconName]: LazyIcon} = {
    // internal icons
    [IconName.Add]: React.lazy(() => import('@material-ui/icons/Add')),
    [IconName.Save]: React.lazy(() => import('@material-ui/icons/Save')),
    [IconName.Cancel]: React.lazy(() => import('@material-ui/icons/Cancel')),
    [IconName.Delete]: React.lazy(() => import('@material-ui/icons/Delete')),
    [IconName.Edit]: React.lazy(() => import('@material-ui/icons/Edit')),
    [IconName.ImportExport]: React.lazy(() => import('@material-ui/icons/ImportExport')),

    // rest of icons
    [IconName.Beach]: React.lazy(() => import('@material-ui/icons/BeachAccess')),
    [IconName.Bar]: React.lazy(() => import('@material-ui/icons/LocalBar')),
    [IconName.Cafe]: React.lazy(() => import('@material-ui/icons/LocalCafe')),
    [IconName.Flight]: React.lazy(() => import('@material-ui/icons/Flight')),
    [IconName.Train]: React.lazy(() => import('@material-ui/icons/Train')),
    [IconName.Bus]: React.lazy(() => import('@material-ui/icons/DirectionsBus')),
    [IconName.Taxi]: React.lazy(() => import('@material-ui/icons/LocalTaxi')),
    [IconName.Boat]: React.lazy(() => import('@material-ui/icons/DirectionsBoat')),
    [IconName.Hotel]: React.lazy(() => import('@material-ui/icons/Hotel')),
    [IconName.Exchange]: React.lazy(() => import('@material-ui/icons/LocalAtm')),
    [IconName.Atm]: React.lazy(() => import('@material-ui/icons/Atm')),
    [IconName.Fastfood]: React.lazy(() => import('@material-ui/icons/Fastfood')),
    [IconName.Restaurant]: React.lazy(() => import('@material-ui/icons/LocalDining')),
    [IconName.Laundry]: React.lazy(() => import('@material-ui/icons/LocalLaundryService')),
    [IconName.Grocery]: React.lazy(() => import('@material-ui/icons/LocalGroceryStore')),
    [IconName.GasStation]: React.lazy(() => import('@material-ui/icons/LocalGasStation')),
    [IconName.Hospital]: React.lazy(() => import('@material-ui/icons/LocalHospital')),
    [IconName.Pharmacy]: React.lazy(() => import('@material-ui/icons/LocalPharmacy')),
    [IconName.Movies]: React.lazy(() => import('@material-ui/icons/LocalMovies')),
    [IconName.Parking]: React.lazy(() => import('@material-ui/icons/LocalParking')),
    [IconName.Sim]: React.lazy(() => import('@material-ui/icons/SimCard')),
    [IconName.WC]: React.lazy(() => import('@material-ui/icons/Wc')),
    [IconName.School]: React.lazy(() => import('@material-ui/icons/School')),
    [IconName.Smartphone]: React.lazy(() => import('@material-ui/icons/Smartphone')),
    [IconName.Activity]: React.lazy(() => import('@material-ui/icons/Rowing')),
    [IconName.Ticket]: React.lazy(() => import('@material-ui/icons/LocalActivity')),
    [IconName.Smoking]: React.lazy(() => import('@material-ui/icons/SmokingRooms')),
    [IconName.Mall]: React.lazy(() => import('@material-ui/icons/LocalMall')),
    [IconName.Pool]: React.lazy(() => import('@material-ui/icons/Pool')),
    [IconName.Label]: React.lazy(() => import('@material-ui/icons/Label')),
    [IconName.Shopping]: React.lazy(() => import('@material-ui/icons/ShoppingCart'))
};


export class IconsStore {

    private readonly categoryIconKeys = range(IconName.Beach, IconName.Shopping);

    get categoryIcons() {
        return this.categoryIconKeys;
    }

    getIcon (name: IconName) {
        return name in Icons ? Icons[name] : this.defaultIcon;
    }

    get defaultIcon () {
        return Icons[IconName.Label];
    }
}

export const iconsStore = new IconsStore();
