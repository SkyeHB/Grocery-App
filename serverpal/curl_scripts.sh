DOMAIN="http://localhost:8080"
JSON_TYPE="Content-Type: application/json"

# Route tests

# --- Login ---
echo "Testing $DOMAIN/login/"
token=$(curl -s $DOMAIN/login/ \
	-d '{"email":"Bob","password":"abc123"}' \
	-H "$JSON_TYPE" \
)

[ -z $token ] && exit 1

echo $token | jq .token 
echo $'\n\n'



# --- Protected route ---
echo "Testing: $DOMAIN/api/protected/"
protected=$(curl -s $DOMAIN/api/protected/ \
	-d "{\"token\":$token}" \
	-H "$JSON_TYPE" | jq .)

[ -z $protected ] && exit 1

echo "$protected" | jq .
echo $'\n\n'



# --- Logout ---	
echo "Testing: $DOMAIN/api/logout/"
echo "To be added from the front end..."

echo $'\n\n'



# --- Get user information ---
echo "Testing: $DOMAIN/api/user/"
user=$(curl -s "$DOMAIN/api/user/" \
	-d "{\"token\":$token}" \
	-H "$JSON_TYPE" | jq .user)

[ -z "$user" ] && exit 1

echo "$user" | jq .
echo $'\n\n'



# --- Get users ---
echo "Testing: $DOMAIN/api/users"
users=$(curl -s "$DOMAIN/api/users/" \
	-d "{\"token\":$token}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$users" ] && exit 1

echo "$users" | jq .
echo $'\n\n'



# --- User add ---
echo "Testing: $DOMAIN/api/user/add"
user_add_status=$(curl -s "$DOMAIN/api/user/add/" \
	-d "{\"token\":$token,\"email\":\"Alex\",\"password\":\"abc123456789\"}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$user_add_status" ] && exit 1

echo "$user_add_status" | jq .
echo $'\n\n'



# --- User delete ---
echo "Testing: $DOMAIN/api/user/delete/" 
user_delete_status=$(curl -s "$DOMAIN/api/user/delete/" \
	-d "{\"token\":$token,\"email\":\"Alex\",\"password\":\"abc123456789\"}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$user_delete_status" ] && exit 1

echo "$user_delete_status" | jq .
echo $'\n\n'



# --- User update ---
echo "Testing: $DOMAIN/api/user/update/" 
user_update_status=$(curl -s "$DOMAIN/api/user/update/" \
	-d "{\"token\":$token,\"email\":\"Alex\",\"password\":\"abc123456789\"}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$user_update_status" ] && exit 1

echo "$user_update_status" | jq .
echo $'\n\n'



# --- Item by ID ---
echo "Testing: $DOMAIN/api/item/1" 
item_by_id=$(curl -s "$DOMAIN/api/item/1" \
	-d "{}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$item_by_id" ] && exit 1

echo "$item_by_id" | jq .
echo $'\n\n'



# --- All Items ---
echo "Testing: $DOMAIN/api/items/" 
all_item=$(curl -s "$DOMAIN/api/items/" \
	-d "{}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$all_item" ] && exit 1

echo "$all_item" | jq .
echo $'\n\n'



# --- Item add ---
echo "Testing: $DOMAIN/api/item/add"
item_add_status=$(curl -s "$DOMAIN/api/item/add/" \
	-d "{\"token\":$token}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$item_add_status" ] && exit 1

echo "$item_add_status" | jq .
echo $'\n\n'


# --- Item delete ---
echo "Testing: $DOMAIN/api/item/delete"
item_delete_status=$(curl -s "$DOMAIN/api/item/delete/" \
	-d "{\"token\":$token}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$item_delete_status" ] && exit 1

echo "$item_delete_status" | jq .
echo $'\n\n'



# --- Item update ---
echo "Testing: $DOMAIN/api/item/updated"
item_update_status=$(curl -s "$DOMAIN/api/item/update/" \
	-d "{\"token\":$token}" \
	-H "$JSON_TYPE" | jq .)

[ -z "$item_update_status" ] && exit 1

echo "$item_update_status" | jq .
echo $'\n\n'
