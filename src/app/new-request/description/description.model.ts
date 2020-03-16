export class ItemDescription {
    constructor(
        public itemDescription: string,
        public pickupContactPerson: string,
        public pickupContactMobile: string,
        public pickupContactEmail: string,
        public deliveryContactPerson: string,
        public deliveryContactMobile: string,
        public deliveryContactEmail: string,
        public amount: number
    ) {}
}
