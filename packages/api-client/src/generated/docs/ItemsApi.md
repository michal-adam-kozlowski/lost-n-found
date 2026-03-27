# ItemsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiItemsGet**](ItemsApi.md#apiitemsget) | **GET** /api/Items | Returns all items ordered from newest to oldest. |
| [**apiItemsIdDelete**](ItemsApi.md#apiitemsiddelete) | **DELETE** /api/Items/{id} | Deletes item and connected images. Only user who created the item can delete it. |
| [**apiItemsIdGet**](ItemsApi.md#apiitemsidget) | **GET** /api/Items/{id} | Returns the item from id. |
| [**apiItemsPost**](ItemsApi.md#apiitemspost) | **POST** /api/Items | Creates a new item. |



## apiItemsGet

> Array&lt;ItemResponse&gt; apiItemsGet()

Returns all items ordered from newest to oldest.

### Example

```ts
import {
  Configuration,
  ItemsApi,
} from '';
import type { ApiItemsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ItemsApi();

  try {
    const data = await api.apiItemsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ItemResponse&gt;**](ItemResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiItemsIdDelete

> apiItemsIdDelete(id)

Deletes item and connected images. Only user who created the item can delete it.

### Example

```ts
import {
  Configuration,
  ItemsApi,
} from '';
import type { ApiItemsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ItemsApi(config);

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiItemsIdDeleteRequest;

  try {
    const data = await api.apiItemsIdDelete(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiItemsIdGet

> ItemResponse apiItemsIdGet(id)

Returns the item from id.

### Example

```ts
import {
  Configuration,
  ItemsApi,
} from '';
import type { ApiItemsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ItemsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiItemsIdGetRequest;

  try {
    const data = await api.apiItemsIdGet(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ItemResponse**](ItemResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiItemsPost

> ItemResponse apiItemsPost(createItemRequest)

Creates a new item.

### Example

```ts
import {
  Configuration,
  ItemsApi,
} from '';
import type { ApiItemsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ItemsApi(config);

  const body = {
    // CreateItemRequest
    createItemRequest: ...,
  } satisfies ApiItemsPostRequest;

  try {
    const data = await api.apiItemsPost(body);
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
| **createItemRequest** | [CreateItemRequest](CreateItemRequest.md) |  | |

### Return type

[**ItemResponse**](ItemResponse.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **400** | Bad Request |  -  |
| **401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

