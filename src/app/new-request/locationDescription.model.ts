export class LocationDescription {
    constructor(
    public pickupAddress: string,
    public deliveryAddress: string,
    public weight: number,
    public monetaryValue: number,
    public serviceOption: string,
    public pickupTime: Date,
    public deliveryTime: Date) {}
}
