export declare class Quote {
    static description: string;
    get(tokenInStr: string, tokenOutStr: string, amountStr: string, recipient: string): Promise<any>;
}
