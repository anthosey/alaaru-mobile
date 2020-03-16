export class Shipment {
    constructor(
                public ref: string,
                public date: Date,
                public time: string,
                public description: string,
                public location: string,
                public status: string,
                public lat: number,
                public lng: number
    ) {}
}