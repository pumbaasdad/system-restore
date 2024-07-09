FROM ubuntu/bind9:9.18-24.04_beta

ARG PUID
ARG PGID

RUN groupadd -g $PGID docker; \
    useradd -g $PGID -MN -s /sbin/nologin -u $PUID docker