
interface Journey {
    readonly trip: string;
    readonly what: string;
    readonly where: string;
    readonly when: Date;
    readonly who?: string[];
    readonly from?: string;
    readonly to?: string;
}

interface Travel {
    steps: Journey[];
}
