class ApiConfig {
    static HOST = 'http://localhost';
    static PORT = 54321;

    static get BASE_URL() {
        return `${this.HOST}:${this.PORT}`;
    }

    constructor() {
        if (ApiConfig.instance) {
            return ApiConfig.instance;
        }

        ApiConfig.instance = this;
    }
}
