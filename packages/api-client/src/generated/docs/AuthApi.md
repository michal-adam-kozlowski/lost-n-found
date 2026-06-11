# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiAuthConfirmEmailGet**](AuthApi.md#apiauthconfirmemailget) | **GET** /api/auth/confirm-email |  |
| [**apiAuthForgotPasswordPost**](AuthApi.md#apiauthforgotpasswordpost) | **POST** /api/auth/forgot-password |  |
| [**apiAuthLoginPost**](AuthApi.md#apiauthloginpost) | **POST** /api/auth/login | Logs in a user and returns a JWT access token. |
| [**apiAuthMeGet**](AuthApi.md#apiauthmeget) | **GET** /api/auth/me | Test endpoint that verifies the bearer token and returns the current user. |
| [**apiAuthRegisterPost**](AuthApi.md#apiauthregisterpost) | **POST** /api/auth/register | Registers a new user and returns a JWT access token. |
| [**apiAuthResetPasswordPost**](AuthApi.md#apiauthresetpasswordpost) | **POST** /api/auth/reset-password |  |



## apiAuthConfirmEmailGet

> apiAuthConfirmEmailGet(userId, token)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { ApiAuthConfirmEmailGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // string (optional)
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // string (optional)
    token: token_example,
  } satisfies ApiAuthConfirmEmailGetRequest;

  try {
    const data = await api.apiAuthConfirmEmailGet(body);
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
| **userId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **token** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAuthForgotPasswordPost

> apiAuthForgotPasswordPost(forgotPasswordRequest)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { ApiAuthForgotPasswordPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // ForgotPasswordRequest
    forgotPasswordRequest: ...,
  } satisfies ApiAuthForgotPasswordPostRequest;

  try {
    const data = await api.apiAuthForgotPasswordPost(body);
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
| **forgotPasswordRequest** | [ForgotPasswordRequest](ForgotPasswordRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAuthLoginPost

> LoginUserResponse apiAuthLoginPost(loginUserRequest)

Logs in a user and returns a JWT access token.

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

Test endpoint that verifies the bearer token and returns the current user.

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

> LoginUserResponse apiAuthRegisterPost(registerUserRequest)

Registers a new user and returns a JWT access token.

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
| **400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAuthResetPasswordPost

> apiAuthResetPasswordPost(resetPasswordRequest)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { ApiAuthResetPasswordPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // ResetPasswordRequest
    resetPasswordRequest: ...,
  } satisfies ApiAuthResetPasswordPostRequest;

  try {
    const data = await api.apiAuthResetPasswordPost(body);
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
| **resetPasswordRequest** | [ResetPasswordRequest](ResetPasswordRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

