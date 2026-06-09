FROM python:3.14-slim

# copy source code into container
WORKDIR /app
COPY . .

# install packages
RUN pip install --no-cache-dir -r requirements.txt

# expose ports for webui and smtp server
EXPOSE 5000 25

# command to run the application
CMD [ "python", "/app/app.py" ]
