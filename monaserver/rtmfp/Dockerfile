#
# Alpine Dockerfile with Nginx server prepared for RTMP 
# Ref.: https://hub.docker.com/r/tiangolo/nginx-rtmp/~/dockerfile/

FROM buildpack-deps:jessie

# Install dependencies 
RUN apt-get update && \
    apt-get install -y ca-certificates openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Install git
RUN apt-get install git

# Install LuaJIT
RUN cd /tmp && \
    git clone http://luajit.org/git/luajit-2.0.git && \
    cd luajit-2.0 && \
    make && \
    make install

# Install MonaServer
RUN mkdir -p /etc && \
    cd /etc && \
    git clone https://github.com/MonaSolutions/MonaServer.git && \
    cd MonaServer && \
    make

RUN mkdir -p /etc/MonaServer/MonaServer/www/live

EXPOSE 1935 
CMD ["bash"];