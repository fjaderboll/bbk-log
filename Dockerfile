FROM nginx:1.23.3

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get -y --no-install-recommends install -y cron \
    # Remove package lists for smaller image sizes
    && rm -rf /var/lib/apt/lists/* \
    && which cron \
    && rm -rf /etc/cron.*/*

ADD https://frontend.bredbandskollen.se/download/bbk-cli_1.0.0_amd64.deb /tmp/bbk-cli_amd64.deb
RUN dpkg -i /tmp/bbk-cli_amd64.deb && rm /tmp/bbk-cli_amd64.deb

ADD start-services.sh /root/start-services.sh
ADD bbk-log.sh /root/bbk-log.sh

ADD bbk-cron /etc/cron.d/bbk-cron
RUN crontab /etc/cron.d/bbk-cron

ADD html/ /usr/share/nginx/html
RUN mkdir -p /data && touch /data/bbk.log && rm -f /usr/share/nginx/html/bbk.log && ln -s /data/bbk.log /usr/share/nginx/html/bbk.log

CMD /root/start-services.sh
