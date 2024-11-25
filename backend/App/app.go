package App

import (
	"context"
	"database/sql"
	"net/http"

	h "Social-network/App/Handler"
	"Social-network/App/MiddleWare/Auth"
	ws "Social-network/App/WebSocket"
	"Social-network/Database"
)

// Struct for the App
type App struct {
	db *Database.DB
}

// function to create a new App
func CreateApp(db *Database.DB) *App {
	return &App{db: db}
}

func (app *App) HTTPServ(database *sql.DB, mux *http.ServeMux) {
	// ================================================================= Auth =================================================================
	// Handler Login
	mux.HandleFunc("POST /api/login", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.LoginHandler(w, r.WithContext(ctx))
	})

	// handler Logout
	mux.HandleFunc("POST /api/logout", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.LogoutHandler(w, r.WithContext(ctx))
	})

	// Handler Register
	mux.HandleFunc("POST /api/register", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.RegisterHandler(w, r.WithContext(ctx))
	})

	// ================================================================= Avatar =================================================================
	// Handler Post AVATAR
	mux.Handle("POST /api/user/avatar", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.AddAvatar(w, r.WithContext(ctx))
	})))

	// handler Delete AVATAR
	mux.Handle("DELETE /api/user/avatar", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.DeleteAvatar(w, r.WithContext(ctx))
	})))

	// handler Put AVATAR
	mux.Handle("PUT /api/user/avatar", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.UpdateAvatar(w, r.WithContext(ctx))
	})))

	// ================================================================= Post =================================================================
	// handler Get All Posts
	mux.Handle("GET /api/post", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.PostsHandler(w, r.WithContext(ctx))
	})))

	// handler Add Post
	mux.Handle("POST /api/post", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.PostHandler(w, r.WithContext(ctx))
	})))

	// Handler Get one post
	mux.Handle("GET /api/post/{id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.OnePostHandler(w, r.WithContext(ctx))
	})))

	mux.Handle("POST /api/post/image", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.ImagePostHandler(w, r.WithContext(ctx))
	})))

	mux.Handle("GET /api/post/image/{id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetImagePostHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("POST /api/post/like", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.AddPostLikeHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("DELETE /api/post/like/{post_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.DeletePostLikeHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("GET /api/post/like/{post_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetPostLikeHandler(w, r.WithContext(ctx))
	})))

	// ================================================================= User =================================================================

	// Handler Get user infos
	mux.Handle("GET /api/user/{uuid}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.UserInfosHandler(w, r.WithContext(ctx))
	})))

	// Handler Get user messages
	mux.Handle("GET /api/user/messages/{uuid}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetUserMessages(w, r.WithContext(ctx))
	})))

	// Handler Privacy user
	mux.Handle("POST /api/profile/privacy", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.PrivacyHandler(w, r.WithContext(ctx))
	})))

	// ================================================================= Groups =================================================================

	mux.Handle("GET /api/grouplist/{uuid}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GroupListHandler(w, r.WithContext(ctx))
	})))

	// Handler Get group infos
	mux.Handle("GET /api/group/{id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GroupInfosHandler(w, r.WithContext(ctx))
	})))

	// Handler Add group
	mux.Handle("POST /api/group", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.CreateGroupHandler(w, r.WithContext(ctx))
	})))

	// Handler Get group posts
	mux.Handle("GET /api/group/posts/{id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetGroupPostsHandler(w, r.WithContext(ctx))
	})))

	// Handler pour ajouter les user selectionné au groupe
	mux.Handle("POST /api/group/member", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.HandlerAddMembersToGroup(w, r.WithContext(ctx))
	})))

	// Handler get Followers
	mux.Handle("GET /api/group/invite/{group_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.InviteGroupHandler(w, r.WithContext(ctx))
	})))
	// handler pour avoir le nombre de membre dun group
	mux.Handle("GET /api/group/members/{group_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.HandlerGetMemberByGroupId(w, r.WithContext(ctx))
	})))

	// handler pour avoir le nombre de membre dun group
	mux.Handle("GET /api/group/messages/{group_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetGroupMessagesHandler(w, r.WithContext(ctx))
	})))

	// handler pour avoir le nombre de membre dun group
	// mux.Handle("POST /api/group/messages", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
	// 	h.AddGroupMessageHandler(w, r.WithContext(ctx))
	// })))

	// ================================================================= Follows =================================================================

	// Handler Add follow
	mux.Handle("POST /api/follow", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.ToggleFollowHandler(w, r.WithContext(ctx))
	})))

	// Handler get Followers
	mux.Handle("GET /api/followers/{uuid}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.UserFollowersHandler(w, r.WithContext(ctx))
	})))

	// Handler get Followers
	mux.Handle("GET /api/follows/{uuid}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.UserFollowsHandler(w, r.WithContext(ctx))
	})))

	// Handler Add follow
	mux.Handle("POST /api/follow/accept", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.AcceptFollowRequestHandler(w, r.WithContext(ctx))
	})))

	// ================================================================= Comments =================================================================

	// Handler get Followers
	mux.Handle("GET /api/comments/{post_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetCommentsHandler(w, r.WithContext(ctx))
	})))

	// Handler get Followers
	mux.Handle("POST /api/comments", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.CreateCommentHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("POST /api/comment/like", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.AddCommentLikeHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("DELETE /api/comment/like/{comment_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.DeleteCommentLikeHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("GET /api/comment/like/{comment_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetCommentLikeHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("GET /api/comment/image/{comment_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetImageCommentHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("POST /api/comment/image", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.CommentImageHandler(w, r.WithContext(ctx))
	})))

	// ================================================================= Search =================================================================

	mux.Handle("GET /api/search", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.HandlerSearchBar(w, r.WithContext(ctx))
	})))

	// ================================================================= Events =================================================================
	// Handler set Events
	mux.Handle("POST /api/event", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.AddEventHandler(w, r.WithContext(ctx))
	})))

	// Handler get Events
	mux.Handle("GET /api/event", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetEventsHandler(w, r.WithContext(ctx))
	})))

	// Handler get event choice
	mux.Handle("POST /api/event/choice", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.AddEventChoiceHandler(w, r.WithContext(ctx))
	})))

	mux.Handle("GET /api/event/image/{event_id}", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetImageEventHandler(w, r.WithContext(ctx))
	})))

	mux.Handle("POST /api/event/image", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.EventImageHandler(w, r.WithContext(ctx))
	})))

	// ================================================================= Notification =================================================================

	// Handler get Notifications
	mux.Handle("GET /api/notifs", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.GetNotifsHandler(w, r.WithContext(ctx))
	})))

	// Handler update pending notif
	mux.Handle("POST /api/group/group_member/pending", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.HandlerUpdatePending(w, r.WithContext(ctx))
	})))

	// handler update le seen des notifs
	mux.Handle("POST /api/seen", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.HandlerUpdateSeen(w, r.WithContext(ctx))
	})))

	// ================================================================= Messages ==================================================================

	mux.Handle("POST /api/message/image", Auth.AccessControl(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		h.ImageMessageHandler(w, r.WithContext(ctx))
	})))

	// ================================================================= Websocket =================================================================

	go mux.Handle("/api/ws/notifs", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		ws.HandleNotifsWebSocket(w, r.WithContext(ctx))
	}))

	go mux.Handle("/api/ws/group", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		ws.HandleGroupChatWebSocket(w, r.WithContext(ctx))
	}))

	go mux.Handle("/api/ws/user", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), h.DatabaseKey, database)
		ws.HandleUserChatWebSocket(w, r.WithContext(ctx))
	}))
}
