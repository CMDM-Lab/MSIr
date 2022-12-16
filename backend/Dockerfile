FROM python:3.8.2-slim

ARG APP_ROOT=/usr/local/app
ARG BUILD_PACKAGES="build-base curl-dev git"
ARG DEV_PACKAGES="mariadb-dev yaml-dev zlib-dev nodejs yarn"

# create folder for app
RUN mkdir -p $APP_ROOT

WORKDIR /APP_ROOT


RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libmariadbclient-dev &&\
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn zip

RUN apt-get update && \
    rm -rf /var/lib/apt/lists/*
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

ARG APP_ROOT_b=/usr/local/app/backend
COPY . /APP_ROOT_b

# COPY a15-3_he_noline.jpg ./usr/local/app/backend
# COPY a15-3.ibd ./usr/local/app/backend
# COPY a15-3.imzml ./usr/local/app/backend



WORKDIR /APP_ROOT_b
RUN pip install --upgrade pip
RUN pip install -r requirement.txt
RUN yarn install

EXPOSE 13004

CMD ["yarn", "server"]
