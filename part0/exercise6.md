sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note and clicks Save

    Note right of browser: spa.js intercepts the form submit with e.preventDefault()
    Note right of browser: Browser adds the note to the local list and rerenders immediately

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: Server saves the note and responds 201 created
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: No redirect, no page reload, the user already sees the new note