## Day one practice - Core module
### Description
- Use core module of NodeJS like `fs`, `path` to open/read file system
- Create a GET endpoint to retrieve raw data from csv file
- Then handle raw data to response into a formatted json

### Setup
- Run `npm run start:dev day-one`
- Do a GET request to endpoint `/sample-data`
- Response should be:
```JSON
[
    {
        "email": "john@gmail.com",
        "birthday": "01/01/1990"
    },
    {
        "email": "teddy@outlook.com",
        "birthday": "02/03/1993"
    },
    {
        "email": "jenny@yahoo.vn",
        "birthday": "04/04/1998"
    }
]
```