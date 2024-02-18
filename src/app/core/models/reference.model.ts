export interface IReference {
    id:          number;
    description: string;
    image:       string;
    status:      string;
    details:     IDetail[];
}

export interface IDetail {
    id:       number;
    product:  string;
    quantity: number;
}
