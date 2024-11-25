# Étape 1 : Construction de l'exécutable Go
FROM golang:1.22.3-alpine AS build

WORKDIR /root/

# Installer les dépendances pour SQLite
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Copier les fichiers go.mod et go.sum pour gérer les dépendances
COPY go.mod go.sum ./

# Copier le code source du backend
COPY . .

# Compiler le projet avec cgo activé
ENV CGO_ENABLED=1
RUN go build -o /go-server

# Étape 2 : Image exécutable
FROM alpine:latest

WORKDIR /root/

# Copier l'exécutable Go depuis l'étape précédente
COPY --from=build /go-server .

# Copier les fichiers de certificat depuis le dossier 'Server'
COPY Server/server.crt /etc/ssl/certs/
COPY Server/server.key /etc/ssl/private/

# Copier les fichiers de migration depuis le dossier 'Database'
COPY --from=build /root/ /root/

# Vérifiez les fichiers dans le conteneur
RUN ls -la /root/Database

# Exposer le port 8080
EXPOSE 8080

# Commande pour exécuter le serveur avec TLS sur le port 8080
CMD ["./go-server", "--cert", "/etc/ssl/certs/server.crt", "--key", "/etc/ssl/private/server.key"]
