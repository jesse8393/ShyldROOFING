# Lead notification email check, October 2, 2026

Question: why do Contact form notifications reach the Gmail Inbox while Text Us notifications do not?

Rules followed: email notifications only, SMS automation left disabled, Contact delivery left untouched, website
design unchanged, no backend, DNS, Resend or Vercel setting changed. No form was submitted and no email was sent
during this check.

Sources read: intake source `jesse8393/shyld-ai-agents` at commit f028e0f (`api/form-intake.js`), Vercel deployment
list, Resend emails, metrics, API logs, domains and suppressions, Gmail labels, searches and message reads, public
DNS, and the Supabase `public.leads` table. Collection was read only, then each claim was checked by a second
independent pass that tried to refute it.

## Verified

Each item below was observed directly.

1. **Same sending path.** Both forms post to the same intake endpoint and reach the same `notifyOwner` function
   (`api/form-intake.js` lines 271 to 316). Nothing in it branches on the form. It makes one request to Resend with
   from, to, subject and html only.
2. **Deployed code matches.** The newest ready production deployment of Vercel project `shyld-ai-agents`
   (`dpl_AUL2HaFadiDKe23MXEZSirfAerW5`) was built from commit f028e0f on September 29 at 12:19 UTC, before every
   test.
3. **Same request structure.** Resend logged request bodies for one Contact email (log `5e3c4228`) and two Text Us
   emails (logs `9455b6b7`, `a69c093e`). All three carry the same eight keys, the same sender
   `Shyld Leads <onboarding@resend.dev>`, the same single recipient, empty cc, bcc and reply to, no tags and no
   custom headers.
4. **Resend accepted and handed off every email.** All nine LAUNCH TEST emails show delivered, with zero bounced,
   complained, suppressed, delayed or failed. The account has no suppressions. Open and click tracking are off.
   Delivered means only that Gmail's mail server accepted the email. Resend shows no Inbox or Spam placement.
5. **Contact notifications are in the Inbox.** Gmail messages `1a0efe15de57973d` (Sept 30 01:15:18 UTC),
   `1a0f2116ee187c35` (Sept 30 11:27:03), `1a0f9f7be10f67d5` (Oct 2 00:15:57) and `1a0fa6008d231451`
   (Oct 2 02:09:52) all carry the INBOX label.
6. **Text Us notifications are absent from every place this session can search.** Resend shows four Text Us emails
   delivered: Sept 30 01:15:25, Sept 30 11:27:09, Oct 2 00:16:04 and Oct 2 02:09:59 UTC. None appears in Inbox,
   archive or Trash results. `subject:"text us form" in:anywhere` returned zero.
7. **Spam searches return nothing while Spam is not empty.** Gmail reports the SPAM label holds 434 messages
   (430 unread). Searches `in:spam`, `label:SPAM`, `is:unread in:spam` and `in:spam from:onboarding@resend.dev` all
   returned zero. As a control, `in:trash` returned Trash messages.
8. **The owner reported Spam message cannot be read here.** `get_message` and `get_thread` on `1a0efe178d5c0dda`
   return exactly `The caller does not have permission`. The Contact message from the same minute reads normally.
9. **Gmail changes are outside this connector's permission.** `unmark_message_spam` on `1a0efe178d5c0dda` returned
   exactly the text below. The message was not changed.

   ```text
   Insufficient scope: required "https://mail.google.com/ https://mail.google.com/mail/feed/atom https://mail.google.com https://mail.google.com/mail/feed/atom/ https://mail.google.com/mail https://mail.google.com/mail/ http://mail.google.com/ http://mail.google.com https://www.googleapis.com/auth/gmail.modify"
   ```
10. **The consent sentence alone does not cause Spam.** Earlier notifications from the same sender containing the
    "Yes to texts about this request" consent line reached the Inbox: `1a0ed1badb41d037` (Sept 29 12:20:08) and
    `1a0eaf466e17647e` (Sept 29 02:17:59).
11. **Quick bursts alone do not cause Spam.** Four notifications sent within four seconds on Sept 29 and three sent
    within one second all reached the Inbox.
12. **New consent wording did not change placement.** The Oct 2 02:09:59 Text Us email used version
    `text-us-2026-10-02` and is also absent from the Inbox.
13. **Sender domain.** Every notification comes from Resend's shared address `onboarding@resend.dev`.
    shyldroofing.com is verified in Resend but unused. Public DNS: DMARC `v=DMARC1; p=none`; DKIM key at
    `resend._domainkey.shyldroofing.com`; SPF `v=spf1 include:amazonses.com ~all` and MX to Amazon SES on
    `send.shyldroofing.com`.
14. **Vercel settings unreadable here.** Listing project environment variables returned
    `403 Forbidden {"code":"forbidden","message":"You don't have permission to list the project environment variable."}`.
