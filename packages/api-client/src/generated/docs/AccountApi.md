# AccountApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiAccountChangePasswordPost**](AccountApi.md#apiaccountchangepasswordpost) | **POST** /api/account/change-password | Changes the password of the currently authenticated user. |



## apiAccountChangePasswordPost

> apiAccountChangePasswordPost(changePasswordRequest)

Changes the password of the currently authenticated user.

### Example

```ts
import {
  Configuration,
  AccountApi,
} from '';
import type { ApiAccountChangePasswordPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // ChangePasswordRequest
    changePasswordRequest: ...,
  } satisfies ApiAccountChangePasswordPostRequest;

  try {
    const data = await api.apiAccountChangePasswordPost(body);
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
| **changePasswordRequest** | [ChangePasswordRequest](ChangePasswordRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |
| **400** | Bad Request |  -  |
| **401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

