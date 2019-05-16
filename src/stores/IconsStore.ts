import * as React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

export declare type LazyIcon = React.LazyExoticComponent<React.ComponentType<SvgIconProps>>;
export declare type IconsMap = {[k: string]: LazyIcon};

export const Icons: IconsMap = {
    Beach: React.lazy(() => import('@material-ui/icons/BeachAccess')),
    Bar: React.lazy(() => import('@material-ui/icons/LocalBar')),
    Cafe: React.lazy(() => import('@material-ui/icons/LocalCafe')),
    Flight: React.lazy(() => import('@material-ui/icons/Flight')),
    Train: React.lazy(() => import('@material-ui/icons/Train')),
    Bus: React.lazy(() => import('@material-ui/icons/DirectionsBus')),
    Taxi: React.lazy(() => import('@material-ui/icons/LocalTaxi')),
    Boat: React.lazy(() => import('@material-ui/icons/DirectionsBoat')),
    Hotel: React.lazy(() => import('@material-ui/icons/Hotel')),
    Atm: React.lazy(() => import('@material-ui/icons/LocalAtm')),
    Fastfood: React.lazy(() => import('@material-ui/icons/Fastfood')),
    Restaurant: React.lazy(() => import('@material-ui/icons/LocalDining')),
    Laundry: React.lazy(() => import('@material-ui/icons/LocalLaundryService')),
    Grocery: React.lazy(() => import('@material-ui/icons/LocalGroceryStore')),
    GasStation: React.lazy(() => import('@material-ui/icons/LocalGasStation')),
    Hospital: React.lazy(() => import('@material-ui/icons/LocalHospital')),
    Pharmacy: React.lazy(() => import('@material-ui/icons/LocalPharmacy')),
    Movies: React.lazy(() => import('@material-ui/icons/LocalMovies')),
    Parking: React.lazy(() => import('@material-ui/icons/LocalParking')),
    WC: React.lazy(() => import('@material-ui/icons/Wc')),
    School: React.lazy(() => import('@material-ui/icons/School')),
    Smartphone: React.lazy(() => import('@material-ui/icons/Smartphone')),
    Activity: React.lazy(() => import('@material-ui/icons/LocalActivity')),
    Smoking: React.lazy(() => import('@material-ui/icons/SmokingRooms')),
    Mall: React.lazy(() => import('@material-ui/icons/LocalMall')),
    Pool: React.lazy(() => import('@material-ui/icons/Pool')),
};

export class IconsStore {

    public readonly icons: IconsMap = {
        'beach':        Icons.Beach,
        'vacations':    Icons.Beach,
        'general':      Icons.Beach,
        'default':      Icons.Beach,

        'drink':        Icons.Bar,
        'bar':          Icons.Bar,
        'pub':          Icons.Bar,

        'coffee':       Icons.Cafe,
        'cafe':         Icons.Cafe,
        'hotDrink':     Icons.Cafe, 

        'flight':       Icons.Flight,

        'train':        Icons.Train,
        'transport':    Icons.Train,

        'bus':          Icons.Bus,

        'car':          Icons.Taxi,
        'taxi':         Icons.Taxi,
        'uber':         Icons.Taxi,

        'boat':         Icons.Boat,

        'atm':          Icons.Atm,
        'currency':     Icons.Atm,
        'fees':         Icons.Atm,
        'exchange':     Icons.Atm,

        'fastfood':     Icons.Fastfood,
        'burger':       Icons.Fastfood,

        'restaurants':  Icons.Restaurant,
        'dinner':       Icons.Restaurant,
        'lunch':        Icons.Restaurant,
        'food':         Icons.Restaurant,

        'laundry':      Icons.Laundry,

        'grocery':      Icons.Grocery,

        'gasStation':   Icons.GasStation,
        'diesel':       Icons.GasStation,
        'fuel':         Icons.GasStation,

        'hospital':     Icons.Hospital,
        'health':       Icons.Hospital,
        'sickness':     Icons.Hospital,

        'pharmacy':     Icons.Pharmacy,
        'hygiene':      Icons.Pharmacy,

        'movie':        Icons.Movies,
        'cine':         Icons.Movies,

        'parking':      Icons.Parking,

        'wc':           Icons.WC,
        'restrooms':    Icons.WC,

        'school':       Icons.School,
        'education':    Icons.School,
        'learning':     Icons.School,

        'smartphone':   Icons.Smartphone,
        'phone':        Icons.Smartphone,
        'internet':     Icons.Smartphone,
        'sim':          Icons.Smartphone,

        'activity':     Icons.Activity,
        'activities':   Icons.Activity,
        'tours':        Icons.Activity,
        'tickets':      Icons.Activity,

        'cigarette':    Icons.Smoking,
        'smoke':        Icons.Smoking,

        'sports':       Icons.Pool,
        'pool':         Icons.Pool,

        'mall':         Icons.Mall,
        'shopping':     Icons.Mall,

        'hotel':        Icons.Hotel,
        'hostel':       Icons.Hotel,
        'sleeping':     Icons.Hotel,
        'hosting':      Icons.Hotel,
        'accommodation':Icons.Hotel,
    };

    getComponents() {
        return Object.values(Icons);
    }

    textSearchIcon (text: string) {
        // TODO improve searching algorithm
        const inputText = text.toLowerCase();
        for (const k of Object.keys(this.icons)) {
            if (k.toLowerCase() === inputText) {
                return this.icons[k];
            }
        }
        return this.icons.default;
    }

    getIcon (name: string) {
        return name in Icons ? Icons[name] : Icons.Beach;
    }

    get defaultIconName () {
        return 'Beach';
    }
}

export const iconsStore = new IconsStore();
