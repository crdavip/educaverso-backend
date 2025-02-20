#/bin/bash
docker build -t crbeunik.azurecr.io/beunik/blog-api:remoteDebug .
docker push crbeunik.azurecr.io/beunik/blog-api:remoteDebug
helm upgrade -i blog-api ./helm -f ./helm/values.yaml --set image=crbeunik.azurecr.io/beunik/blog-api:remoteDebug
