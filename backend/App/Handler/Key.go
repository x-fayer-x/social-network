package Handler

import "github.com/gorilla/websocket"

type Key int

const DatabaseKey Key = iota

// indexs map values :
// 0 : notifs
// 1 : messages
// 2 : group messages

// var ConnectedUsers = make(map[string]map[string]*websocket.Conn)
var (
	NotifWsMap        = make(map[string]*websocket.Conn)
	UserMessageWsMap  = make(map[string]*websocket.Conn)
	GroupMessageWsMap = make(map[int]map[string]*websocket.Conn)
)
