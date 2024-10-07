dockerfile="./temper/Dockerfile"

 
imageName="transaction-simulator"
# type="scrapers" v1.4.210
type="services"

version="v0.1.1"
# version="v0.1.0"


build_and_push() {
        docker build --platform linux/amd64 -f "$1" -t "diadata.$2" .
        docker tag "diadata.$2" "us.icr.io/dia-registry/$3/$2:latest"
        docker push "us.icr.io/dia-registry/$3/$2:latest"

        docker tag "diadata.$2" "us.icr.io/dia-registry/$3/$2:$version"
        docker push "us.icr.io/dia-registry/$3/$2:$version"
}

build_and_push "$dockerfile" "$imageName" "$type"
