export interface Product {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    barcode: string;
    minStockRequired: number;
    shelfLife: number;
}

export interface Batch {
    id: number;
    productId: number;
    warehouseId: number;
    entryDate: string;
    currentStock: number;
}

export interface ProductBatches {
    id: number;
    name: string;
    description: string;
    barcode: string;
    batches: Batch[];
}

export interface ShelfLife {
    id: number;
    name: string;
}

export const shelfLifeValues: ShelfLife[] = [
    { id: 0, name: 'NO VENCE' },
    { id: 1, name: '15 DIAS' },
    { id: 2, name: '1 MES' },
    { id: 3, name: '3 MESES' },
    { id: 4, name: '6 MESES' },
    { id: 5, name: '1 AÑO' },
    { id: 6, name: 'MAS DE 1 AÑO' }
];