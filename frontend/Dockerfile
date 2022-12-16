FROM node:14.17.0-slim

LABEL version='1.0'

ARG APP_ROOT=/usr/local/app

RUN yarn add @mui/material @emotion/react @emotion/styled
RUN yarn add react-cookie
# Define build arguments
ARG USER_ID
ARG GROUP_ID

# Define environment variables
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID
ENV USER_ID=${USER_ID:-1001}
ENV GROUP_ID=${GROUP_ID:-1001}

# Add group and user based on build arguments
RUN addgroup --gid ${GROUP_ID} msir
RUN adduser --disabled-password --gecos '' --uid ${USER_ID} --gid ${GROUP_ID} msir

EXPOSE 13001
ENV LC_ALL C.UTF-8
ENV TZ Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p $APP_ROOT

ARG APP_ROOT_f=/usr/local/app/frontend
COPY . /APP_ROOT_f

WORKDIR /APP_ROOT_f

RUN yarn install

RUN yarn build
RUN yarn add serve-build
CMD ["yarn", "serve"]
