# authService

## Email template

To edit the email template:

1. Go to `client_invitation.json` in the `src/templates/` folder.
2. Copy the `HtmlPart` content of the file and paste it in https://www.freeformatter.com/json-escape.html to unescape the JSON.
3. Edit the html, then copy the content and paste it in the same website.
4. Now escape the JSON and copy it again.
5. Paste it in the `src/templates/client_invitation.json` in the `HtmlPart` field.
6. Save the file and run:
   - `aws ses update-template --cli-input-json file://src/templates/client_invitation.json`

```
Note:
- You must have AWS CLI installed and configured.
```
