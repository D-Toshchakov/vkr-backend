import { IPaymentStatus } from "@a2seven/yoo-checkout"

class AmountPayment {
    value: string
    currency: string
}

class ObjectPayment {
    id: string
    status: string
    amount: AmountPayment
    metadata: { orderId: number }
    payment_method: {
        type: string;
        id: string;
        saved: boolean;
        title?: string;
        card?: object
    };
    created_at: string;
    expires_at: string;
}


export class PaymentStatusDto {
    event: 'payment.succeeded' | 'payment.waiting_for_capture' | 'payment.canceled' | 'refund.succeeded'
    //IPaymentStatus
    type: string
    object: ObjectPayment
}