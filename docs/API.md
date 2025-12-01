## Routes

These are all of the routes in the maildrop API.

### Get Inbox
Gets the current inbox of an email address
```http
GET /get_inbox?address=you@yourdomain.com
```
**Parameters**
| Parameter | Description               |
| --------- | ------------------------- |
| `address` | The email address to get. |
   
**Response**
```json
[
  {
    "From": "sender@example.com",
    "To": "you@yourdomain.com",
    "Subject": "Hello",
    "Timestamp": 1764072990,
    "Body": "This is a test email.",
    "Sent": "Nov 25 at 12:16:30",
    "ContentType": "Text"
  }
]
```

### Get Random Address
Generates a random email address using the current domain  
```http
GET /get_random_address
```
**Response**
```json
{
  "address": "x9a2k1@yourdomain.com"
}
```

### Get Domain
Gets the current domain
```http
GET /get_domain
```
**Response**
```json
{
  "domain": "yourdomain.com"
}
```