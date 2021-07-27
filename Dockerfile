FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN npm install react-scripts@3.4.1 -g
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
