
export function getSide(side: any): number {
    if (typeof side === "number") {
        if (side === 1 || side === 2) {
            return side
        }
    }

    if (typeof side === "string") {
        if (side.toUpperCase() === 'BUY') {
            return 1
        }
        if (side.toUpperCase() === 'SELL') {
            return 2
        }
    }
    throw new Error('invalid param side')
}

export function getSideString(side: number): string {
    if (side === 1) {
        return 'BUY'
    } else if (side === 2) {
        return 'SELL'
    }
    throw new Error('invalid side')
}

export function extractPriceOrderId(orderKey: string | bigint): {
    price: number,
    orderId: number,
 } {
    // TODO
    return {price:0, orderId: 0}
}