export class ApiResponse {

    success = false;
    data: { [name: string]: any } = {};
    error: { [name: string]: string } = {};
}