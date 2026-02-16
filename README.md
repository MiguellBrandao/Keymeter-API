init & auth: 3h 30m + 30m = 4h
orgs: 1h e 30m
 - create org
 - find org
invites:
 - invite user
 - revoke invite
 - accept invite
members:
 - change role of member
 - remove member
apiKeys:
 - generate key
 - list keys (paginated)
 - revoke key
 - rotate key
audit
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
events:
 - create event - ratelimit
 - list events (paginated) - ratelimit
usage:
 - save rate limit in db
 - cron every 00:00
 - get usage by org
 - get usage by key
/health