15. **SMS stayed off.** The Oct 2 00:15 run recorded SMS skipped: `automation_disabled` for Text Us and `no_consent`
    for Contact. The SMS step runs after the email is sent.

## Differences between the two notifications

Sending structure: none (items 1 to 3). Content only:

| Part of the email | Contact | Text Us |
| --- | --- | --- |
| Subject | NEW LEAD: LAUNCH TEST contact form, Free Roof Inspection | NEW LEAD: LAUNCH TEST text us form, Free Roof Inspection |
| Heading | LAUNCH TEST contact form | LAUNCH TEST text us form |
| Phone in text and call links | +10000000041 | +10000000042 |
| Notes line | present, "launch test" plus a timestamp | absent, notes empty |
| City / address | Murfreesboro | Not given |
| Text consent | No. Do not send automated texts. | Yes to texts about this request at (time), wording (version) |
| Landing page | `/contact (contact), city: Murfreesboro` | `/text-us (legal)` |
| Footer form id | `inspection` | `sms-signup` |
| Source footer | `shyldroofing.com form.` | `shyldroofing.com/text-us.` |
| Size, rebuilt from source | about 987 HTML characters | about 928 HTML characters |

Identical in both: Needs, Email "Not given", Promotional texts "No", Source/Campaign, empty tracking fields.

The test script fills city and notes only on the Contact form, which explains the Notes and City differences.

## Inferences

Supported by evidence, not directly observed.

1. Message `1a0efe178d5c0dda` is the Sept 30 01:15:25 Text Us notification and sits in Spam. This rests on the
   owner's report plus the permission error, which appears only on that id.
2. The other three Text Us notifications are probably in Spam too. Only their absence from Inbox and Trash was
   observed; permanent deletion was not ruled out.
3. This Gmail connector probably does not expose Spam messages at all (item 7, item 8).
4. Authentication results are probably the same for both forms, given the same sender and infrastructure. No
   `Authentication-Results` header was read.
5. `NOTIFY_FROM` is probably unset in Vercel, judging by the sender Resend logged.

## Guesses

Not verified. With current data these cannot be told apart, because they always occur together.

1. Gmail may react to "text us" or `text-us` wording, which appears only in Text Us notifications.
2. The thinner Text Us body (no Notes, city "Not given") may count against it.
3. The word "legal" in the landing page line may count against it.
4. An earlier "Report spam" click, a personal Gmail filter or a Workspace admin rule may be the cause.

No Gmail spam reason or header has been observed, so a content cause remains unproven.

## Correction attempted

| Candidate | Result |
| --- | --- |
| Mark `1a0efe178d5c0dda` Not spam from this session | Blocked: `Insufficient scope` (item 9). Nothing changed. |
| Send from the verified shyldroofing.com domain (`NOTIFY_FROM`) | Not attempted. Settings unreadable (item 14), and it would change the Contact sender too without evidence that the sender is the cause. |
| Change Text Us email wording in the intake code | Not attempted. No evidence links wording to the Spam verdict. |
| Change Resend settings | Nothing to correct. |

## Labelled test

Not sent. The instruction allowed one labelled test after a justified correction. No correction was applied, and a
test without one would only repeat known results. Ready when a correction exists: one Text Us submission named
`LAUNCH TEST text us form 1002c`, phone 1 000 000 0043, everything else matching earlier runs, with Gmail SPAM and
INBOX counts recorded just before and after. Baseline at 02:41 UTC: SPAM 434 messages (430 unread), INBOX 7,881
messages (4,480 unread).

## Test rows

One delete attempt by exact id at about 02:41 UTC:

```sql
delete from public.leads where first_name = 'LAUNCH' and id in (
  '1969896b-587a-4a67-9b70-056c6497d9ba','18bd6732-456e-4bec-a472-cdc09816bd07',
  '2162c511-262f-4bb1-b218-18fbca9f556c','6e41837e-107e-4aae-8119-1e80c90794bb') returning id;
```

Exact error: `MCP server "Supabase" tool "execute_sql" timed out after 60s`

A read afterwards still returned all four rows. Postgres logs showed no entry after 02:14:07 UTC. The two genuine
leads were not touched.

## Remaining blockers

| Blocker | Who can clear it |
| --- | --- |
| Spam reason and headers for the Text Us notification are unseen | Owner: open the message in Gmail Spam, note the yellow banner reason, then Show original and copy the `Authentication-Results` lines |
| Location of the other three Text Us notifications | Owner: search Spam for "text us form" |
| Gmail filter or Not spam cannot be applied here | Owner: mark the Text Us notifications Not spam; create a filter `from:onboarding@resend.dev subject:"NEW LEAD"` with Never send it to Spam |
| Vercel settings cannot be read or changed here | Owner, only if headers point at the sender |
| Four test rows remain | Owner in the Supabase SQL editor with the statement above, or a later retry |

After the owner applies the filter or Not spam, run the one labelled test above.
