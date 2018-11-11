# CSV Parser

You are participant of an Olympiad and csv files is important to you. Or is JSON not for you (are you kidding me man?).
Than that csv-parser for you. You can use it localy or like a api-service for your apps. 


### Usage

1) Execute nmp install
2) You can import function parseCsv from libs/csvParser 
3) Create mongo database called 'usersdb' and run it
4) Pass a path of a csv file in a parseCsv function as a parameter and run

OR

1) Execute nmp install
2) Create mongo database called 'usersdb' and run it
3) Run app.js
4) Send to the localhost or a configurated host a csv file via the post method


### Example of csv
See [an example of a csv file](https://github.com/nkitsan/csv-parser/blob/master/csv.csv)
Fields of user:
- Firstname (alphabet characters string)
- Lastname (alphabet characters string)
- Age (integer number)
- Email (email-string)
- Phone starts with belarussian code (string)
- Date of registration in a one of formats: ('YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD', 'DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY')

ATTENTION: all fields required
