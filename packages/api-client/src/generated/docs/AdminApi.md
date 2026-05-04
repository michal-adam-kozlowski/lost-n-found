# AdminApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiAdminItemsItemIdDelete**](AdminApi.md#apiadminitemsitemiddelete) | **DELETE** /api/admin/items/{itemId} |  |
| [**apiAdminUsersGet**](AdminApi.md#apiadminusersget) | **GET** /api/admin/users | Get all users |
| [**apiAdminUsersUserIdBlockPost**](AdminApi.md#apiadminusersuseridblockpost) | **POST** /api/admin/users/{userId}/block | Blocks a user. |
| [**apiAdminUsersUserIdUnblockPost**](AdminApi.md#apiadminusersuseridunblockpost) | **POST** /api/admin/users/{userId}/unblock | Unblocks a user. |



## apiAdminItemsItemIdDelete

> apiAdminItemsItemIdDelete(itemId)



### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { ApiAdminItemsItemIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    itemId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiAdminItemsItemIdDeleteRequest;

  try {
    const data = await api.apiAdminItemsItemIdDelete(body);
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
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAdminUsersGet

> Array&lt;GetUserResponse&gt; apiAdminUsersGet()

Get all users

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { ApiAdminUsersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  try {
    const data = await api.apiAdminUsersGet();
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

[**Array&lt;GetUserResponse&gt;**](GetUserResponse.md)

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


## apiAdminUsersUserIdBlockPost

> apiAdminUsersUserIdBlockPost(userId)

Blocks a user.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { ApiAdminUsersUserIdBlockPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiAdminUsersUserIdBlockPostRequest;

  try {
    const data = await api.apiAdminUsersUserIdBlockPost(body);
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
| **userId** | `string` |  | [Defaults to `undefined`] |

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
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAdminUsersUserIdUnblockPost

> apiAdminUsersUserIdUnblockPost(userId)

Unblocks a user.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { ApiAdminUsersUserIdUnblockPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiAdminUsersUserIdUnblockPostRequest;

  try {
    const data = await api.apiAdminUsersUserIdUnblockPost(body);
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
| **userId** | `string` |  | [Defaults to `undefined`] |

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
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

