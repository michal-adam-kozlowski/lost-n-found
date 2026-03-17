/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface CreateItemRequest
 */
export interface CreateItemRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateItemRequest
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof CreateItemRequest
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof CreateItemRequest
     */
    description: string | null;
    /**
     * 
     * @type {CreateItemRequestLatitude}
     * @memberof CreateItemRequest
     */
    latitude: CreateItemRequestLatitude | null;
    /**
     * 
     * @type {CreateItemRequestLatitude}
     * @memberof CreateItemRequest
     */
    longitude: CreateItemRequestLatitude | null;
}
/**
 * 
 * @export
 * @interface CreateItemRequestLatitude
 */
export interface CreateItemRequestLatitude {
}
/**
 * 
 * @export
 * @interface CurrentUserResponse
 */
export interface CurrentUserResponse {
    /**
     * 
     * @type {string}
     * @memberof CurrentUserResponse
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof CurrentUserResponse
     */
    email: string;
}
/**
 * 
 * @export
 * @interface Item
 */
export interface Item {
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    id?: string;
    /**
     * "lost" | "found"
     * @type {string}
     * @memberof Item
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    description?: string | null;
    /**
     * 
     * @type {CreateItemRequestLatitude}
     * @memberof Item
     */
    latitude?: CreateItemRequestLatitude | null;
    /**
     * 
     * @type {CreateItemRequestLatitude}
     * @memberof Item
     */
    longitude?: CreateItemRequestLatitude | null;
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    createdAt?: string;
}
/**
 * 
 * @export
 * @interface LoginUserRequest
 */
export interface LoginUserRequest {
    /**
     * 
     * @type {string}
     * @memberof LoginUserRequest
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof LoginUserRequest
     */
    password: string;
}
/**
 * 
 * @export
 * @interface LoginUserResponse
 */
export interface LoginUserResponse {
    /**
     * 
     * @type {string}
     * @memberof LoginUserResponse
     */
    accessToken: string;
    /**
     * 
     * @type {string}
     * @memberof LoginUserResponse
     */
    expiresAtUtc: string;
    /**
     * 
     * @type {string}
     * @memberof LoginUserResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof LoginUserResponse
     */
    email: string;
}
/**
 * 
 * @export
 * @interface PresignImageRequest
 */
export interface PresignImageRequest {
    /**
     * 
     * @type {string}
     * @memberof PresignImageRequest
     */
    fileName: string;
    /**
     * 
     * @type {string}
     * @memberof PresignImageRequest
     */
    contentType: string;
    /**
     * 
     * @type {PresignImageRequestSizeBytes}
     * @memberof PresignImageRequest
     */
    sizeBytes: PresignImageRequestSizeBytes;
}
/**
 * 
 * @export
 * @interface PresignImageRequestSizeBytes
 */
export interface PresignImageRequestSizeBytes {
}
/**
 * 
 * @export
 * @interface ProblemDetails
 */
export interface ProblemDetails {
    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    type?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    title?: string | null;
    /**
     * 
     * @type {ProblemDetailsStatus}
     * @memberof ProblemDetails
     */
    status?: ProblemDetailsStatus | null;
    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    detail?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    instance?: string | null;
}
/**
 * 
 * @export
 * @interface ProblemDetailsStatus
 */
export interface ProblemDetailsStatus {
}
/**
 * 
 * @export
 * @interface RegisterUserRequest
 */
export interface RegisterUserRequest {
    /**
     * 
     * @type {string}
     * @memberof RegisterUserRequest
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof RegisterUserRequest
     */
    password: string;
}
/**
 * 
 * @export
 * @interface RegisterUserResponse
 */
export interface RegisterUserResponse {
    /**
     * 
     * @type {string}
     * @memberof RegisterUserResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof RegisterUserResponse
     */
    email: string;
}
/**
 * 
 * @export
 * @interface ValidationProblemDetails
 */
export interface ValidationProblemDetails {
    /**
     * 
     * @type {string}
     * @memberof ValidationProblemDetails
     */
    type?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ValidationProblemDetails
     */
    title?: string | null;
    /**
     * 
     * @type {ProblemDetailsStatus}
     * @memberof ValidationProblemDetails
     */
    status?: ProblemDetailsStatus | null;
    /**
     * 
     * @type {string}
     * @memberof ValidationProblemDetails
     */
    detail?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ValidationProblemDetails
     */
    instance?: string | null;
    /**
     * 
     * @type {{ [key: string]: Array<string>; }}
     * @memberof ValidationProblemDetails
     */
    errors?: { [key: string]: Array<string>; };
}
