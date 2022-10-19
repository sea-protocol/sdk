export type Side = string

export interface Pair {
    base: string
    quote: string
    fee: number
}
export interface OrderInfo {
    price: string | number
    side: Side
    orderId: string | number | bigint
    accountId: number
    gridId: number
    qty: string | number | bigint
    baseFrozen: string | number | bigint
    quoteFrozen: string | number | bigint
}

export interface PairOpenOrders {
    bidOrders: OrderInfo[],
    askOrders: OrderInfo[],
}

export interface PairInfo {
    base_info: string,
    quote_info: string,
    paused: boolean,
    n_order: number,
    n_grid: number,
    fee_ratio: number,
    base_id: number,
    quote_id: number,
    pair_id: number,
    lot_size: number,
    price_ratio: number,       // price_coefficient*pow(10, base_precision-quote_precision)
    price_coefficient: number, // price coefficient, from 10^1 to 10^12
    last_price: number,        // last trade price
    last_timestamp: number,    // last trade timestamp
    ask0: number,
    ask_orders: number,
    bid0: number,
    bid_orders: number,
}
