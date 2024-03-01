export interface IPurchaseOrder {
    id:             number;
    generationDate: Date;
    status:     string;
    details:        IDetail[];
}

export interface IDetail {
    id:       number;
    product:  string;
    quantity: number;
}
