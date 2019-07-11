import * as React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

export declare type LazyIcon = React.LazyExoticComponent<React.ComponentType<SvgIconProps>>;
interface IconsMap {[k: string]: LazyIcon};

const Icons: IconsMap = {
    Beach: React.lazy(() => import('@material-ui/icons/BeachAccess')),
    Bar: React.lazy(() => import('@material-ui/icons/LocalBar')),
    Cafe: React.lazy(() => import('@material-ui/icons/LocalCafe')),
    Flight: React.lazy(() => import('@material-ui/icons/Flight')),
    Train: React.lazy(() => import('@material-ui/icons/Train')),
    Bus: React.lazy(() => import('@material-ui/icons/DirectionsBus')),
    Taxi: React.lazy(() => import('@material-ui/icons/LocalTaxi')),
    Boat: React.lazy(() => import('@material-ui/icons/DirectionsBoat')),
    Hotel: React.lazy(() => import('@material-ui/icons/Hotel')),
    Exchange: React.lazy(() => import('@material-ui/icons/LocalAtm')),
    Atm: React.lazy(() => import('@material-ui/icons/Atm')),
    Fastfood: React.lazy(() => import('@material-ui/icons/Fastfood')),
    Restaurant: React.lazy(() => import('@material-ui/icons/LocalDining')),
    Laundry: React.lazy(() => import('@material-ui/icons/LocalLaundryService')),
    Grocery: React.lazy(() => import('@material-ui/icons/LocalGroceryStore')),
    GasStation: React.lazy(() => import('@material-ui/icons/LocalGasStation')),
    Hospital: React.lazy(() => import('@material-ui/icons/LocalHospital')),
    Pharmacy: React.lazy(() => import('@material-ui/icons/LocalPharmacy')),
    Movies: React.lazy(() => import('@material-ui/icons/LocalMovies')),
    Parking: React.lazy(() => import('@material-ui/icons/LocalParking')),
    Sim: React.lazy(() => import('@material-ui/icons/SimCard')),
    WC: React.lazy(() => import('@material-ui/icons/Wc')),
    School: React.lazy(() => import('@material-ui/icons/School')),
    Smartphone: React.lazy(() => import('@material-ui/icons/Smartphone')),
    Activity: React.lazy(() => import('@material-ui/icons/Rowing')),
    Ticket: React.lazy(() => import('@material-ui/icons/LocalActivity')),
    Smoking: React.lazy(() => import('@material-ui/icons/SmokingRooms')),
    Mall: React.lazy(() => import('@material-ui/icons/LocalMall')),
    Pool: React.lazy(() => import('@material-ui/icons/Pool')),
    Label: React.lazy(() => import('@material-ui/icons/Label')),
    Shopping: React.lazy(() => import('@material-ui/icons/ShoppingCart')),
    Commute: React.lazy(() => import('@material-ui/icons/Commute')),
    Euro: React.lazy(() => import('@material-ui/icons/EuroSymbol')),
    Build: React.lazy(() => import('@material-ui/icons/Build')),
    Motorcycle: React.lazy(() => import('@material-ui/icons/Motorcycle')),
    Pets: React.lazy(() => import('@material-ui/icons/Pets')),
    ShoppingBasket: React.lazy(() => import('@material-ui/icons/ShoppingBasket')),
    Theaters: React.lazy(() => import('@material-ui/icons/Theaters')),
    MusicVideo: React.lazy(() => import('@material-ui/icons/MusicVideo')),
    Call: React.lazy(() => import('@material-ui/icons/Call')),
    DevicesOther: React.lazy(() => import('@material-ui/icons/DevicesOther')),
    FitnessCenter: React.lazy(() => import('@material-ui/icons/FitnessCenter')),
};

export class IconsStore {

    get iconNames() {
        return Object.keys(Icons);
    }

    getIcon (name: string): LazyIcon {
        return name in Icons ? Icons[name] : this.defaultIcon;
    }

    get defaultIcon (): LazyIcon {
        return Icons.Label;
    }

}
