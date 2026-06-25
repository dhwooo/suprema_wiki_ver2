---
title: "Login API"
toc_label: "Login"  
---

마스터 게이트웨이 전용입니다.
{: .notice--info}

보다 안전한 통신을 위해 마스터 게이트웨이는 상호 인증을 채택하고 있습니다. 즉, 마스터 게이트웨이에 연결하려면 클라이언트가 자신의 인증서를 제공해야 합니다. 클라이언트 인증서에는 두 가지 유형이 있습니다.

Administrator certificate
: 기본적으로 마스터 게이트웨이를 위해 'administrator'라는 하나의 테넌트가 자동으로 생성됩니다. 테넌트 ID가 'administrator'인 인증서는 마스터 게이트웨이의 모든 게이트웨이와 장치에 접근할 수 있습니다. [LoginAdmin](#LoginAdmin)을 사용하려면 administrator 인증서가 필요합니다.

Tenant certificate
: 다른 테넌트의 인증서는 해당 테넌트의 장치 게이트웨이에만 접근할 수 있습니다. 

이러한 인증서를 생성하는 방법은 [Certificate Management]({{'/master/certificate/' | relative_url}})를 참고하시기 바랍니다. 

## Login 

다른 API를 사용하기 전에 마스터 게이트웨이에 로그인해야 합니다. administrator 인증서를 사용하면 [LoginAdmin](#LoginAdmin)을 사용하여 모든 장치 게이트웨이 또는 장치에 연결할 수 있습니다. 테넌트 인증서를 사용하는 경우에는 대신 [Login](#Login-1)을 사용해야 합니다. 
로그인에 성공하면 마스터 게이트웨이는 JWT 토큰을 반환하며, 이 토큰은 [GRPC 호출 자격 증명](https://grpc.io/docs/guides/auth/)으로 사용해야 합니다. 자세한 내용은 선택한 언어의 빠른 시작 가이드를 참고하시기 바랍니다. 

### Login

일반 테넌트로서 마스터 게이트웨이에 로그인합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantCert | string | PEM 형식의 테넌트 인증서 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| jwtToken | string | 호출 자격 증명으로 사용해야 하는 JWT 토큰 |

### LoginAdmin

administrator로서 마스터 게이트웨이에 로그인합니다. 인증서는 'administrator' 테넌트 ID로 발급되어야 합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| adminTenantCert | string | PEM 형식의 administrator 인증서 |
| tenantID | string | 테넌트의 ID입니다. [Tenant API]({{'/master/tenant/' | relative_url}})를 사용하려면 'administrator'여야 합니다. 다른 테넌트에 접근하려면 해당 테넌트의 ID를 사용합니다 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| jwtToken | string | 호출 자격 증명으로 사용해야 하는 JWT 토큰 |