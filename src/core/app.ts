import * as express from 'express';
import { Application, Handler } from 'express';
import { Config, Constructor, Providers, RouteConfig } from './';
import { DI } from 'tsjs-di';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as csurf from 'csurf';
import * as morgan from 'morgan';
import * as debug from 'debug';

debug('api-one');

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
        this.config.rootware.morgan && this.use(morgan('combined'));
    }

    get app() {
        return this.application;
    }

    register(provider: Constructor[] | Providers[] | Constructor | Providers): App {
        DI.register(provider);
        return this;
    }

    addRoutes(routes: Handler) {

    }

    createRoutes(routes: RouteConfig | RouteConfig[]): App {
        return this;
    }

    private defaultProviders(): App {
        return this;
    }

}
