from nginx:latest

WORKDIR /usr/share/nginx/html

COPY src/* .
RUN chmod -R 755 .

COPY src/cmd.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/cmd.sh