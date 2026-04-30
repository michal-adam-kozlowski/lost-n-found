/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface ApplicationUser
 */
export interface ApplicationUser {
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    blockedAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    userName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    normalizedUserName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    email?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    normalizedEmail?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ApplicationUser
     */
    emailConfirmed?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    passwordHash?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    securityStamp?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    concurrencyStamp?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    phoneNumber?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ApplicationUser
     */
    phoneNumberConfirmed?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ApplicationUser
     */
    twoFactorEnabled?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ApplicationUser
     */
    lockoutEnd?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ApplicationUser
     */
    lockoutEnabled?: boolean;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof ApplicationUser
     */
    accessFailedCount?: ApplicationUserAccessFailedCount;
}
/**
 * 
 * @export
 * @interface ApplicationUserAccessFailedCount
 */
export interface ApplicationUserAccessFailedCount {
}
/**
 * 
 * @export
 * @interface Category
 */
export interface Category {
    /**
     * 
     * @type {string}
     * @memberof Category
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof Category
     */
    name: string;
}
/**
 * 
 * @export
 * @interface CategoryResponse
 */
export interface CategoryResponse {
    /**
     * 
     * @type {string}
     * @memberof CategoryResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof CategoryResponse
     */
    name: string;
}
/**
 * 
 * @export
 * @interface Coordinate
 */
export interface Coordinate {
    /**
     * 
     * @type {CoordinateX}
     * @memberof Coordinate
     */
    x?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Coordinate
     */
    y?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Coordinate
     */
    z?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Coordinate
     */
    m?: CoordinateX;
    /**
     * 
     * @type {Coordinate}
     * @memberof Coordinate
     */
    coordinateValue?: Coordinate;
    /**
     * 
     * @type {boolean}
     * @memberof Coordinate
     */
    isValid?: boolean;
}
/**
 * 
 * @export
 * @interface CoordinateSequence
 */
export interface CoordinateSequence {
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof CoordinateSequence
     */
    dimension?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof CoordinateSequence
     */
    measures?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof CoordinateSequence
     */
    spatial?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {number}
     * @memberof CoordinateSequence
     */
    ordinates?: number;
    /**
     * 
     * @type {boolean}
     * @memberof CoordinateSequence
     */
    hasZ?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof CoordinateSequence
     */
    hasM?: boolean;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof CoordinateSequence
     */
    zOrdinateIndex?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof CoordinateSequence
     */
    mOrdinateIndex?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {Coordinate}
     * @memberof CoordinateSequence
     */
    first?: Coordinate;
    /**
     * 
     * @type {Coordinate}
     * @memberof CoordinateSequence
     */
    last?: Coordinate;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof CoordinateSequence
     */
    count?: ApplicationUserAccessFailedCount;
}
/**
 * 
 * @export
 * @interface CoordinateSequenceFactory
 */
export interface CoordinateSequenceFactory {
    /**
     * 
     * @type {number}
     * @memberof CoordinateSequenceFactory
     */
    ordinates?: number;
}
/**
 * 
 * @export
 * @interface CoordinateX
 */
export interface CoordinateX {
}
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
    categoryId: string;
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
     * @type {CreateItemRequestLongitude}
     * @memberof CreateItemRequest
     */
    longitude: CreateItemRequestLongitude | null;
    /**
     * 
     * @type {CreateItemRequestLongitude}
     * @memberof CreateItemRequest
     */
    latitude: CreateItemRequestLongitude | null;
    /**
     * 
     * @type {string}
     * @memberof CreateItemRequest
     */
    locationLabel: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateItemRequest
     */
    occurredAt: string;
}
/**
 * 
 * @export
 * @interface CreateItemRequestLongitude
 */
