FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim

# copy source code into container
WORKDIR /app
COPY . .

# install project
RUN uv sync

# expose ports for webui and smtp server
EXPOSE 5000 25

# command to run the application
CMD [ "uv", "run", "maildrop" ]
