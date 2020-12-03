FROM node:14-alpine as builder

WORKDIR /assets

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of files
COPY . .

# Build the project
RUN npm run build-prod

FROM nginx:alpine as production-build
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from built assets
COPY --from=builder /assets/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