export interface CreateItemRequestLongitude {
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
 * @interface DownloadUrlResult
 */
export interface DownloadUrlResult {
    /**
     * 
     * @type {string}
     * @memberof DownloadUrlResult
     */
    downloadUrl: string;
    /**
     * 
     * @type {string}
     * @memberof DownloadUrlResult
     */
    expiresAt: string;
}
/**
 * 
 * @export
 * @interface ElevationModel
 */
export interface ElevationModel {
    /**
     * 
     * @type {Envelope}
     * @memberof ElevationModel
     */
    extent?: Envelope;
}
/**
 * 
 * @export
 * @interface Envelope
 */
export interface Envelope {
    /**
     * 
     * @type {boolean}
     * @memberof Envelope
     */
    isNull?: boolean;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    width?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    height?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    diameter?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    minX?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    maxX?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    minY?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    maxY?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    area?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    minExtent?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Envelope
     */
    maxExtent?: CoordinateX;
    /**
     * 
     * @type {Coordinate}
     * @memberof Envelope
     */
    centre?: Coordinate;
}
/**
 * 
 * @export
 * @interface Geometry
 */
export interface Geometry {
    /**
     * 
     * @type {GeometryFactory}
     * @memberof Geometry
     */
    factory?: GeometryFactory;
    /**
     * 
     * @type {any}
     * @memberof Geometry
     */
    userData?: any | null;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof Geometry
     */
    srid?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {string}
     * @memberof Geometry
     */
    geometryType?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Geometry
     */
    ogcGeometryType?: number;
    /**
     * 
     * @type {PrecisionModel}
     * @memberof Geometry
     */
    precisionModel?: PrecisionModel;
    /**
     * 
     * @type {Coordinate}
     * @memberof Geometry
     */
    coordinate?: Coordinate;
    /**
     * 
     * @type {Array<Coordinate>}
     * @memberof Geometry
     */
    coordinates?: Array<Coordinate> | null;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof Geometry
     */
    numPoints?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof Geometry
     */
    numGeometries?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {boolean}
     * @memberof Geometry
     */
    isSimple?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Geometry
     */
    isValid?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Geometry
     */
    isEmpty?: boolean;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Geometry
     */
    area?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Geometry
     */
    length?: CoordinateX;
    /**
     * 
     * @type {Point}
     * @memberof Geometry
     */
    centroid?: Point;
    /**
     * 
     * @type {Point}
     * @memberof Geometry
     */
    interiorPoint?: Point;
    /**
     * 
     * @type {Point}
     * @memberof Geometry
     */
    pointOnSurface?: Point;
    /**
     * 
     * @type {number}
     * @memberof Geometry
     */
    dimension?: number;
    /**
     * 
     * @type {Geometry}
     * @memberof Geometry
     */
    boundary?: Geometry;
    /**
     * 
     * @type {number}
     * @memberof Geometry
     */
    boundaryDimension?: number;
    /**
     * 
     * @type {Geometry}
     * @memberof Geometry
     */
    envelope?: Geometry;
    /**
     * 
     * @type {Envelope}
     * @memberof Geometry
     */
    envelopeInternal?: Envelope;
    /**
     * 
     * @type {boolean}
     * @memberof Geometry
     */
    isRectangle?: boolean;
}
/**
 * 
 * @export
 * @interface GeometryFactory
 */
export interface GeometryFactory {
    /**
     * 
     * @type {PrecisionModel}
     * @memberof GeometryFactory
     */
    precisionModel?: PrecisionModel;
    /**
     * 
     * @type {CoordinateSequenceFactory}
     * @memberof GeometryFactory
     */
    coordinateSequenceFactory?: CoordinateSequenceFactory;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof GeometryFactory
     */
    srid?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {ElevationModel}
     * @memberof GeometryFactory
     */
    elevationModel?: ElevationModel;
    /**
     * 
     * @type {NtsGeometryServices}
     * @memberof GeometryFactory
     */
    geometryServices?: NtsGeometryServices;
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
     * 
     * @type {string}
     * @memberof Item
     */
    createdByUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    categoryId?: string;
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    title: string;
    /**
     * "lost" | "found"
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
     * @type {string}
     * @memberof Item
     */
    locationLabel?: string | null;
    /**
     * 
     * @type {Point}
     * @memberof Item
     */
    location?: Point | null;
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    occurredAt?: string;
    /**
     * 
     * @type {string}
     * @memberof Item
     */
    createdAt?: string;
    /**
     * 
     * @type {ApplicationUser}
     * @memberof Item
     */
    createdByUser?: ApplicationUser;
    /**
     * 
     * @type {Category}
     * @memberof Item
     */
    category?: Category;
}
/**
 * 
 * @export
 * @interface ItemImage
 */
export interface ItemImage {
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    itemId?: string;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    storageBucket: string;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    objectKey: string;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    originalFileName: string;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    mimeType: string;
    /**
     * 
     * @type {ItemImageSizeBytes}
     * @memberof ItemImage
     */
    sizeBytes?: ItemImageSizeBytes;
    /**
     * 
     * @type {number}
     * @memberof ItemImage
     */
    uploadStatus?: number;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    thumbnailObjectKey?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    blurDataUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof ItemImage
     */
    uploadedByUserId?: string;
    /**
     * 
     * @type {Item}
     * @memberof ItemImage
     */
    item?: Item;
    /**
     * 
     * @type {ApplicationUser}
     * @memberof ItemImage
     */
    uploadedBy?: ApplicationUser | null;
}
/**
 * 
 * @export
 * @interface ItemImageInfo
 */
export interface ItemImageInfo {
    /**
     * 
     * @type {string}
     * @memberof ItemImageInfo
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ItemImageInfo
     */
    blurDataUrl: string | null;
}
/**
 * 
 * @export
 * @interface ItemImageSizeBytes
 */
export interface ItemImageSizeBytes {
}
/**
 * 
 * @export
 * @interface ItemResponse
 */
export interface ItemResponse {
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    categoryId: string;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    description: string | null;
    /**
     * 
     * @type {CreateItemRequestLongitude}
     * @memberof ItemResponse
     */
    longitude: CreateItemRequestLongitude | null;
    /**
     * 
     * @type {CreateItemRequestLongitude}
     * @memberof ItemResponse
     */
    latitude: CreateItemRequestLongitude | null;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    locationLabel: string | null;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    occurredAt: string;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof ItemResponse
     */
    createdByUserId: string | null;
    /**
     * 
     * @type {Array<ItemImageInfo>}
     * @memberof ItemResponse
     */
    images: Array<ItemImageInfo>;
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
 * @interface NtsGeometryServices
 */
export interface NtsGeometryServices {
    /**
     * 
     * @type {object}
     * @memberof NtsGeometryServices
     */
    geometryOverlay?: object;
    /**
     * 
     * @type {object}
     * @memberof NtsGeometryServices
     */
    geometryRelate?: object;
    /**
     * 
     * @type {object}
     * @memberof NtsGeometryServices
     */
    coordinateEqualityComparer?: object;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof NtsGeometryServices
     */
    defaultSRID?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {CoordinateSequenceFactory}
     * @memberof NtsGeometryServices
     */
    defaultCoordinateSequenceFactory?: CoordinateSequenceFactory;
    /**
     * 
     * @type {PrecisionModel}
     * @memberof NtsGeometryServices
     */
    defaultPrecisionModel?: PrecisionModel;
    /**
     * 
     * @type {ElevationModel}
     * @memberof NtsGeometryServices
     */
    defaultElevationModel?: ElevationModel;
}
/**
 * 
 * @export
 * @interface Point
 */
export interface Point {
    /**
     * 
     * @type {CoordinateSequence}
     * @memberof Point
     */
    coordinateSequence?: CoordinateSequence;
    /**
     * 
     * @type {Array<Coordinate>}
     * @memberof Point
     */
    coordinates?: Array<Coordinate> | null;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof Point
     */
    numPoints?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {boolean}
     * @memberof Point
     */
    isEmpty?: boolean;
    /**
     * 
     * @type {number}
     * @memberof Point
     */
    dimension?: number;
    /**
     * 
     * @type {number}
     * @memberof Point
     */
    boundaryDimension?: number;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Point
     */
    x?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Point
     */
    y?: CoordinateX;
    /**
     * 
     * @type {Coordinate}
     * @memberof Point
     */
    coordinate?: Coordinate;
    /**
     * 
     * @type {string}
     * @memberof Point
     */
    geometryType?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Point
     */
    ogcGeometryType?: number;
    /**
     * 
     * @type {Geometry}
     * @memberof Point
     */
    boundary?: Geometry;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Point
     */
    z?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Point
     */
    m?: CoordinateX;
    /**
     * 
     * @type {GeometryFactory}
     * @memberof Point
     */
    factory?: GeometryFactory;
    /**
     * 
     * @type {any}
     * @memberof Point
     */
    userData?: any | null;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof Point
     */
    srid?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {PrecisionModel}
     * @memberof Point
     */
    precisionModel?: PrecisionModel;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof Point
     */
    numGeometries?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {boolean}
     * @memberof Point
     */
    isSimple?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Point
     */
    isValid?: boolean;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Point
     */
    area?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof Point
     */
    length?: CoordinateX;
    /**
     * 
     * @type {Point}
     * @memberof Point
     */
    centroid?: Point;
    /**
     * 
     * @type {Point}
     * @memberof Point
     */
    interiorPoint?: Point;
    /**
     * 
     * @type {Point}
     * @memberof Point
     */
    pointOnSurface?: Point;
    /**
     * 
     * @type {Geometry}
     * @memberof Point
     */
    envelope?: Geometry;
    /**
     * 
     * @type {Envelope}
     * @memberof Point
     */
    envelopeInternal?: Envelope;
    /**
     * 
     * @type {boolean}
     * @memberof Point
     */
    isRectangle?: boolean;
}
/**
 * 
 * @export
 * @interface PrecisionModel
 */
export interface PrecisionModel {
    /**
     * 
     * @type {boolean}
     * @memberof PrecisionModel
     */
    isFloating?: boolean;
    /**
     * 
     * @type {ApplicationUserAccessFailedCount}
     * @memberof PrecisionModel
     */
    maximumSignificantDigits?: ApplicationUserAccessFailedCount;
    /**
     * 
     * @type {CoordinateX}
     * @memberof PrecisionModel
     */
    scale?: CoordinateX;
    /**
     * 
     * @type {CoordinateX}
     * @memberof PrecisionModel
     */
    gridSize?: CoordinateX;
    /**
     * 
     * @type {number}
     * @memberof PrecisionModel
     */
    precisionModelType?: number;
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
     * @type {ItemImageSizeBytes}
     * @memberof PresignImageRequest
     */
    sizeBytes: ItemImageSizeBytes;
}
/**
 * 
 * @export
 * @interface PresignResult
 */
export interface PresignResult {
    /**
     * 
     * @type {string}
     * @memberof PresignResult
     */
    imageId: string;
    /**
     * 
     * @type {string}
     * @memberof PresignResult
     */
    objectKey: string;
    /**
     * 
     * @type {string}
     * @memberof PresignResult
     */
    uploadUrl: string;
    /**
     * 
     * @type {string}
     * @memberof PresignResult
     */
    expiresAt: string;
    /**
     * 
     * @type {{ [key: string]: string; }}
     * @memberof PresignResult
     */
    headers: { [key: string]: string; };
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
