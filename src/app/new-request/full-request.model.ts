export class FullRequest {
    constructor(
        public logisticsType: string,
        public interstateServiceOption: string,
        public interstateCityFrom: string,
        public interstateCityTo: string,
        public fullVehicleCapacity: boolean,
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
        public itemDescription: string,
        public pickupContactPerson: string,
        public pickupContactMobile: string,
        public pickupContactEmail: string,
        public deliveryContactPerson: string,
        public deliveryContactMobile: string,
        public deliveryContactEmail: string,
        public amount: number,
        public pickupRef: string,
        public pickupPaymentStatus: string,
        public pickupProcessStatus: string,
        public pickupEntryTime: Date,
        public userID: string,
        public vehicleChoice: string,
        public accompanyOption: string


    ) {}
}
