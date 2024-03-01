export interface IProductionOrder {
    id:             number;
    customer:       string;
    generationDate: Date;
    deadline:       Date;
    status:         string;
    details:        IDetail[];
}

export interface IDetail {
    id:        number;
    reference: number;
    quantity:  number;
}
