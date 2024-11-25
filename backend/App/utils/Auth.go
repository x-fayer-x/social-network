package utils

import (
	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func GenerateUUID(UserUUID *string) {
	uuid, _ := uuid.NewV4()
	*UserUUID = uuid.String()
}

func EncryptPassword(password *string) {
	bytePassword := []byte(*password)
	temphash, _ := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	*password = string(temphash)
}
