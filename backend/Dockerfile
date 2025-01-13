# Use official node alpine image as the base image
FROM node:16-alpine

# Install dependencies including Chromium
RUN apk --no-cache add \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    freetype-dev \
    ca-certificates \
    font-noto \
    msttcorefonts-installer \
    fontconfig
COPY ./public/css/Fonts /usr/share/fonts/custom
RUN fc-cache -f
# Get the location of Chromium and assign it to a build argument
RUN CHROMIUM_PATH=$(which chromium) && echo "Chromium is installed at $CHROMIUM_PATH"

# Print the location of Chromium to confirm it’s installed, and assign it to an ENV variable
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
RUN npm install -g nodemon
# Your existing configurations ...
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3003
#CMD ["npm", "start"]
CMD ["nodemon","--legacy-watch" , "--watch", ".", "-e", "js,json", "app.js"]
