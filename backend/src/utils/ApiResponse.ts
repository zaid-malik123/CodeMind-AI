class ApiResponse {
    status: number;
    message: string;
    data: any;

    constructor(status: number = 200, message: string, data: any = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;