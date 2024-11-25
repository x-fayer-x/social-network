package Server

import (
	"crypto/tls"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"Social-network/App"
	Cors "Social-network/App/MiddleWare/CORS"
)

type Server struct {
	App *App.App
}

func CreateServer(app *App.App) *Server {
	return &Server{App: app}
}

func (s *Server) Run(db *sql.DB) {
	Cert, _ := tls.LoadX509KeyPair("Server/server.crt", "Server/server.key")
	config := &tls.Config{
		Certificates: []tls.Certificate{Cert},
	}

	mux := http.NewServeMux()

	// http.HandleFunc("/api/ws", func(w http.ResponseWriter, r *http.Request) {
	// })

	s.App.HTTPServ(db, mux)

	server := &http.Server{
		Addr:      ":8080",
		TLSConfig: config,
		Handler:   Cors.AddCorsHeaders(mux),
	}

	fmt.Println("https://localhost:8080")
	log.Fatal(server.ListenAndServeTLS("Server/server.crt", "Server/server.key"))
}
