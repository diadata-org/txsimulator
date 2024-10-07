FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ADD alpharouter /usr/src/app

RUN yarn install
RUN yarn build

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# COPY cmd/interlay/index.js /usr/src/app/index.js
# COPY cmd/interlay/*.* /usr/src/app/

ENV NODE_OPTIONS=--max_old_space_size=3072

 
CMD [ "node", "build/index.js" ]
