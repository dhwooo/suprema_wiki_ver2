---
title: "Error API"
---

[XXX_Multi commands]({{'/api/' | relative_url}}#xxx_multi-command)를 참고하십시오.

```protobuf
message MultiErrorResponse {
  repeated ErrorResponse deviceErrors;
}
```
{: #MultiErrorResponse}

[deviceErrors](#ErrorResponse) 
: 일부 대상 장치에서 발생한 오류입니다.

```protobuf
message ErrorResponse {
  uint32 deviceID;
  int32 code;
  string msg;
}
```
{: #ErrorResponse }

deviceID
: 오류가 발생한 장치의 ID입니다.

code
: [정의된](https://github.com/grpc/grpc/blob/master/doc/statuscodes.md) gRPC 오류 코드입니다.

msg
: 오류에 대한 보다 자세한 설명입니다. 
