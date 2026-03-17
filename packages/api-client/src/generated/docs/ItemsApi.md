# ItemsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiItemsGet**](ItemsApi.md#apiitemsget) | **GET** /api/Items |  |
| [**apiItemsPost**](ItemsApi.md#apiitemspost) | **POST** /api/Items |  |



## apiItemsGet

> Array&lt;Item&gt; apiItemsGet()



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

[**Array&lt;Item&gt;**](Item.md)

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


## apiItemsPost

> Item apiItemsPost(createItemRequest)



### Example

```ts
import {
  Configuration,
  ItemsApi,
} from '';
import type { ApiItemsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ItemsApi();

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

[**Item**](Item.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

