export class VehicleTypes {
    constructor(
        public id: number,
        public vehicleType: string,
        public vehicleDescription: string,
        public imageUrl: string,
        public basePrice: number,
        public allowFullVehicleCapacity: boolean,
        public humanAccompany: boolean,
        public baseEta: number,
        public smallImageUrl: string
    ) {}
}
