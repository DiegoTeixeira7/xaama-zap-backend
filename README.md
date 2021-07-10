# xaama-zap-backend

User
- username
- phone
- password
- isOnline


Room
- type
- name
- description
- numberParticipants
- usersId: []
- userCreatorId
- usersIdAdmin: []
- messageId: []


Message
- roomId
- userId
- message


UserRoom
- userId
- roomId
- isOff
