#!/bin/bash
# Release 2 controlled production tests. Labelled rows, deleted afterwards.
URL=https://shyld-ai-agents.vercel.app/api/form-intake
post() { # name, json
  curl -s -w "\n" -X POST "$URL" -H "Origin: https://shyldroofing.com" -H "Content-Type: application/json" -d "$2" | sed "s/^/$1 => /"
}
STAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
echo "started $STAMP"
post A '{"full_name":"Release Test A declined","phone":"+10000000011","service":"Roof Repair","notes":"release-test A notes","source":"release-test","request_id":"release-test-A-'$STAMP'","sms_consent":"no","sms_consent_promotional":"no","sms_consent_version":"2026-09-29","city":"Franklin","form_id":"inspection"}'
post B '{"full_name":"Release Test B affirmative","phone":"+10000000012","service":"Roof Replacement","notes":"release-test B notes","source":"release-test","request_id":"release-test-B-'$STAMP'","sms_consent":"yes","sms_consent_promotional":"no","sms_consent_at":"'$STAMP'","sms_consent_version":"2026-09-29","city":"Murfreesboro","form_id":"inspection"}'
post B-retry-immediate '{"full_name":"Release Test B affirmative","phone":"+10000000012","service":"Roof Replacement","notes":"release-test B notes","source":"release-test","request_id":"release-test-B-'$STAMP'","sms_consent":"yes","sms_consent_at":"'$STAMP'","sms_consent_version":"2026-09-29"}'
post C '{"full_name":"Release Test C malformed","phone":"+10000000013","service":"Gutters","source":"release-test","request_id":"release-test-C-'$STAMP'","sms_consent":"maybe","sms_opt_in":"yes please"}'
echo "D: two identical requests fired at once from two connections"
D='{"full_name":"Release Test D concurrent","phone":"+10000000014","service":"Siding","source":"release-test","request_id":"release-test-D-'$STAMP'","sms_consent":"yes","sms_consent_at":"'$STAMP'","sms_consent_version":"2026-09-29"}'
( post D1 "$D" ) & ( post D2 "$D" ) & wait
echo "B request_id: release-test-B-$STAMP" > r2-b-id.txt
echo "done $(date -u +%Y-%m-%dT%H:%M:%SZ)"
