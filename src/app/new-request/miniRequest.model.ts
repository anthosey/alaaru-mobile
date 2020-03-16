export class MiniRequest {
    constructor(
        public pickupAddress: string,
        public deliveryAddress: string,
        public weight: number,
        public worth: number,
        public serviceOption: string,
        public pickupTime: Date,
        public deliveryTime: Date,
        public pickupLat: number,
        public pickupLng: number,
        public deliveryLat: number,
        public deliveryLng: number,
        public vehicleOption: string,
        public fullVehicleCapacity: boolean,
        public accompanyOption: string

    ) {}
}