# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiAuthLoginPost**](AuthApi.md#apiauthloginpost) | **POST** /api/auth/login |  |
| [**apiAuthMeGet**](AuthApi.md#apiauthmeget) | **GET** /api/auth/me |  |
| [**apiAuthRegisterPost**](AuthApi.md#apiauthregisterpost) | **POST** /api/auth/register |  |



## apiAuthLoginPost

> LoginUserResponse apiAuthLoginPost(loginUserRequest)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { ApiAuthLoginPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // LoginUserRequest
    loginUserRequest: ...,
  } satisfies ApiAuthLoginPostRequest;

  try {
    const data = await api.apiAuthLoginPost(body);
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
| **loginUserRequest** | [LoginUserRequest](LoginUserRequest.md) |  | |

### Return type

[**LoginUserResponse**](LoginUserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAuthMeGet

> CurrentUserResponse apiAuthMeGet()



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { ApiAuthMeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  try {
    const data = await api.apiAuthMeGet();
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

[**CurrentUserResponse**](CurrentUserResponse.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAuthRegisterPost

> RegisterUserResponse apiAuthRegisterPost(registerUserRequest)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { ApiAuthRegisterPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // RegisterUserRequest
    registerUserRequest: ...,
  } satisfies ApiAuthRegisterPostRequest;

  try {
    const data = await api.apiAuthRegisterPost(body);
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
| **registerUserRequest** | [RegisterUserRequest](RegisterUserRequest.md) |  | |

### Return type

[**RegisterUserResponse**](RegisterUserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

