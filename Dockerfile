FROM node:latest
WORKDIR /app
COPY . . /app/
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start" ]

#  docker build -t 4erp .