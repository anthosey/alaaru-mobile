export class OnlineUsers {
    constructor(
        public name: string,
        public phone: string, 
        public picture: string, 
        public rating: number, 
        public vehicleType: string, 
        public vehicleReg: string,
        public vehicleDescription: string,
        public lat: number,
        public lng: number,
        public eta: number
        ) {}
}
