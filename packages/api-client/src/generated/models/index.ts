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
