FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install yt-dlp
RUN apt-get update && apt-get install -y curl ffmpeg \
 && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
 && chmod a+rx /usr/local/bin/yt-dlp

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]
