# Backend Directory

# Setup

Still a WIP, but setup instructions are

1. Install python 3.7.2.
2. `pip3 install -r requirements.txt`. For some people this will just be pip if they only have python 3.7
3. Install and setup postgresql, on mac I would recommend using [homebrew](https://brew.sh) and then `brew install postgresql`.
4. Run the database setup instructions. If you name your database something else besides `bingbois`, you will have to change line 82 in the `settings.py` at time of writing or `DATABASES.default.name`.
5. `python3.7 manage.py runserver`. Again, this command might just be `python` for people who only have python 3.7.

NOTE: settings.py is ignored by github due to everyone having their own personal username, password, etc for the database.
Before running the server, make a copy (emphasis on copy) of settings_template.py as settings.py and change all the necessary fields.
