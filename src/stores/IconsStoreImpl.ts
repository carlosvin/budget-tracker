import * as React from 'react';
import { stringToColorCss } from '../domain/utils/stringToColor';
import { LazyIcon, IconsStore } from './interfaces';

interface IconsMap {[k: string]: LazyIcon};

export default class IconsStoreImpl implements IconsStore {

    private _icons: IconsMap = {
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

    private _colors: {[name: string]: string} = {};
    private _iconNames?: string[];

    get iconNames () {
        if (!this._iconNames) {
            this._iconNames = Object.keys(this._icons);
        }
        return this._iconNames;
    }

    private _getColor (name: string): string {
        if (!(name in this._colors)) {
            this._colors[name] = stringToColorCss(name);
        }
        return this._colors[name];
    }

    private _getIcon (name: string): LazyIcon {
        return name in this._icons ? this._icons[name] : this._icons.Label;
    }

    getIcon(name: string) {
        return {
            Icon: this._getIcon(name),
            color: this._getColor(name)
        };
    }

    get defaultIcon () {
        return this.getIcon(this.iconNames[0]);
    }

}
