package roles

import "math"

const (
	Client  = 1
	Teacher = 1 << iota
	Admin   = math.MaxInt64
)

const (
	RoleClient  = "client"
	RoleAdmin   = "admin"
	RoleTeacher = "teacher"
)

var roles = map[string]struct{}{
	RoleClient:  {},
	RoleAdmin:   {},
	RoleTeacher: {},
}

var RoleMap = map[string]int64{
	RoleClient:  Client,
	RoleTeacher: Teacher,
	RoleAdmin:   Admin,
}

func Exists(role string) bool {
	_, ok := roles[role]

	return ok
}

func GetAccess(role ...int64) int64 {
	var sum int64
	for _, v := range role {
		sum |= v
	}

	return sum
}

func CheckAccess(role int64, req int64) bool {
	if req == 0 {
		return role == Admin
	}

	access := req & role

	return access == role || access == req
}
