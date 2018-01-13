export interface RouteConfig {
    path: string;
    model?: string;
    authentication?: Array<string> | boolean;
    methods?: Array<string>;
    authorization?: {
        permissionID: string;
        permissions?: object;
    }
}