import { 
    AptosAccount,
    AptosClient,
    TransactionBuilderABI,
    HexString,
    OptionalTransactionArgs } from "aptos";
import { SPOT_ABIS } from "./abis";
import { Pair, OrderInfo, PairOpenOrders } from './types'
import { extractPriceOrderId, getSideString } from './utils'

const sea = '0x393a63f47da7a757a252cb44fbab2afe602efe9d88e8ae84aac7db4949a9beb0'

export class SeaDex {
    protected aptosClient: AptosClient;
    protected txBuilder: TransactionBuilderABI;

    /**
     * Creates new Sea Dex Client instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient) {
        this.aptosClient = aptosClient;
        this.txBuilder = new TransactionBuilderABI(SPOT_ABIS.map((abi) => new HexString(abi).toUint8Array()));
    }

    funcName(mod: string, fn: string): string {
        return sea + "::" + mod + "::" + fn
    }

    spotFuncName(fn: string): string {
        return this.funcName('spot', fn)
    }

    // register pair
    async registerQuote(
        account: AptosAccount,
        quoteCoin: string,
        tickSize: number | bigint | string,
        minNotional: number | bigint | string,
        extraArgs?: OptionalTransactionArgs
    ): Promise<string> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('register_quote'),
            [quoteCoin],
            [account.address(), tickSize, minNotional]
        )
        return this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
    }

    // register pair
    async registerPair(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        coefficient: number | bigint | string,
        extraArgs?: OptionalTransactionArgs
    ): Promise<string> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('register_pair'),
            [baseCoin, quoteCoin, feeType],
            [account.address(), coefficient]
        )
        return this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
    }

    // get order info 
    async getOrderInfo(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        side: number,
        orderKey: string | bigint,
        extraArgs?: OptionalTransactionArgs
    ): Promise<OrderInfo> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('get_order_info'),
            [baseCoin, quoteCoin, feeType],
            [account.address(), side, orderKey]
        )
        let resp = await this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
        let data = JSON.parse(resp)
        let { price, orderId } = extractPriceOrderId(orderKey)
        let orderInfo = {
            price: price,
            side: getSideString(side),
            orderId: orderId,
            accountId: data.accountId as number,
            gridId: data.gridId as number,
            qty: data.qty as number,
            baseFrozen: data.baseFrozen as number,
            quoteFrozen: data.quoteFrozen as number,
        }
        return orderInfo
    }

    // get account open orders 
    async getAccountOpenOrders(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        side: number,
        orderKey: string | bigint,
        extraArgs?: OptionalTransactionArgs
    ): Promise<PairOpenOrders> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('get_account_pair_orders'),
            [baseCoin, quoteCoin, feeType],
            [account.address()]
        )
        let resp = await this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
        let data = JSON.parse(resp)

        return data
    }

    // place order
    async placeLimitOrder(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        side: number,
        price: number | bigint | string,
        qty: number | bigint | string,
        ioc: boolean,
        fok: boolean,
        extraArgs?: OptionalTransactionArgs
    ): Promise<string> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('place_limit_order'),
            [baseCoin, quoteCoin, feeType],
            [account.address(), side, price, qty, ioc, fok]
        )
        return this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
    }

    async placeMarketOrder(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        side: number,
        price: number | bigint | string,
        qty: number | bigint | string,
        extraArgs?: OptionalTransactionArgs
    ): Promise<string> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('place_market_order'),
            [baseCoin, quoteCoin, feeType],
            [account.address(), side, price, qty]
        )
        return this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
    }

    async placePostonlyOrder(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        side: number,
        price: number | bigint | string,
        qty: number | bigint | string,
        extraArgs?: OptionalTransactionArgs
    ): Promise<string> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('place_postonly_order'),
            [baseCoin, quoteCoin, feeType],
            [account.address(), side, price, qty]
        )
        return this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
    }

    // place grid order
    async placeGridOrder(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        buyPrice0: number | bigint | string,
        sellPrice0: number | bigint | string,
        qty: number | bigint | string,
        deltaPrice: number | bigint | string,
        extraArgs?: OptionalTransactionArgs
    ): Promise<string> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('place_grid_order'),
            [baseCoin, quoteCoin, feeType],
            [account.address(), buyPrice0, sellPrice0, qty, deltaPrice]
        )
        return this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
    }

    // place multiple orders, cancel orders
    async placeBulks() {

    }

    async cancelOrder(
        account: AptosAccount,
        baseCoin: string,
        quoteCoin: string,
        feeType: string,
        side: number,
        orderKey: string | bigint,
        extraArgs?: OptionalTransactionArgs
    ): Promise<string> {
        const payload = this.txBuilder.buildTransactionPayload(
            this.spotFuncName('cancel_order'),
            [baseCoin, quoteCoin, feeType],
            [account.address(), side, orderKey]
        )
        return this.aptosClient.generateSignSubmitTransaction(account, payload, extraArgs);
    }

    async cancelBatchOrder() {
    }
}
