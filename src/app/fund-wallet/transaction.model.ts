export class Transaction {
    constructor(
        public transactionRef: string,
        public transactionTitle: string,
        public transactionAmount: number,
        public transactionStatus: string,
        public transactionDescription: string,
        public paymentStatus: string
        ) {}
}