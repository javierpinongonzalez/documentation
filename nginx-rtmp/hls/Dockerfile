#
# Alpine Dockerfile with Nginx server prepared for RTMP 
# Ref.: https://hub.docker.com/r/tiangolo/nginx-rtmp/~/dockerfile/

FROM buildpack-deps:jessie 

# Versions of Nginx and nginx-rtmp-module to use 
ENV NGINX_VERSION nginx-1.11.3 
ENV NGINX_RTMP_MODULE_VERSION 1.1.9 

# Install dependencies 
RUN apt-get update && \
    apt-get install -y ca-certificates openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Download and decompress Nginx 
RUN mkdir -p /tmp/build/nginx && \
    cd /tmp/build/nginx && \
    wget -O ${NGINX_VERSION}.tar.gz https://nginx.org/download/${NGINX_VERSION}.tar.gz && \
    tar -zxf ${NGINX_VERSION}.tar.gz

# Download and decompress RTMP module 
RUN mkdir -p /tmp/build/nginx-rtmp-module && \
    cd /tmp/build/nginx-rtmp-module && \
    wget -O nginx-rtmp-module-${NGINX_RTMP_MODULE_VERSION}.tar.gz https://github.com/arut/nginx-rtmp-module/archive/v${NGINX_RTMP_MODULE_VERSION}.tar.gz && \
    tar -zxf nginx-rtmp-module-${NGINX_RTMP_MODULE_VERSION}.tar.gz && \
    cd nginx-rtmp-module-${NGINX_RTMP_MODULE_VERSION}

# Build and install Nginx 
# The default puts everything under /usr/local/nginx, so it's needed to change 
# it explicitly. Not just for order but to have it in the PATH 
RUN cd /tmp/build/nginx/${NGINX_VERSION} && \
    ./configure \
        --sbin-path=/usr/local/sbin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --pid-path=/var/run/nginx/nginx.pid \
        --lock-path=/var/lock/nginx/nginx.lock \
        --http-log-path=/var/log/nginx/access.log \
        --http-client-body-temp-path=/tmp/nginx-client-body \
        --with-http_ssl_module \
        --with-threads \
        --with-ipv6 \
        --add-module=/tmp/build/nginx-rtmp-module/nginx-rtmp-module-${NGINX_RTMP_MODULE_VERSION} && \
    make -j $(getconf _NPROCESSORS_ONLN) && \
    make install && \
    mkdir /var/lock/nginx && \
    rm -rf /tmp/build




# Install ffmpeg and it's dependencies
RUN apt-get update && apt-get -y install autoconf automake build-essential libass-dev libfreetype6-dev \
    libsdl2-dev libtheora-dev libtool libva-dev libvdpau-dev libvorbis-dev libxcb1-dev libxcb-shm0-dev \
    libxcb-xfixes0-dev pkg-config texinfo wget zlib1g-dev

RUN mkdir ~/ffmpeg_sources

RUN apt-get install yasm

RUN cd ~/ffmpeg_sources && \
    wget http://www.nasm.us/pub/nasm/releasebuilds/2.13.01/nasm-2.13.01.tar.bz2 && \
    tar xjvf nasm-2.13.01.tar.bz2 && \
    cd nasm-2.13.01 && \
    ./autogen.sh && \
    PATH="$HOME/bin:$PATH" ./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" && \
    PATH="$HOME/bin:$PATH" make && \
    make install

RUN apt-get -y install libx264-dev

RUN apt-get -y install cmake mercurial && \
    cd ~/ffmpeg_sources && \
    hg clone https://bitbucket.org/multicoreware/x265 && \
    cd ~/ffmpeg_sources/x265/build/linux && \
    PATH="$HOME/bin:$PATH" cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX="$HOME/ffmpeg_build" -DENABLE_SHARED:bool=off ../../source && \
    make && \
    make install

RUN cd ~/ffmpeg_sources && \
    wget -O fdk-aac.tar.gz https://github.com/mstorsjo/fdk-aac/tarball/master && \
    tar xzvf fdk-aac.tar.gz && \
    cd mstorsjo-fdk-aac* && \
    autoreconf -fiv && \
    ./configure --prefix="$HOME/ffmpeg_build" --disable-shared && \
    make && \
    make install

RUN apt-get -y install libmp3lame-dev

RUN apt-get -y install libopus-dev

RUN apt-get -y install libvpx-dev

RUN cd ~/ffmpeg_sources && \
    wget http://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2 && \
    tar xjvf ffmpeg-snapshot.tar.bz2 && \
    cd ffmpeg && \
    PATH="$HOME/bin:$PATH" PKG_CONFIG_PATH="$HOME/ffmpeg_build/lib/pkgconfig" ./configure \
    --prefix="$HOME/ffmpeg_build" \
    --pkg-config-flags="--static" \
    --extra-cflags="-I$HOME/ffmpeg_build/include" \
    --extra-ldflags="-L$HOME/ffmpeg_build/lib" \
    --bindir="$HOME/bin" \
    --enable-gpl \
    --enable-libass \
    --enable-libfdk-aac \
    --enable-libfreetype \
    --enable-libmp3lame \
    --enable-libopus \
    --enable-libtheora \
    --enable-libvorbis \
    --enable-libvpx \
    --enable-libx264 \
    --enable-libx265 \
    --enable-nonfree && \
    PATH="$HOME/bin:$PATH" make && \
    make install && \
    hash -r

# Forward logs to Docker 
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Create stream directory
RUN mkdir -p /HLS/live

# Set up config file  
COPY nginx.conf /etc/nginx/nginx.conf

# Expose rtmp port
EXPOSE 1935

CMD ["nginx", "-g", "daemon off;"]