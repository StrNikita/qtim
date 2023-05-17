FROM node:18.16.0 as dev

WORKDIR /qtim
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
CMD [ -d "node_modules" ] && npm run start:debug --debug 0.0.0.0:9229 || npm install && npm run start:dev --debug 0.0.0.0:9229