FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY src/default.conf /etc/nginx/conf.d/default.conf

COPY src/favicon.ico .
COPY src/image.svg .
COPY src/index.html .
COPY src/script.js .
COPY src/styles.css .
RUN chmod -R 755 .

COPY src/cmd.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/cmd.sh