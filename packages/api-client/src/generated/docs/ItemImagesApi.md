# ItemImagesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiItemsItemIdImagesImageIdConfirmPost**](ItemImagesApi.md#apiitemsitemidimagesimageidconfirmpost) | **POST** /api/items/{itemId}/images/{imageId}/confirm | Confirms that the frontend has successfully uploaded the file to storage.  Transitions the image record from Pending to Uploaded. |
| [**apiItemsItemIdImagesImageIdDelete**](ItemImagesApi.md#apiitemsitemidimagesimageiddelete) | **DELETE** /api/items/{itemId}/images/{imageId} | Deletes the specified image. Marks the DB record as Deleted and removes the object from storage. |
| [**apiItemsItemIdImagesImageIdDownloadUrlGet**](ItemImagesApi.md#apiitemsitemidimagesimageiddownloadurlget) | **GET** /api/items/{itemId}/images/{imageId}/download-url | Returns a time-limited presigned download URL for the specified image. |
| [**apiItemsItemIdImagesPresignPost**](ItemImagesApi.md#apiitemsitemidimagespresignpost) | **POST** /api/items/{itemId}/images/presign | Requests a presigned URL for uploading an image to the specified item.  The frontend should upload the file directly to the returned URL, then call the confirm endpoint. |



## apiItemsItemIdImagesImageIdConfirmPost

> ItemImage apiItemsItemIdImagesImageIdConfirmPost(itemId, imageId)

Confirms that the frontend has successfully uploaded the file to storage.  Transitions the image record from Pending to Uploaded.

### Example

```ts
import {
  Configuration,
  ItemImagesApi,
} from '';
import type { ApiItemsItemIdImagesImageIdConfirmPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ItemImagesApi(config);

  const body = {
    // string
    itemId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // string
    imageId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiItemsItemIdImagesImageIdConfirmPostRequest;

  try {
    const data = await api.apiItemsItemIdImagesImageIdConfirmPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **itemId** | `string` |  | [Defaults to `undefined`] |
| **imageId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ItemImage**](ItemImage.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiItemsItemIdImagesImageIdDelete

> apiItemsItemIdImagesImageIdDelete(itemId, imageId)

Deletes the specified image. Marks the DB record as Deleted and removes the object from storage.

### Example

```ts
import {
  Configuration,
  ItemImagesApi,
} from '';
import type { ApiItemsItemIdImagesImageIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ItemImagesApi(config);

  const body = {
    // string
    itemId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // string
    imageId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiItemsItemIdImagesImageIdDeleteRequest;

  try {
    const data = await api.apiItemsItemIdImagesImageIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **itemId** | `string` |  | [Defaults to `undefined`] |
| **imageId** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiItemsItemIdImagesImageIdDownloadUrlGet

> DownloadUrlResult apiItemsItemIdImagesImageIdDownloadUrlGet(itemId, imageId)

Returns a time-limited presigned download URL for the specified image.

### Example

```ts
import {
  Configuration,
  ItemImagesApi,
} from '';
import type { ApiItemsItemIdImagesImageIdDownloadUrlGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ItemImagesApi(config);

  const body = {
    // string
    itemId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // string
    imageId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiItemsItemIdImagesImageIdDownloadUrlGetRequest;

  try {
    const data = await api.apiItemsItemIdImagesImageIdDownloadUrlGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **itemId** | `string` |  | [Defaults to `undefined`] |
| **imageId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DownloadUrlResult**](DownloadUrlResult.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiItemsItemIdImagesPresignPost

> PresignResult apiItemsItemIdImagesPresignPost(itemId, presignImageRequest)

Requests a presigned URL for uploading an image to the specified item.  The frontend should upload the file directly to the returned URL, then call the confirm endpoint.

### Example

```ts
import {
  Configuration,
  ItemImagesApi,
} from '';
import type { ApiItemsItemIdImagesPresignPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ItemImagesApi(config);

  const body = {
    // string
    itemId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // PresignImageRequest
    presignImageRequest: ...,
  } satisfies ApiItemsItemIdImagesPresignPostRequest;

  try {
    const data = await api.apiItemsItemIdImagesPresignPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **itemId** | `string` |  | [Defaults to `undefined`] |
| **presignImageRequest** | [PresignImageRequest](PresignImageRequest.md) |  | |

### Return type

[**PresignResult**](PresignResult.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

