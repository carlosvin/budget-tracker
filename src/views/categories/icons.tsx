import * as React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

const Beach = React.lazy(() => import('@material-ui/icons/BeachAccess'));
const Bar = React.lazy(() => import('@material-ui/icons/LocalBar'));
const Cafe = React.lazy(() => import('@material-ui/icons/LocalCafe'));
const Flight = React.lazy(() => import('@material-ui/icons/Flight'));
const Train = React.lazy(() => import('@material-ui/icons/Train'));
const Bus = React.lazy(() => import('@material-ui/icons/DirectionsBus'));
const Taxi = React.lazy(() => import('@material-ui/icons/LocalTaxi'));
const Boat = React.lazy(() => import('@material-ui/icons/DirectionsBoat'));
const Hotel = React.lazy(() => import('@material-ui/icons/Hotel'));
const Atm = React.lazy(() => import('@material-ui/icons/LocalAtm'));
const Fastfood = React.lazy(() => import('@material-ui/icons/Fastfood'));
const Restaurant = React.lazy(() => import('@material-ui/icons/LocalDining'));
const Laundry = React.lazy(() => import('@material-ui/icons/LocalLaundryService'));
const Grocery = React.lazy(() => import('@material-ui/icons/LocalGroceryStore'));
const GasStation = React.lazy(() => import('@material-ui/icons/LocalGasStation'));
const Hospital = React.lazy(() => import('@material-ui/icons/LocalHospital'));
const Pharmacy = React.lazy(() => import('@material-ui/icons/LocalPharmacy'));
const Movies = React.lazy(() => import('@material-ui/icons/LocalMovies'));
const Parking = React.lazy(() => import('@material-ui/icons/LocalParking'));
const WC = React.lazy(() => import('@material-ui/icons/Wc'));
const School = React.lazy(() => import('@material-ui/icons/School'));
const Smartphone = React.lazy(() => import('@material-ui/icons/Smartphone'));
const Activity = React.lazy(() => import('@material-ui/icons/LocalActivity'));
const Smoking = React.lazy(() => import('@material-ui/icons/SmokingRooms'));
const Mall = React.lazy(() => import('@material-ui/icons/LocalMall'));
const Pool = React.lazy(() => import('@material-ui/icons/Pool'));

// TODO maybe create an store for icons

const icons: {[k: string]: React.LazyExoticComponent<React.ComponentType<SvgIconProps>>} = {
    'beach':        Beach,
    'vacations':    Beach,
    'general':      Beach,
    'default':      Beach,

    'drink':        Bar,
    'bar':          Bar,
    'pub':          Bar,

    'coffee':       Cafe,
    'cafe':         Cafe,
    'hotDrink':     Cafe, 

    'flight':       Flight,

    'train':        Train,
    'transport':    Train,

    'bus':          Bus,

    'car':          Taxi,
    'taxi':         Taxi,
    'uber':         Taxi,

    'boat':         Boat,

    'atm':          Atm,
    'currency':     Atm,
    'fees':         Atm,
    'exchange':     Atm,

    'fastfood':     Fastfood,
    'burger':       Fastfood,

    'restaurants':  Restaurant,
    'dinner':       Restaurant,
    'lunch':        Restaurant,
    'food':         Restaurant,

    'laundry':      Laundry,

    'grocery':      Grocery,

    'gasStation':   GasStation,
    'diesel':       GasStation,
    'fuel':         GasStation,

    'hospital':     Hospital,
    'health':       Hospital,
    'sickness':     Hospital,

    'pharmacy':     Pharmacy,
    'hygiene':      Pharmacy,

    'movie':        Movies,
    'cine':         Movies,

    'parking':      Parking,

    'wc':           WC,
    'restrooms':    WC,

    'school':       School,
    'education':    School,
    'learning':     School,

    'smartphone':   Smartphone,
    'phone':        Smartphone,
    'internet':     Smartphone,
    'sim':          Smartphone,

    'activity':     Activity,
    'activities':   Activity,
    'tours':        Activity,
    'tickets':      Activity,

    'cigarette':    Smoking,
    'smoke':        Smoking,

    'sports':       Pool,
    'pool':         Pool,

    'mall':         Mall,
    'shopping':     Mall,

    'hotel':        Hotel,
    'hostel':       Hotel,
    'sleeping':     Hotel,
    'hosting':      Hotel,
    'accommodation':Hotel,
}

export function getIcon (text: string) {

    // TODO improve searching algorithm
    const inputText = text.toLowerCase();
    for (const k of Object.keys(icons)) {
        if (k.toLowerCase() === inputText) {
            return icons[k];
        }
    }
    return icons.default;
}