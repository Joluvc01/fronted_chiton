export interface IProductionOrder {
    id:             number;
    customer:       string;
    generationDate: Date;
    deadline:       Date;
    completedDate:  Date;
    status:         string;
    details:        IDetail[];
    translateOrder: number;
}

export interface IDetail {
    id:        number;
    reference: number;
    quantity:  number;
}
