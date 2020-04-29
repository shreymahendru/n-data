"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
require("@nivinjoseph/n-ext");
const Knex = require("knex");
const Pg = require("pg");
const n_exception_1 = require("@nivinjoseph/n-exception");
class KnexPgDbConnectionFactory {
    constructor(config) {
        this._config = {
            client: "pg",
            pool: {
                min: 10,
                max: 100
            }
        };
        this._isDisposed = false;
        this._disposePromise = null;
        if (config && typeof config === "string") {
            const connectionString = config;
            n_defensive_1.given(connectionString, "connectionString").ensureHasValue().ensureIsString();
            this._config.connection = connectionString.trim();
            Pg.defaults.ssl = true;
        }
        else {
            const connectionConfig = config;
            n_defensive_1.given(connectionConfig, "connectionConfig").ensureHasValue().ensureIsObject()
                .ensureHasStructure({
                host: "string",
                port: "string",
                database: "string",
                username: "string",
                password: "string"
            });
            this._config.connection = {
                host: connectionConfig.host.trim(),
                port: Number.parseInt(connectionConfig.port.trim()),
                database: connectionConfig.database.trim(),
                user: connectionConfig.username.trim(),
                password: connectionConfig.password.trim()
            };
        }
        this._knex = Knex(this._config);
    }
    create() {
        if (this._isDisposed)
            return Promise.reject(new n_exception_1.ObjectDisposedException(this));
        return Promise.resolve(this._knex);
    }
    dispose() {
        if (!this._isDisposed) {
            this._isDisposed = true;
            this._disposePromise = new Promise((resolve, reject) => this._knex.destroy().then(() => resolve()).catch((err) => reject(err)));
        }
        return this._disposePromise;
    }
}
exports.KnexPgDbConnectionFactory = KnexPgDbConnectionFactory;
//# sourceMappingURL=knex-pg-db-connection-factory.js.map