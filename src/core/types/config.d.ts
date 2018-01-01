export interface Config {
    name: string;
    port: number;
    env: string;

    rootware?: {
        bodyParser?: boolean;
        methodOverride?: boolean;
        morgan?: boolean;
        compression?: boolean;
        helmet?: boolean;
        csurf: boolean;
    }
}