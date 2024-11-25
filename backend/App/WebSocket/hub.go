package WebSocket

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	models "Social-network/Database/Models"
	"Social-network/Database/Query"

	h "Social-network/App/Handler"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var mutex = &sync.Mutex{}

type GroupInfo struct {
	Type      string
	GroupList []int
	UUID      string
}

// Hub is the struct for the WebSocket
func HandleNotifsWebSocket(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(h.DatabaseKey)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	// fmt.Println("A new Connection has been established (notification)")

	var user_uuid string
	var notif models.Notification

	for {

		_, message, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(h.NotifWsMap, user_uuid)
			mutex.Unlock()
			// fmt.Println("Connection Closed (Notification), Error :", err)
			break
		}

		if err = json.Unmarshal(message, &notif); err != nil {
			// fmt.Println("Failure to Unmarshalling the Notification, Error : ", err)
		}

		mutex.Lock()
		_, exists := h.NotifWsMap[notif.SenderUUID]
		if !exists {
			h.NotifWsMap[notif.SenderUUID] = conn
			user_uuid = notif.SenderUUID
		}
		mutex.Unlock()

		fmt.Println("New Message has been received : ", string(message), h.NotifWsMap)
		if notif.ReceiverUUID == notif.SenderUUID {
			continue
		}
		if err = Query.AddNotification(db.(*sql.DB), &notif); err != nil {
			break
		}

		mutex.Lock()
		_, exists = h.NotifWsMap[notif.ReceiverUUID]
		mutex.Unlock()

		if !exists {
			continue
		}

		// fmt.Println("Notification has been send to ", notif.ReceiverUUID)
		h.NotifWsMap[notif.ReceiverUUID].WriteJSON(notif)
	}
}

func HandleGroupChatWebSocket(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(h.DatabaseKey)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	// fmt.Println("A new connection has been established (group chat)")

	var message models.ChatGroups
	var groupInfo GroupInfo

messageloop:
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			for group_id := range groupInfo.GroupList {
				for User_uuid, User_conn := range h.GroupMessageWsMap[group_id] {
					if User_conn == conn {
						delete(h.GroupMessageWsMap[group_id], User_uuid)
					}
				}
			}
			mutex.Unlock()
			// fmt.Println("Connection close (group chat) : ", h.GroupMessageWsMap)
			break
		}

		if err = json.Unmarshal(msg, &message); err != nil {
			// fmt.Println("Failure to Unmarshalling the group message, Error : ", err)
		}

		switch message.Type {
		case "init":
			InitializeGroup(msg, groupInfo, db, conn)
		default:
			if err := GroupeMessage(message, db); err != nil {
				break messageloop
			}
		}

	}
}

// Send message to a group
func GroupeMessage(message models.ChatGroups, db any) error {
	mutex.Lock()

	message.SenderUUID = Query.GetUserUUID(db.(*sql.DB), message.SenderUUID)
	message.ImgPath = ""

	if err := Query.AddGroupMessage(db.(*sql.DB), &message); err != nil {
		// fmt.Println("Error adding group message: ", err)
		return err
	}

	for _, conn := range h.GroupMessageWsMap[message.TargetID] {
		conn.WriteJSON(message)
	}

	mutex.Unlock()

	return nil
}

// Initialize the ws group chat
func InitializeGroup(msg []byte, groupInfo GroupInfo, db any, conn *websocket.Conn) {
	if err := json.Unmarshal(msg, &groupInfo); err != nil {
		// fmt.Println("Failure to Unmarshalling the Group, Error : ", err)
	}
	uuid := Query.GetUserUUID(db.(*sql.DB), groupInfo.UUID)

	mutex.Lock()

	for _, id := range groupInfo.GroupList {
		if h.GroupMessageWsMap[id] == nil {
			h.GroupMessageWsMap[id] = make(map[string]*websocket.Conn)
		}
		h.GroupMessageWsMap[id][uuid] = conn
	}

	mutex.Unlock()
}

func HandleUserChatWebSocket(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(h.DatabaseKey)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		// Log or return error
		return
	}

	defer conn.Close()

	var message models.ChatUsers

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(h.UserMessageWsMap, message.SenderUUID)
			mutex.Unlock()
			// fmt.Println("Connection close (User chat) : ", h.UserMessageWsMap)
			break
		}

		if err = json.Unmarshal(msg, &message); err != nil {
			fmt.Println("Failure to Unmarshalling the user message, Error : ", err)
			continue
		}

		message.SenderUUID = Query.GetUserUUID(db.(*sql.DB), message.SenderUUID)

		mutex.Lock()
		if _, exists := h.UserMessageWsMap[message.SenderUUID]; !exists {
			h.UserMessageWsMap[message.SenderUUID] = conn
			// fmt.Println("The map of the connection has been updated")
		}
		mutex.Unlock()

		mutex.Lock()

		if message.Type == "init" {
			// fmt.Println("is init")
			mutex.Unlock()
			continue
		}

		message.ImgPath = ""
		if err = Query.AddUserMessage(db.(*sql.DB), &message); err != nil {
			// fmt.Println("Failure to store user message, Error: ", err)
			mutex.Unlock()
			break
		}

		if _, exists := h.UserMessageWsMap[message.TargetUUID]; exists {
			// fmt.Println("the target is connected")
			h.UserMessageWsMap[message.TargetUUID].WriteJSON(message)
		}
		// to receiver

		mutex.Unlock()

		if err := conn.WriteJSON(message); err != nil {
			fmt.Println("Error sending message to client:", err)
		}

	}
}
