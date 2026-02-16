init & auth: 4h
orgs: 1h e 30m
 - create org
 - find org
invites: 2h e 30m
 - invite user
 - revoke invite
 - accept invite
members: ESTIMATIVA 1h
 - change role of member
 - remove member
apiKeys: ESTIMATIVA 2h e 30m
 - generate key
 - list keys (paginated)
 - revoke key
 - rotate key
audit: ESTIMATIVA 1h e 30m
  - create log
  - get logs (paginated)
  - ORG_CREATED
  - INVITE_CREATED
  - INVITE_REVOKED
  - MEMBER_ADDED
  - MEMBER_REMOVED
  - MEMBER_ROLE_CHANGED
  - API_KEY_CREATED
  - API_KEY_REVOKED
  - API_KEY_ROTATED
events: ESTIMATIVA 2h
 - create event - ratelimit
 - list events (paginated) - ratelimit
usage: ESTIMATIVA 1h e 30m
 - save rate limit in db
 - cron every 00:00
 - get usage by org
 - get usage by key
/health ESTIMATIVA 15m
