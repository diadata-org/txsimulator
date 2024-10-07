FROM golang:1.19 as builder

WORKDIR /app

COPY temper .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o temper .


FROM alpine:latest

RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*

COPY --from=builder /app/temper .
 

ENTRYPOINT ["./temper"]