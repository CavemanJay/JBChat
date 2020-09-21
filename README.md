# JBChat
Client and server chat application for learning programming

## Architecture

### Server
- Language: Typescript (NodeJs)
- Message History: none (for now)
- Database: not required at this moment
- OS: anything

### Client
- Language: C++
- OS: linux + windows

## Flow
1. Server running and listening for inbound connections
2. A client will request a session and be given:
  - A unique ID to identify the client
  - A unique ID to identify the session (to share wtih other clients)
3. Server will then show available sessions and amount of connections
4. A client can specify an existing session id in message header and be connected to that session
