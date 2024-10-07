import { BaseCommand } from './Basecommand.js';
export declare class Quote extends BaseCommand {
    static description: string;
    run(): Promise<void>;
    get(tokenInStr: string, tokenOutStr: string, amountStr: string, recipient: string): Promise<void>;
}
