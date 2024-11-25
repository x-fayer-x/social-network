package Auth

import (
	"net/http"

	Query "Social-network/Database/Query"
)

func AccessControl(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		SessionToken := r.Header.Get("Session-Token")

		err := Query.CheckSession(SessionToken)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		next.ServeHTTP(w, r)
	})
}
