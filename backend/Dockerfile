FROM golang

WORKDIR /backend

COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o /backend/build

EXPOSE 9090

CMD [ "/backend/build" ]