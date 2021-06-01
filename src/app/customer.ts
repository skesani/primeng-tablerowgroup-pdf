export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: number;
    country?: any;
    company?: string;
    date?: string;
    status?: string;
    representative?: any;
}
