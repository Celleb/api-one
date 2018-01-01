import * as express from 'express';
import { Application } from 'express';
import { Config, DI, Constructor, Providers } from './';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as csurf from 'csurf';

export class App {
    private application: Application;
    constructor(private config: Config) {
        this.application = express();
    }

    use(...args: any[]): App {
        this.application.use(...args);
        return this;
    }


    private rootware(): void {
        this.config.rootware.helmet && this.use(helmet());
        this.config.rootware.methodOverride && this.use(methodOverride());
        this.config.rootware.bodyParser && this.use(bodyParser.urlencoded({
            extended: true
        })).use(bodyParser.json());
        this.config.rootware.csurf && this.use(csurf());
        this.config.rootware.compression && this.use(compression());
    }

    get app() {
        return this.application;
    }

    register(provider: Constructor[] | Providers[] | Constructor | Providers): App {
        DI.register(provider);
        return this;
    }

}
